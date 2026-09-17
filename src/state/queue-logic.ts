export type QueueStatus = 'waiting' | 'called' | 'admitted' | 'no_show' | 'left';

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

export function isActiveStatus(status: QueueStatus) {
  return status === 'waiting' || status === 'called';
}

export function normalizeInviteCode(code: string) {
  return code.trim().toUpperCase();
}

export function positionIn(entries: QueueEntry[], entry: QueueEntry) {
  if (!isActiveStatus(entry.status)) {
    return null;
  }
  const queue = entries
    .filter((item) => item.venueId === entry.venueId && isActiveStatus(item.status))
    .sort((a, b) => a.joinedAt - b.joinedAt);
  const index = queue.findIndex((item) => item.id === entry.id);
  return index === -1 ? null : index + 1;
}

export function waitCountsForVenue(entries: QueueEntry[], venueId: string) {
  const queue = entries.filter((entry) => entry.venueId === venueId && isActiveStatus(entry.status));
  return {
    partiesAhead: queue.length,
    peopleAhead: queue.reduce((sum, entry) => sum + entry.partySize, 0),
  };
}

export function sortDoorQueue(entries: QueueEntry[]) {
  return [...entries].sort((a, b) => {
    if (a.status === 'called' && b.status !== 'called') {
      return -1;
    }
    if (b.status === 'called' && a.status !== 'called') {
      return 1;
    }
    return a.joinedAt - b.joinedAt;
  });
}

export function applyPositionFlags(entries: QueueEntry[], previous: QueueEntry[]): QueueEntry[] {
  let changed = false;
  const next = entries.map((entry) => {
    const position = positionIn(entries, entry);
    const prev = previous.find((item) => item.id === entry.id);
    const prevPosition = prev ? positionIn(previous, prev) : null;
    const skippedThird =
      position !== null && position <= 3 && prevPosition !== null && prevPosition > 3;
    const notifiedThird = entry.notifiedThird || position === 3 || skippedThird;
    const notifiedNext = entry.notifiedNext || entry.status === 'called';
    if (notifiedThird === entry.notifiedThird && notifiedNext === entry.notifiedNext) {
      return entry;
    }
    changed = true;
    return { ...entry, notifiedThird, notifiedNext };
  });
  return changed ? next : entries;
}

export function markLeft(entries: QueueEntry[], entryId: string | null): QueueEntry[] {
  if (!entryId) {
    return entries;
  }
  return entries.map((entry) =>
    entry.id === entryId && isActiveStatus(entry.status) ? { ...entry, status: 'left' as const } : entry
  );
}

export function findCrewByCode(entries: QueueEntry[], code: string) {
  const needle = normalizeInviteCode(code);
  if (!needle) {
    return undefined;
  }
  return entries.find(
    (entry) => normalizeInviteCode(entry.inviteCode) === needle && isActiveStatus(entry.status)
  );
}

export function selectWaitingHead(entries: QueueEntry[], venueId: string) {
  return entries
    .filter((entry) => entry.venueId === venueId && isActiveStatus(entry.status))
    .sort((a, b) => a.joinedAt - b.joinedAt)
    .find((entry) => entry.status === 'waiting');
}

export const DEMO_AHEAD: QueueEntry[] = [
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
