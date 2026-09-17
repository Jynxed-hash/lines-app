import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ChoiceChip, IconStepButton, PressButton } from '@/components/press-button';
import { LabeledField } from '@/components/labeled-field';
import { NightScreen } from '@/components/night-screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { VectorIcon } from '@/components/vector-icon';
import { VenueCard } from '@/components/venue-card';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useNight } from '@/state/night-session';

export function TonightScreen() {
  const theme = useTheme();
  const { visibleVenues, dealFilter, setDealFilter, waitForPartySize, joinLine } = useNight();
  const [partyName, setPartyName] = useState('Crew');
  const [partySize, setPartySize] = useState(4);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedVenue = useMemo(
    () => visibleVenues.find((venue) => venue.id === selectedId) ?? visibleVenues[0] ?? null,
    [selectedId, visibleVenues]
  );

  return (
    <NightScreen>
      <ThemedText type="eyebrow" themeColor="textSecondary">
        Tonight
      </ThemedText>
      <ThemedText type="subtitle" accessibilityRole="header">
        Lines
      </ThemedText>
      <ThemedText themeColor="textSecondary">
        Join a virtual line as a party. Skip the 50-minute sidewalk.
      </ThemedText>

      <ThemedView type="backgroundElement" style={styles.partyBox}>
        <View style={styles.partyHeader}>
          <VectorIcon
            name={{ ios: 'person.3.fill', android: 'groups', web: 'groups' }}
            color={theme.primary}
          />
          <ThemedText type="smallBold">Your party</ThemedText>
        </View>
        <LabeledField
          label="Party name"
          value={partyName}
          onChangeText={setPartyName}
          placeholder="Crew"
          autoCapitalize="words"
        />
        <ThemedText type="smallBold">Party size</ThemedText>
        <View style={styles.sizeRow}>
          <IconStepButton
            label="Decrease party size"
            onPress={() => setPartySize((size) => Math.max(1, size - 1))}>
            <VectorIcon name={{ ios: 'minus', android: 'remove', web: 'remove' }} color={theme.text} />
          </IconStepButton>
          <ThemedText accessibilityLiveRegion="polite">{partySize} people</ThemedText>
          <IconStepButton
            label="Increase party size"
            onPress={() => setPartySize((size) => Math.min(16, size + 1))}>
            <VectorIcon name={{ ios: 'plus', android: 'add', web: 'add' }} color={theme.text} />
          </IconStepButton>
        </View>
      </ThemedView>

      <ChoiceChip
        label={dealFilter ? 'Showing bars with deals' : 'Filter by deals'}
        selected={dealFilter}
        onPress={() => setDealFilter(!dealFilter)}
        hint="Toggle venues that currently have a deal"
        icon={{ ios: 'tag.fill', android: 'local_offer', web: 'local_offer' }}
      />

      {visibleVenues.map((venue) => {
        const wait = waitForPartySize(venue.id, partySize);
        const selected = selectedVenue?.id === venue.id;
        return (
          <VenueCard
            key={venue.id}
            venue={venue}
            selected={selected}
            partiesAhead={wait.partiesAhead}
            peopleAhead={wait.peopleAhead}
            onSelect={() => setSelectedId(venue.id)}
          />
        );
      })}

      <PressButton
        label={selectedVenue ? `Get in line at ${selectedVenue.name}` : 'Get in line'}
        icon={{ ios: 'list.number', android: 'format_list_numbered', web: 'format_list_numbered' }}
        disabled={!selectedVenue}
        fill
        onPress={() => {
          if (!selectedVenue) return;
          joinLine({ venueId: selectedVenue.id, partyName, partySize });
        }}
      />
    </NightScreen>
  );
}

const styles = StyleSheet.create({
  partyBox: { padding: Spacing.three, borderRadius: Radius.lg, gap: Spacing.two },
  partyHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  sizeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
});
