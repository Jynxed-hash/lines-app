import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { LabeledField } from '@/components/labeled-field';
import { NightScreen } from '@/components/night-screen';
import { PressButton } from '@/components/press-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { VectorIcon } from '@/components/vector-icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useNight } from '@/state/night-session';

function ordinal(n: number) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export function QueueScreen() {
  const theme = useTheme();
  const { myEntry, positionFor, venues, joinCrew, leaveLine } = useNight();
  const venue = venues.find((item) => item.id === myEntry?.venueId);
  const position = myEntry ? positionFor(myEntry) : null;
  const [inviteInput, setInviteInput] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);
  const inActiveLine = myEntry != null && (myEntry.status === 'waiting' || myEntry.status === 'called');

  const onJoinCrew = () => {
    const ok = joinCrew(inviteInput);
    if (!ok) {
      setJoinError('No party with that code.');
      return;
    }
    setJoinError(null);
    setInviteInput('');
  };

  if (!myEntry || !venue) {
    return (
      <NightScreen>
        <ThemedText type="eyebrow" themeColor="textSecondary">
          Queue
        </ThemedText>
        <ThemedText type="subtitle" accessibilityRole="header">
          Not in a line
        </ThemedText>
        <ThemedText themeColor="textSecondary">
          You’re not in a line yet. Open Tonight, name the crew, tap Get in line. Bar Atlas
          already has two parties ahead so you should land 3rd.
        </ThemedText>
        <ThemedView type="backgroundElement" style={styles.card}>
          <View style={styles.row}>
            <VectorIcon
              name={{ ios: 'person.3.fill', android: 'groups', web: 'groups' }}
              color={theme.primary}
            />
            <ThemedText type="smallBold">Join a crew</ThemedText>
          </View>
          <LabeledField
            label="Invite code"
            hint="Same ticket as friends. Paste the code from their Queue screen."
            value={inviteInput}
            onChangeText={(value) => {
              setInviteInput(value);
              setJoinError(null);
            }}
            placeholder="ATLA-DEMO"
            autoCapitalize="characters"
            autoCorrect={false}
            autoComplete="off"
            error={joinError}
            onSubmitEditing={onJoinCrew}
          />
          <PressButton
            label="Join crew"
            icon={{ ios: 'person.3.fill', android: 'groups', web: 'groups' }}
            fill
            onPress={onJoinCrew}
          />
        </ThemedView>
      </NightScreen>
    );
  }

  const hero =
    position == null ? '—' : typeof position === 'number' ? ordinal(position) : String(position);

  return (
    <NightScreen>
      <ThemedText type="eyebrow" themeColor="textSecondary">
        {venue.name}
      </ThemedText>
      <ThemedText type="hero" style={{ color: theme.primary }} accessibilityRole="header">
        {hero}
      </ThemedText>
      <ThemedText>
        {myEntry.status === 'called'
          ? 'You’re next — walk up. Don’t wait on the sidewalk.'
          : position === 3
            ? 'You are 3rd in queue. Stay nearby.'
            : `${myEntry.partyName} · party of ${myEntry.partySize}`}
      </ThemedText>
      <ThemedView type="backgroundElement" style={styles.card}>
        <View style={styles.row}>
          <VectorIcon
            name={{ ios: 'tag.fill', android: 'confirmation_number', web: 'confirmation_number' }}
            color={theme.accent}
          />
          <ThemedText type="small" themeColor="textSecondary">
            Invite code {myEntry.inviteCode} · one ticket for the crew
          </ThemedText>
        </View>
        {myEntry.status === 'admitted' ? (
          <ThemedText type="smallBold">Admitted. Have a good night.</ThemedText>
        ) : null}
        {myEntry.status === 'no_show' ? (
          <ThemedText type="smallBold">Marked no-show. Rejoin from Tonight.</ThemedText>
        ) : null}
        {myEntry.status === 'left' ? (
          <ThemedText type="smallBold">You left the line.</ThemedText>
        ) : null}
      </ThemedView>
      {inActiveLine ? (
        <PressButton label="Leave line" variant="danger" fill onPress={leaveLine} />
      ) : null}
    </NightScreen>
  );
}

const styles = StyleSheet.create({
  card: { padding: Spacing.four, borderRadius: Radius.lg, gap: Spacing.three },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flexWrap: 'wrap' },
});
