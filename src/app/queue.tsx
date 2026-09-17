import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useNight } from '@/state/night-session';

export default function QueueScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
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

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.three,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
        },
      ]}
      keyboardShouldPersistTaps="handled">
      <ThemedView style={styles.page}>
        <ThemedText type="subtitle">Queue</ThemedText>
        {!myEntry || !venue ? (
          <ThemedView style={styles.empty}>
            <ThemedText themeColor="textSecondary">
              You’re not in a line yet. Open Tonight, name the crew, tap Get in line. Bar Atlas
              already has two parties ahead so you should land 3rd.
            </ThemedText>
            <ThemedText type="smallBold">Join a crew</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Same ticket as friends. Paste the invite code from their Queue screen.
            </ThemedText>
            <TextInput
              value={inviteInput}
              onChangeText={(value) => {
                setInviteInput(value);
                setJoinError(null);
              }}
              placeholder="ATLA-DEMO"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="characters"
              autoCorrect={false}
              autoComplete="off"
              style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
              onSubmitEditing={onJoinCrew}
            />
            {joinError ? (
              <ThemedText type="small" themeColor="textSecondary">
                {joinError}
              </ThemedText>
            ) : null}
            <Pressable
              onPress={onJoinCrew}
              style={[styles.button, { backgroundColor: theme.text }]}>
              <ThemedText type="smallBold" style={{ color: theme.background }}>
                Join crew
              </ThemedText>
            </Pressable>
          </ThemedView>
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
            {myEntry.status === 'left' ? (
              <ThemedText type="smallBold">You left the line.</ThemedText>
            ) : null}
            {inActiveLine ? (
              <Pressable
                onPress={leaveLine}
                style={[styles.leave, { backgroundColor: theme.backgroundSelected }]}>
                <ThemedText type="smallBold">Leave line</ThemedText>
              </Pressable>
            ) : null}
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { alignItems: 'center', paddingHorizontal: Spacing.three },
  page: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.three },
  empty: { gap: Spacing.two },
  card: { padding: Spacing.four, borderRadius: Spacing.three, gap: Spacing.two },
  position: { fontSize: 72, lineHeight: 80 },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  button: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
  leave: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    marginTop: Spacing.one,
  },
});
