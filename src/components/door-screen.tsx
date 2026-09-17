import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ChoiceChip, PressButton } from '@/components/press-button';
import { LabeledField } from '@/components/labeled-field';
import { NightScreen } from '@/components/night-screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { VectorIcon } from '@/components/vector-icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { SEED_DOOR_PINS } from '@/lib/seed-venues';
import { useNight } from '@/state/night-session';

export function DoorScreen() {
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
    <NightScreen>
      <ThemedText type="eyebrow" themeColor="textSecondary">
        Door
      </ThemedText>
      <ThemedText type="subtitle" accessibilityRole="header">
        {venue?.name ?? 'Door'}
      </ThemedText>
      <ThemedText themeColor="textSecondary">
        {unlocked
          ? 'Call the next party. If nobody taps here, the queue is theater.'
          : 'Enter this venue’s door PIN. Demo gate only — the PIN ships in the app bundle.'}
      </ThemedText>

      <View style={styles.chips}>
        {venues.map((item) => (
          <ChoiceChip
            key={item.id}
            label={item.name}
            selected={item.id === venueId}
            hint={`Show the door queue for ${item.name}`}
            onPress={() => {
              setVenueId(item.id);
              setPin('');
              setPinError(null);
            }}
          />
        ))}
      </View>

      {!unlocked ? (
        <ThemedView type="backgroundElement" style={styles.lockCard}>
          <View style={styles.row}>
            <VectorIcon
              name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }}
              color={theme.primary}
            />
            <ThemedText type="smallBold">Unlock {venue?.name ?? 'door'}</ThemedText>
          </View>
          <LabeledField
            label="Door PIN"
            hint="Staff PIN for this venue. Not a password."
            value={pin}
            onChangeText={(value) => {
              setPin(value);
              setPinError(null);
            }}
            placeholder="4-digit PIN"
            keyboardType="number-pad"
            maxLength={8}
            autoComplete="off"
            error={pinError}
            onSubmitEditing={onUnlock}
          />
          <PressButton
            label="Unlock door"
            icon={{ ios: 'key.fill', android: 'key', web: 'key' }}
            fill
            onPress={onUnlock}
          />
        </ThemedView>
      ) : (
        <>
          <PressButton
            label="Call next"
            icon={{ ios: 'door.left.hand.open', android: 'door_front', web: 'door_front' }}
            fill
            onPress={() => callNext(venueId)}
          />

          {queue.length === 0 ? (
            <ThemedText themeColor="textSecondary">No parties waiting.</ThemedText>
          ) : (
            queue.map((entry) => (
              <ThemedView key={entry.id} type="backgroundElement" style={styles.rowCard}>
                <ThemedText type="smallBold">
                  #{positionFor(entry)} · {entry.partyName} · {entry.partySize}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {entry.inviteCode} · {entry.status}
                </ThemedText>
                <View style={styles.actions}>
                  <PressButton
                    label="Admit"
                    variant="secondary"
                    icon={{ ios: 'checkmark', android: 'check', web: 'check' }}
                    onPress={() => markAdmitted(entry.id)}
                  />
                  <PressButton
                    label="No-show"
                    variant="danger"
                    onPress={() => markNoShow(entry.id)}
                  />
                </View>
              </ThemedView>
            ))
          )}
        </>
      )}
    </NightScreen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  lockCard: { padding: Spacing.three, borderRadius: Radius.lg, gap: Spacing.two },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  rowCard: { padding: Spacing.three, borderRadius: Radius.lg, gap: Spacing.two },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, marginTop: Spacing.one },
});
