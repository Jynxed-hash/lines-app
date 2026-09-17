import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { buzz, ensureNotificationPermission } from '@/lib/notify';
import { SEED_VENUES, type Venue } from '@/lib/seed-venues';
import {
  applyPositionFlags,
  DEMO_AHEAD,
  findCrewByCode,
  isActiveStatus,
  markLeft,
  positionIn,
  selectWaitingHead,
  sortDoorQueue,
  waitCountsForVenue,
  type QueueEntry,
  type QueueStatus,
} from '@/state/queue-logic';

export type { QueueEntry, QueueStatus };

type NightValue = {
  venues: Venue[];
  entries: QueueEntry[];
  myEntryId: string | null;
  dealFilter: boolean;
  setDealFilter: (on: boolean) => void;
  visibleVenues: Venue[];
  myEntry: QueueEntry | null;
  unlockedVenueIds: string[];
  positionFor: (entry: QueueEntry) => number | null;
  waitForPartySize: (venueId: string, size: number) => { partiesAhead: number; peopleAhead: number };
  joinLine: (input: { venueId: string; partyName: string; partySize: number }) => void;
  joinCrew: (code: string) => boolean;
  leaveLine: () => void;
  rememberDoorUnlock: (venueId: string) => void;
  callNext: (venueId: string) => void;
  markAdmitted: (entryId: string) => void;
  markNoShow: (entryId: string) => void;
  activeQueue: (venueId: string) => QueueEntry[];
};

const NightContext = createContext<NightValue | null>(null);

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeInviteCode(venueId: string) {
  return `${venueId.slice(0, 4).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export { normalizeInviteCode } from '@/state/queue-logic';

export function NightProvider({ children }: { children: ReactNode }) {
  const [venues] = useState(SEED_VENUES);
  const [entries, setEntries] = useState<QueueEntry[]>(DEMO_AHEAD);
  const [myEntryId, setMyEntryId] = useState<string | null>(null);
  const [dealFilter, setDealFilter] = useState(false);
  const [unlockedVenueIds, setUnlockedVenueIds] = useState<string[]>([]);
  const buzzedRef = useRef({ third: new Set<string>(), next: new Set<string>() });

  const patchEntries = useCallback((updater: (current: QueueEntry[]) => QueueEntry[]) => {
    setEntries((current) => applyPositionFlags(updater(current), current));
  }, []);

  const visibleVenues = useMemo(
    () => (dealFilter ? venues.filter((venue) => venue.deals.length > 0) : venues),
    [dealFilter, venues]
  );

  const activeQueue = useCallback(
    (venueId: string) =>
      sortDoorQueue(entries.filter((entry) => entry.venueId === venueId && isActiveStatus(entry.status))),
    [entries]
  );

  const positionFor = useCallback((entry: QueueEntry) => positionIn(entries, entry), [entries]);

  const waitForPartySize = useCallback(
    (venueId: string, _size: number) => waitCountsForVenue(entries, venueId),
    [entries]
  );

  const rememberDoorUnlock = useCallback((venueId: string) => {
    setUnlockedVenueIds((current) => (current.includes(venueId) ? current : [...current, venueId]));
  }, []);

  const joinLine = useCallback(
    (input: { venueId: string; partyName: string; partySize: number }) => {
      void ensureNotificationPermission().then(() => {
        const entry: QueueEntry = {
          id: makeId(),
          venueId: input.venueId,
          partyName: input.partyName.trim() || 'Crew',
          partySize: Math.min(16, Math.max(1, input.partySize)),
          inviteCode: makeInviteCode(input.venueId),
          status: 'waiting',
          joinedAt: Date.now(),
          notifiedThird: false,
          notifiedNext: false,
        };
        patchEntries((current) => [...markLeft(current, myEntryId), entry]);
        setMyEntryId(entry.id);
      });
    },
    [myEntryId, patchEntries]
  );

  const joinCrew = useCallback(
    (code: string) => {
      const found = findCrewByCode(entries, code);
      if (!found) {
        return false;
      }
      if (found.notifiedThird) {
        buzzedRef.current.third.add(found.id);
      }
      if (myEntryId && myEntryId !== found.id) {
        patchEntries((current) => markLeft(current, myEntryId));
      }
      setMyEntryId(found.id);
      void ensureNotificationPermission();
      return true;
    },
    [entries, myEntryId, patchEntries]
  );

  const leaveLine = useCallback(() => {
    patchEntries((current) => markLeft(current, myEntryId));
    setMyEntryId(null);
  }, [myEntryId, patchEntries]);

  const callNext = useCallback(
    (venueId: string) => {
      patchEntries((current) => {
        const waiting = selectWaitingHead(current, venueId);
        if (!waiting) {
          return current;
        }
        return current.map((entry) =>
          entry.id === waiting.id ? { ...entry, status: 'called' as const } : entry
        );
      });
    },
    [patchEntries]
  );

  const markAdmitted = useCallback(
    (entryId: string) => {
      patchEntries((current) =>
        current.map((entry) => (entry.id === entryId ? { ...entry, status: 'admitted' as const } : entry))
      );
    },
    [patchEntries]
  );

  const markNoShow = useCallback(
    (entryId: string) => {
      patchEntries((current) =>
        current.map((entry) => (entry.id === entryId ? { ...entry, status: 'no_show' as const } : entry))
      );
    },
    [patchEntries]
  );

  useEffect(() => {
    if (!myEntryId) {
      return;
    }
    const mine = entries.find((entry) => entry.id === myEntryId);
    if (!mine) {
      return;
    }
    if (mine.notifiedThird && !buzzedRef.current.third.has(mine.id)) {
      buzzedRef.current.third.add(mine.id);
      const currentPos = positionIn(entries, mine);
      const title =
        currentPos !== null && currentPos !== 3 ? 'You’re close — hang nearby' : 'You are 3rd in queue';
      void buzz(title, `${mine.partyName} · party of ${mine.partySize}. Hang nearby.`);
    }
    if (mine.status === 'called' && mine.notifiedNext && !buzzedRef.current.next.has(mine.id)) {
      buzzedRef.current.next.add(mine.id);
      void buzz(
        'You’re next — walk up',
        `${mine.partyName} · the door is calling a party of ${mine.partySize}.`
      );
    }
  }, [entries, myEntryId]);

  const myEntry = entries.find((entry) => entry.id === myEntryId) ?? null;

  const value = useMemo<NightValue>(
    () => ({
      venues,
      entries,
      myEntryId,
      dealFilter,
      setDealFilter,
      visibleVenues,
      myEntry,
      unlockedVenueIds,
      positionFor,
      waitForPartySize,
      joinLine,
      joinCrew,
      leaveLine,
      rememberDoorUnlock,
      callNext,
      markAdmitted,
      markNoShow,
      activeQueue,
    }),
    [
      venues,
      entries,
      myEntryId,
      dealFilter,
      setDealFilter,
      visibleVenues,
      myEntry,
      unlockedVenueIds,
      positionFor,
      waitForPartySize,
      joinLine,
      joinCrew,
      leaveLine,
      rememberDoorUnlock,
      callNext,
      markAdmitted,
      markNoShow,
      activeQueue,
    ]
  );

  return <NightContext.Provider value={value}>{children}</NightContext.Provider>;
}

export function useNight() {
  const value = useContext(NightContext);
  if (!value) {
    throw new Error('useNight must be used inside NightProvider');
  }
  return value;
}
