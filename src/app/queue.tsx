import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { NightButton } from '@/components/night-button';
import { NightInput } from '@/components/night-input';
import { PlaceNumber } from '@/components/place-number';
import { ScreenScroll } from '@/components/screen-scroll';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useNight } from '@/state/night-session';

export default function QueueScreen() {
  const { myEntry, positionFor, venues, joinCrew, leaveLine } = useNight();
  const venue = venues.find((item) => item.id === myEntry?.venueId);
  const position = myEntry ? positionFor(myEntry) : null;
  const [inviteInput, setInviteInput] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);
  const inActiveLine = myEntry != null && (myEntry.status === 'waiting' || myEntry.status === 'called');
  const called = myEntry?.status === 'called';
  const close = position === 3 && !called;

  const onJoinCrew = () => {
    const ok = joinCrew(inviteInput);
    if (!ok) {
      setJoinError('No party with that code.');
      return;
    }
    setJoinError(null);
    setInviteInput('');
  };

  return (
    <ScreenScroll>
      <ThemedText type="kicker" themeColor="accent">
        Queue
      </ThemedText>
      {!myEntry || !venue ? (
        <View style={styles.empty}>
          <PlaceNumber value="—" tone="default" />
          <ThemedText type="title">Not in line</ThemedText>
          <ThemedText themeColor="textSecondary">
            Open Tonight, name the crew, tap Get in line. Bar Atlas already has two parties ahead so
            you should land 3rd.
          </ThemedText>
          <ThemedText type="kicker" themeColor="textSecondary" style={styles.joinKicker}>
            Join a crew
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Same ticket as friends. Paste the invite code from their Queue screen.
          </ThemedText>
          <NightInput
            value={inviteInput}
            onChangeText={(value) => {
              setInviteInput(value);
              setJoinError(null);
            }}
            placeholder="ATLA-DEMO"
            autoCapitalize="characters"
            autoCorrect={false}
            autoComplete="off"
            onSubmitEditing={onJoinCrew}
          />
          {joinError ? (
            <ThemedText type="small" themeColor="danger">
              {joinError}
            </ThemedText>
          ) : null}
          <NightButton label="Join crew" onPress={onJoinCrew} />
        </View>
      ) : (
        <View style={styles.poster}>
          <ThemedText type="kicker" themeColor="textSecondary">
            {venue.name}
          </ThemedText>
          <PlaceNumber
            value={called ? 'NOW' : (position ?? '—')}
            tone={called ? 'now' : close ? 'close' : 'default'}
          />
          <ThemedText type="venue">
            {called
              ? 'Walk up. Don’t wait on the sidewalk.'
              : close
                ? 'You are 3rd. Stay nearby.'
                : `${myEntry.partyName} · party of ${myEntry.partySize}`}
          </ThemedText>
          <ThemedText type="code" themeColor="textSecondary">
            {myEntry.inviteCode} · one ticket
          </ThemedText>
          {myEntry.status === 'admitted' ? (
            <ThemedText type="smallBold">Admitted. Have a good night.</ThemedText>
          ) : null}
          {myEntry.status === 'no_show' ? (
            <ThemedText type="smallBold" themeColor="danger">
              Marked no-show. Rejoin from Tonight.
            </ThemedText>
          ) : null}
          {myEntry.status === 'left' ? (
            <ThemedText type="smallBold">You left the line.</ThemedText>
          ) : null}
          {inActiveLine ? <NightButton label="Leave line" variant="ghost" onPress={leaveLine} /> : null}
        </View>
      )}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  empty: { gap: Spacing.three },
  poster: { gap: Spacing.three },
  joinKicker: { marginTop: Spacing.two },
});
