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

import { buzz } from '@/lib/notify';
import { SEED_VENUES, type Venue } from '@/lib/seed-venues';

export type QueueStatus = 'waiting' | 'called' | 'admitted' | 'no_show';

export type QueueEntry = {
  id: string;
  venueId: string;
  partyName: string;
  partySize: number;
  inviteCode: string;
  status: QueueStatus;
  joinedAt: number;
  notifiedThird: boolean;
  notifiedNext: boolean;
};

type NightContextValue = {
  venues: Venue[];
  entries: QueueEntry[];
  myEntryId: string | null;
  dealFilter: boolean;
  setDealFilter: (on: boolean) => void;
  visibleVenues: Venue[];
  myEntry: QueueEntry | null;
  positionFor: (entry: QueueEntry) => number | null;
  waitForPartySize: (venueId: string, size: number) => { partiesAhead: number };
  joinLine: (input: { venueId: string; partyName: string; partySize: number }) => void;
  callNext: (venueId: string) => void;
  markAdmitted: (entryId: string) => void;
  markNoShow: (entryId: string) => void;
  activeQueue: (venueId: string) => QueueEntry[];
};

const NightContext = createContext<NightContextValue | null>(null);

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeInviteCode(venueId: string) {
  return `${venueId.slice(0, 4).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function isActive(status: QueueStatus) {
  return status === 'waiting' || status === 'called';
}

const DEMO_AHEAD: QueueEntry[] = [
  {
    id: 'demo-maya',
    venueId: 'atlas',
    partyName: 'Maya',
    partySize: 2,
    inviteCode: 'ATLA-DEMO',
    status: 'waiting',
    joinedAt: Date.now() - 120_000,
    notifiedThird: true,
    notifiedNext: false,
  },
  {
    id: 'demo-luis',
    venueId: 'atlas',
    partyName: 'Luis',
    partySize: 4,
    inviteCode: 'ATLA-CREW',
    status: 'waiting',
    joinedAt: Date.now() - 60_000,
    notifiedThird: true,
    notifiedNext: false,
  },
];

function positionIn(entries: QueueEntry[], entry: QueueEntry) {
  if (!isActive(entry.status)) {
    return null;
  }
  const queue = entries
    .filter((item) => item.venueId === entry.venueId && isActive(item.status))
    .sort((a, b) => a.joinedAt - b.joinedAt);
  const index = queue.findIndex((item) => item.id === entry.id);
  return index === -1 ? null : index + 1;
}

function applyPositionFlags(entries: QueueEntry[]): QueueEntry[] {
  let changed = false;
  const next = entries.map((entry) => {
    const position = positionIn(entries, entry);
    const notifiedThird = entry.notifiedThird || position === 3;
    const notifiedNext = entry.notifiedNext || position === 1;
    if (notifiedThird === entry.notifiedThird && notifiedNext === entry.notifiedNext) {
      return entry;
    }
    changed = true;
    return { ...entry, notifiedThird, notifiedNext };
  });
  return changed ? next : entries;
}

export function NightProvider({ children }: { children: ReactNode }) {
  const [venues] = useState(SEED_VENUES);
  const [entries, setEntries] = useState<QueueEntry[]>(DEMO_AHEAD);
  const [myEntryId, setMyEntryId] = useState<string | null>(null);
  const [dealFilter, setDealFilter] = useState(false);
  const buzzedRef = useRef({ third: new Set<string>(), next: new Set<string>() });

  const patchEntries = useCallback((updater: (current: QueueEntry[]) => QueueEntry[]) => {
    setEntries((current) => applyPositionFlags(updater(current)));
  }, []);

  const visibleVenues = useMemo(
    () => (dealFilter ? venues.filter((venue) => venue.deals.length > 0) : venues),
    [dealFilter, venues]
  );

  const activeQueue = useCallback(
    (venueId: string) =>
      entries
        .filter((entry) => entry.venueId === venueId && isActive(entry.status))
        .sort((a, b) => a.joinedAt - b.joinedAt),
    [entries]
  );

  const positionFor = useCallback(
    (entry: QueueEntry) => positionIn(entries, entry),
    [entries]
  );

  const waitForPartySize = useCallback(
    (venueId: string, _size: number) => ({ partiesAhead: activeQueue(venueId).length }),
    [activeQueue]
  );

  const joinLine = useCallback(
    (input: { venueId: string; partyName: string; partySize: number }) => {
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

      setMyEntryId(entry.id);
      patchEntries((current) => {
        const withoutMine = myEntryId ? current.filter((item) => item.id !== myEntryId) : current;
        return [...withoutMine, entry];
      });
    },
    [myEntryId, patchEntries]
  );

  const callNext = useCallback(
    (venueId: string) => {
      patchEntries((current) => {
        const queue = current
          .filter((entry) => entry.venueId === venueId && isActive(entry.status))
          .sort((a, b) => a.joinedAt - b.joinedAt);
        const waiting = queue.find((entry) => entry.status === 'waiting');
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
        current.map((entry) => (entry.id === entryId ? { ...entry, status: 'admitted' } : entry))
      );
    },
    [patchEntries]
  );

  const markNoShow = useCallback(
    (entryId: string) => {
      patchEntries((current) =>
        current.map((entry) => (entry.id === entryId ? { ...entry, status: 'no_show' } : entry))
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
      void buzz(
        'You are 3rd in queue',
        `${mine.partyName} · party of ${mine.partySize}. Hang nearby.`
      );
    }
    if (mine.notifiedNext && !buzzedRef.current.next.has(mine.id)) {
      buzzedRef.current.next.add(mine.id);
      void buzz(
        'You’re next — walk up',
        `${mine.partyName} · the door is calling a party of ${mine.partySize}.`
      );
    }
  }, [entries, myEntryId]);

  const myEntry = entries.find((entry) => entry.id === myEntryId) ?? null;

  const value = useMemo<NightContextValue>(
    () => ({
      venues,
      entries,
      myEntryId,
      dealFilter,
      setDealFilter,
      visibleVenues,
      myEntry,
      positionFor,
      waitForPartySize,
      joinLine,
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
      visibleVenues,
      myEntry,
      positionFor,
      waitForPartySize,
      joinLine,
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
