import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { GlassButton, GlassFamily, GlassSurface } from '@/components/glass';
import { ScreenScroll } from '@/components/screen-scroll';
import { ThemedText } from '@/components/themed-text';
import { HitTarget, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Venue } from '@/lib/seed-venues';
import { useNight } from '@/state/night-session';

export default function TonightScreen() {
  const theme = useTheme();
  const { visibleVenues, dealFilter, setDealFilter, waitForPartySize, joinLine } = useNight();
  const [partyName, setPartyName] = useState('Crew');
  const [partySize, setPartySize] = useState(4);

  return (
    <ScreenScroll>
      <ThemedText type="subtitle">Lines</ThemedText>
      <ThemedText themeColor="textSecondary">
        Join a virtual line as a party. Skip the 50-minute sidewalk.
      </ThemedText>

      <View style={[styles.partyBox, { backgroundColor: theme.backgroundElement }]}>
        <ThemedText type="smallBold">Your party</ThemedText>
        <TextInput
          value={partyName}
          onChangeText={setPartyName}
          placeholder="Party name"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="words"
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
        />
        <View style={styles.sizeRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Decrease party size"
            onPress={() => setPartySize((size) => Math.max(1, size - 1))}
            style={[styles.step, { backgroundColor: theme.backgroundSelected }]}>
            <ThemedText type="smallBold">−</ThemedText>
          </Pressable>
          <ThemedText>{partySize} people</ThemedText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Increase party size"
            onPress={() => setPartySize((size) => Math.min(16, size + 1))}
            style={[styles.step, { backgroundColor: theme.backgroundSelected }]}>
            <ThemedText type="smallBold">+</ThemedText>
          </Pressable>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => setDealFilter(!dealFilter)}
        style={[
          styles.filter,
          { backgroundColor: dealFilter ? theme.backgroundSelected : theme.backgroundElement },
        ]}>
        <ThemedText type="smallBold">{dealFilter ? 'Showing bars with deals' : 'Filter by deals'}</ThemedText>
      </Pressable>

      <GlassFamily style={styles.family}>
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
      </GlassFamily>
    </ScreenScroll>
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
    <GlassSurface style={styles.card}>
      <ThemedText type="smallBold">
        {venue.name} · {venue.neighborhood}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {venue.occupancy}/{venue.capacity} inside · {waitCopy(partiesAhead, peopleAhead)}
      </ThemedText>
      <ThemedText type="small">{venue.vibe}</ThemedText>
      {venue.deals.map((deal) => (
        <View key={deal.id} style={[styles.deal, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText type="smallBold">{deal.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {deal.detail}
          </ThemedText>
        </View>
      ))}
      <GlassButton nested label="Get in line" onPress={onJoin} />
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  family: { gap: Spacing.three, width: '100%' },
  partyBox: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.two },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    minHeight: HitTarget,
    fontSize: 16,
  },
  sizeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  step: {
    minWidth: HitTarget,
    minHeight: HitTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.two,
  },
  filter: {
    alignSelf: 'flex-start',
    minHeight: HitTarget,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
    borderRadius: Spacing.five,
  },
  card: { padding: Spacing.three, gap: Spacing.two },
  deal: { padding: Spacing.two, borderRadius: Spacing.two, gap: Spacing.half },
});
