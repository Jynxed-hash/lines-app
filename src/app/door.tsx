import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { SEED_DOOR_PINS } from '@/lib/seed-venues';
import { useNight } from '@/state/night-session';

export default function DoorScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {
    venues,
    activeQueue,
    callNext,
    markAdmitted,
    markNoShow,
    positionFor,
    unlockedVenueIds,
    rememberDoorUnlock,
  } = useNight();
  const [venueId, setVenueId] = useState(venues[0]?.id ?? 'atlas');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const queue = activeQueue(venueId);
  const unlocked = unlockedVenueIds.includes(venueId);
  const venue = venues.find((item) => item.id === venueId);

  const onUnlock = () => {
    const expected = SEED_DOOR_PINS[venueId];
    if (!expected || pin.trim() !== expected) {
      setPinError('Wrong PIN for this venue.');
      return;
    }
    rememberDoorUnlock(venueId);
    setPinError(null);
    setPin('');
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
        <ThemedText type="subtitle">Door</ThemedText>
        <ThemedText themeColor="textSecondary">
          {unlocked
            ? 'Call the next party. If nobody taps here, the queue is theater.'
            : 'Enter this venue’s door PIN. Demo gate only — the PIN ships in the app bundle.'}
        </ThemedText>

        <ThemedView style={styles.chips}>
          {venues.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                setVenueId(item.id);
                setPin('');
                setPinError(null);
              }}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    item.id === venueId ? theme.backgroundSelected : theme.backgroundElement,
                },
              ]}>
              <ThemedText type="smallBold">{item.name}</ThemedText>
            </Pressable>
          ))}
        </ThemedView>

        {!unlocked ? (
          <ThemedView type="backgroundElement" style={styles.lockCard}>
            <ThemedText type="smallBold">Unlock {venue?.name ?? 'door'}</ThemedText>
            <TextInput
              value={pin}
              onChangeText={(value) => {
                setPin(value);
                setPinError(null);
              }}
              placeholder="Door PIN"
              placeholderTextColor={theme.textSecondary}
              keyboardType="number-pad"
              maxLength={8}
              autoComplete="off"
              style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
              onSubmitEditing={onUnlock}
            />
            {pinError ? (
              <ThemedText type="small" themeColor="textSecondary">
                {pinError}
              </ThemedText>
            ) : null}
            <Pressable onPress={onUnlock} style={[styles.call, { backgroundColor: theme.text }]}>
              <ThemedText type="smallBold" style={{ color: theme.background }}>
                Unlock door
              </ThemedText>
            </Pressable>
          </ThemedView>
        ) : (
          <>
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
          </>
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
  lockCard: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.two },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  row: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.one },
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.one },
  action: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, borderRadius: Spacing.two },
});
