import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Venue } from '@/lib/seed-venues';
import { useNight } from '@/state/night-session';

export default function TonightScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { visibleVenues, dealFilter, setDealFilter, waitForPartySize, joinLine } = useNight();
  const [partyName, setPartyName] = useState('Crew');
  const [partySize, setPartySize] = useState(4);

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
        <ThemedText type="subtitle">Lines</ThemedText>
        <ThemedText themeColor="textSecondary">
          Join a virtual line as a party. Skip the 50-minute sidewalk.
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.partyBox}>
          <ThemedText type="smallBold">Your party</ThemedText>
          <TextInput
            value={partyName}
            onChangeText={setPartyName}
            placeholder="Party name"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="words"
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          />
          <ThemedView style={styles.sizeRow}>
            <Pressable
              onPress={() => setPartySize((size) => Math.max(1, size - 1))}
              style={[styles.step, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText type="smallBold">−</ThemedText>
            </Pressable>
            <ThemedText>{partySize} people</ThemedText>
            <Pressable
              onPress={() => setPartySize((size) => Math.min(16, size + 1))}
              style={[styles.step, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText type="smallBold">+</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>

        <Pressable
          onPress={() => setDealFilter(!dealFilter)}
          style={[styles.filter, { backgroundColor: dealFilter ? theme.backgroundSelected : theme.backgroundElement }]}>
          <ThemedText type="smallBold">{dealFilter ? 'Showing bars with deals' : 'Filter by deals'}</ThemedText>
        </Pressable>

        {visibleVenues.map((venue) => {
          const wait = waitForPartySize(venue.id, partySize);
          return (
            <VenueCard
              key={venue.id}
              venue={venue}
              partiesAhead={wait.partiesAhead}
              peopleAhead={wait.peopleAhead}
              onJoin={() => joinLine({ venueId: venue.id, partyName, partySize })}
            />
          );
        })}
      </ThemedView>
    </ScrollView>
  );
}

function waitCopy(partiesAhead: number, peopleAhead: number) {
  const parties = partiesAhead === 1 ? '1 party ahead' : `${partiesAhead} parties ahead`;
  const people = peopleAhead === 1 ? '1 person' : `${peopleAhead} people`;
  return `${parties} · ${people}`;
}

function VenueCard({
  venue,
  partiesAhead,
  peopleAhead,
  onJoin,
}: {
  venue: Venue;
  partiesAhead: number;
  peopleAhead: number;
  onJoin: () => void;
}) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold">
        {venue.name} · {venue.neighborhood}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {venue.occupancy}/{venue.capacity} inside · {waitCopy(partiesAhead, peopleAhead)}
      </ThemedText>
      <ThemedText type="small">{venue.vibe}</ThemedText>
      {venue.deals.map((deal) => (
        <ThemedView key={deal.id} type="backgroundSelected" style={styles.deal}>
          <ThemedText type="smallBold">{deal.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {deal.detail}
          </ThemedText>
        </ThemedView>
      ))}
      <Pressable onPress={onJoin} style={[styles.join, { backgroundColor: theme.text }]}>
        <ThemedText type="smallBold" style={{ color: theme.background }}>
          Get in line
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { alignItems: 'center', paddingHorizontal: Spacing.three },
  page: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.three },
  partyBox: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.two },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  sizeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  step: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, borderRadius: Spacing.two },
  filter: { alignSelf: 'flex-start', paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, borderRadius: Spacing.five },
  card: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.two },
  deal: { padding: Spacing.two, borderRadius: Spacing.two, gap: Spacing.half },
  join: { alignSelf: 'flex-start', paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, borderRadius: Spacing.five },
});
