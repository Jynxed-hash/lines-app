import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { NightButton } from '@/components/night-button';
import { NightInput } from '@/components/night-input';
import { PlaceNumber } from '@/components/place-number';
import { ScreenScroll } from '@/components/screen-scroll';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
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
      <View style={styles.masthead}>
        <ThemedText type="kicker" themeColor="accent">
          Tonight · NYC
        </ThemedText>
        <ThemedText type="title">Lines</ThemedText>
        <ThemedText themeColor="textSecondary">
          Join a virtual line as a party. The sidewalk stays a sidewalk.
        </ThemedText>
      </View>

      <ThemedView type="backgroundElement" style={[styles.partyBox, { borderColor: theme.hairline }]}>
        <ThemedText type="kicker" themeColor="textSecondary">
          Your party
        </ThemedText>
        <NightInput
          value={partyName}
          onChangeText={setPartyName}
          placeholder="Party name"
          autoCapitalize="words"
        />
        <View style={styles.sizeRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fewer people"
            onPress={() => setPartySize((size) => Math.max(1, size - 1))}
            style={[styles.step, { borderColor: theme.hairline }]}>
            <ThemedText type="smallBold">−</ThemedText>
          </Pressable>
          <ThemedText type="venue">{partySize}</ThemedText>
          <ThemedText themeColor="textSecondary">people</ThemedText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="More people"
            onPress={() => setPartySize((size) => Math.min(16, size + 1))}
            style={[styles.step, { borderColor: theme.hairline }]}>
            <ThemedText type="smallBold">+</ThemedText>
          </Pressable>
        </View>
      </ThemedView>

      <Pressable
        accessibilityRole="button"
        onPress={() => setDealFilter(!dealFilter)}
        style={[
          styles.filter,
          {
            borderColor: dealFilter ? theme.accent : theme.hairline,
            backgroundColor: dealFilter ? theme.backgroundSelected : 'transparent',
          },
        ]}>
        <ThemedText type="smallBold" themeColor={dealFilter ? 'accent' : 'text'}>
          {dealFilter ? 'Deals on' : 'Filter by deals'}
        </ThemedText>
      </Pressable>

      {visibleVenues.map((venue) => {
        const wait = waitForPartySize(venue.id, partySize);
        const place = wait.partiesAhead + 1;
        return (
          <VenueCard
            key={venue.id}
            venue={venue}
            place={place}
            peopleAhead={wait.peopleAhead}
            onJoin={() => joinLine({ venueId: venue.id, partyName, partySize })}
          />
        );
      })}
    </ScreenScroll>
  );
}

function waitCopy(peopleAhead: number) {
  return peopleAhead === 1 ? '1 person ahead' : `${peopleAhead} people ahead`;
}

function VenueCard({
  venue,
  place,
  peopleAhead,
  onJoin,
}: {
  venue: Venue;
  place: number;
  peopleAhead: number;
  onJoin: () => void;
}) {
  const theme = useTheme();
  const close = place === 3;

  return (
    <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.hairline }]}>
      <View style={styles.cardTop}>
        <View style={styles.cardCopy}>
          <ThemedText type="venue">{venue.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {venue.neighborhood} · {venue.occupancy}/{venue.capacity} inside
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {venue.vibe}
          </ThemedText>
        </View>
        <View style={styles.placeCol}>
          <PlaceNumber value={place} size="card" tone={close ? 'close' : 'default'} />
          <ThemedText type="kicker" themeColor={close ? 'accent' : 'textSecondary'}>
            {close ? 'You’d be 3rd' : 'if you join'}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        {waitCopy(peopleAhead)}
      </ThemedText>
      {venue.deals.map((deal) => (
        <ThemedText key={deal.id} type="small" themeColor="textSecondary">
          {deal.title} — {deal.detail}
        </ThemedText>
      ))}
      <NightButton label="Get in line" onPress={onJoin} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  masthead: { gap: Spacing.two },
  partyBox: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.two,
  },
  sizeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  step: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  filter: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.two,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three },
  cardCopy: { flex: 1, gap: Spacing.one, minWidth: 0 },
  placeCol: { alignItems: 'flex-end', minWidth: 72 },
});
