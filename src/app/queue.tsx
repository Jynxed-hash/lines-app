import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { SEED_VENUES } from '@/lib/seed-venues';
import { useNight } from '@/state/night-store';

export default function QueueScreen() {
  const { myEntry, positionFor } = useNight();
  const venue = SEED_VENUES.find((item) => item.id === myEntry?.venueId);
  const position = myEntry ? positionFor(myEntry) : null;

  return (
    <ThemedView style={styles.wrap}>
      <SafeAreaView style={styles.safe}>
        <ThemedText type="subtitle">Queue</ThemedText>
        {!myEntry || !venue ? (
          <ThemedText themeColor="textSecondary">
            You’re not in a line yet. Open Tonight, name the crew, tap Get in line. Bar Atlas
            already has two parties ahead so you should land 3rd.
          </ThemedText>
        ) : (
          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="small" themeColor="textSecondary">
              {venue.name}
            </ThemedText>
            <ThemedText type="title" style={styles.position}>
              {position ?? '—'}
            </ThemedText>
            <ThemedText>
              {myEntry.status === 'called'
                ? 'You’re next — walk up. Don’t wait on the sidewalk.'
                : position === 3
                  ? 'You are 3rd in queue. Stay nearby.'
                  : `${myEntry.partyName} · party of ${myEntry.partySize}`}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Invite code {myEntry.inviteCode} · one ticket for the crew
            </ThemedText>
            {myEntry.status === 'admitted' ? (
              <ThemedText type="smallBold">Admitted. Have a good night.</ThemedText>
            ) : null}
            {myEntry.status === 'no_show' ? (
              <ThemedText type="smallBold">Marked no-show. Rejoin from Tonight.</ThemedText>
            ) : null}
          </ThemedView>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center' },
  safe: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.three,
  },
  card: { padding: Spacing.four, borderRadius: Spacing.three, gap: Spacing.two },
  position: { fontSize: 72, lineHeight: 80 },
});
