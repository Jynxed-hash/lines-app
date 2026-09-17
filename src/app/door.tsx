import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { GlassButton, GlassFamily, GlassSurface } from '@/components/glass';
import { ScreenScroll } from '@/components/screen-scroll';
import { ThemedText } from '@/components/themed-text';
import { HitTarget, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { SEED_DOOR_PINS } from '@/lib/seed-venues';
import { useNight } from '@/state/night-session';

export default function DoorScreen() {
  const theme = useTheme();
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
    <ScreenScroll keyboardShouldPersistTaps="handled">
      <ThemedText type="subtitle">Door</ThemedText>
      <ThemedText themeColor="textSecondary">
        {unlocked
          ? 'Call the next party. If nobody taps here, the queue is theater.'
          : 'Enter this venue’s door PIN. Demo gate only — the PIN ships in the app bundle.'}
      </ThemedText>

      <View style={styles.chips}>
        {venues.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityState={{ selected: item.id === venueId }}
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
      </View>

      {!unlocked ? (
        <GlassFamily>
          <GlassSurface style={styles.lockCard}>
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
            <GlassButton nested label="Unlock door" onPress={onUnlock} />
          </GlassSurface>
        </GlassFamily>
      ) : (
        <>
          <GlassFamily>
            <GlassButton label="Call next" onPress={() => callNext(venueId)} />
          </GlassFamily>

          {queue.length === 0 ? (
            <ThemedText themeColor="textSecondary">No parties waiting.</ThemedText>
          ) : (
            queue.map((entry) => (
              <View
                key={entry.id}
                style={[styles.row, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="smallBold">
                  #{positionFor(entry)} · {entry.partyName} · {entry.partySize}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {entry.inviteCode} · {entry.status}
                </ThemedText>
                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => markAdmitted(entry.id)}
                    style={[styles.action, { backgroundColor: theme.backgroundSelected }]}>
                    <ThemedText type="small">Admit</ThemedText>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => markNoShow(entry.id)}
                    style={[styles.action, { backgroundColor: theme.backgroundSelected }]}>
                    <ThemedText type="small">No-show</ThemedText>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </>
      )}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: {
    minHeight: HitTarget,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
    borderRadius: Spacing.five,
  },
  lockCard: { padding: Spacing.three, gap: Spacing.two },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    minHeight: HitTarget,
    fontSize: 16,
  },
  row: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.one },
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.one },
  action: {
    minHeight: HitTarget,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
    borderRadius: Spacing.two,
  },
});
