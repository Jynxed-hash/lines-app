import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useNight } from '@/state/night-store';

export default function DoorScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { venues, activeQueue, callNext, markAdmitted, markNoShow, positionFor } = useNight();
  const [venueId, setVenueId] = useState(venues[0]?.id ?? 'atlas');
  const queue = activeQueue(venueId);

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.three,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
        },
      ]}>
      <ThemedView style={styles.page}>
        <ThemedText type="subtitle">Door</ThemedText>
        <ThemedText themeColor="textSecondary">
          Call the next party. If nobody taps here, the queue is theater.
        </ThemedText>

        <ThemedView style={styles.chips}>
          {venues.map((venue) => (
            <Pressable
              key={venue.id}
              onPress={() => setVenueId(venue.id)}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    venue.id === venueId ? theme.backgroundSelected : theme.backgroundElement,
                },
              ]}>
              <ThemedText type="smallBold">{venue.name}</ThemedText>
            </Pressable>
          ))}
        </ThemedView>

        <Pressable
          onPress={() => callNext(venueId)}
          style={[styles.call, { backgroundColor: theme.text }]}>
          <ThemedText type="smallBold" style={{ color: theme.background }}>
            Call next
          </ThemedText>
        </Pressable>

        {queue.length === 0 ? (
          <ThemedText themeColor="textSecondary">No parties waiting.</ThemedText>
        ) : (
          queue.map((entry) => (
            <ThemedView key={entry.id} type="backgroundElement" style={styles.row}>
              <ThemedText type="smallBold">
                #{positionFor(entry)} · {entry.partyName} · {entry.partySize}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {entry.inviteCode} · {entry.status}
              </ThemedText>
              <ThemedView style={styles.actions}>
                <Pressable
                  onPress={() => markAdmitted(entry.id)}
                  style={[styles.action, { backgroundColor: theme.backgroundSelected }]}>
                  <ThemedText type="small">Admit</ThemedText>
                </Pressable>
                <Pressable
                  onPress={() => markNoShow(entry.id)}
                  style={[styles.action, { backgroundColor: theme.backgroundSelected }]}>
                  <ThemedText type="small">No-show</ThemedText>
                </Pressable>
              </ThemedView>
            </ThemedView>
          ))
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { alignItems: 'center', paddingHorizontal: Spacing.three },
  page: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.three },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, borderRadius: Spacing.five },
  call: { alignSelf: 'flex-start', paddingHorizontal: Spacing.four, paddingVertical: Spacing.two, borderRadius: Spacing.five },
  row: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.one },
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.one },
  action: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, borderRadius: Spacing.two },
});
