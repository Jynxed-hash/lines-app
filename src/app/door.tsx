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
    <ScreenScroll compact>
      <View style={styles.masthead}>
        <ThemedText type="kicker" themeColor="accent">
          Door
        </ThemedText>
        <ThemedText type="title">Clipboard</ThemedText>
        <ThemedText themeColor="textSecondary">
          {unlocked
            ? 'Call the next party. If nobody taps here, the queue is theater.'
            : 'Enter this venue’s door PIN. Demo gate only — the PIN ships in the app bundle.'}
        </ThemedText>
      </View>

      <View style={styles.chips}>
        {venues.map((item) => {
          const selected = item.id === venueId;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => {
                setVenueId(item.id);
                setPin('');
                setPinError(null);
              }}
              style={[
                styles.chip,
                {
                  borderColor: selected ? theme.accent : theme.hairline,
                  backgroundColor: selected ? theme.backgroundSelected : 'transparent',
                },
              ]}>
              <ThemedText type="smallBold" themeColor={selected ? 'accent' : 'text'}>
                {item.name}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {!unlocked ? (
        <ThemedView type="backgroundElement" style={[styles.lockCard, { borderColor: theme.hairline }]}>
          <ThemedText type="smallBold">Unlock {venue?.name ?? 'door'}</ThemedText>
          <NightInput
            value={pin}
            onChangeText={(value) => {
              setPin(value);
              setPinError(null);
            }}
            placeholder="Door PIN"
            keyboardType="number-pad"
            maxLength={8}
            autoComplete="off"
            onSubmitEditing={onUnlock}
          />
          {pinError ? (
            <ThemedText type="small" themeColor="danger">
              {pinError}
            </ThemedText>
          ) : null}
          <NightButton label="Unlock door" onPress={onUnlock} />
        </ThemedView>
      ) : (
        <>
          <NightButton
            label="Call next"
            onPress={() => callNext(venueId)}
            style={styles.callNext}
          />

          {queue.length === 0 ? (
            <ThemedText themeColor="textSecondary">No parties waiting.</ThemedText>
          ) : (
            queue.map((entry) => (
              <ThemedView
                key={entry.id}
                type="backgroundElement"
                style={[styles.row, { borderColor: theme.hairline }]}>
                <View style={styles.rowTop}>
                  <PlaceNumber
                    value={positionFor(entry) ?? '—'}
                    size="row"
                    tone={entry.status === 'called' ? 'now' : 'default'}
                  />
                  <View style={styles.rowCopy}>
                    <ThemedText type="smallBold">
                      {entry.partyName} · {entry.partySize}
                    </ThemedText>
                    <ThemedText type="code" themeColor="textSecondary">
                      {entry.inviteCode} · {entry.status}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.actions}>
                  <NightButton label="Admit" variant="ghost" onPress={() => markAdmitted(entry.id)} />
                  <NightButton label="No-show" variant="danger" onPress={() => markNoShow(entry.id)} />
                </View>
              </ThemedView>
            ))
          )}
        </>
      )}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  masthead: { gap: Spacing.two },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  lockCard: { padding: Spacing.three, borderRadius: Radius.md, borderWidth: 1, gap: Spacing.two },
  callNext: { alignSelf: 'stretch', alignItems: 'center' },
  row: { padding: Spacing.three, borderRadius: Radius.md, borderWidth: 1, gap: Spacing.two },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  rowCopy: { flex: 1, gap: 2 },
  actions: { flexDirection: 'row', gap: Spacing.two },
});
