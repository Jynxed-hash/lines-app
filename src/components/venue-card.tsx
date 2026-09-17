import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { VectorIcon } from '@/components/vector-icon';
import { IconSize, Motion, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Venue } from '@/lib/seed-venues';

function waitCopy(partiesAhead: number, peopleAhead: number) {
  const parties = partiesAhead === 1 ? '1 party ahead' : `${partiesAhead} parties ahead`;
  const people = peopleAhead === 1 ? '1 person' : `${peopleAhead} people`;
  return `${parties} · ${people}`;
}

export function VenueCard({
  venue,
  selected,
  partiesAhead,
  peopleAhead,
  onSelect,
}: {
  venue: Venue;
  selected: boolean;
  partiesAhead: number;
  peopleAhead: number;
  onSelect: () => void;
}) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value * 0.12,
    transform: [{ scale: reduceMotion ? 1 : 1 - progress.value * (1 - Motion.pressScale) }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${venue.name}, ${venue.neighborhood}. ${waitCopy(partiesAhead, peopleAhead)}`}
      accessibilityHint="Selects this venue for Get in line"
      accessibilityState={{ selected }}
      onPress={onSelect}
      onPressIn={() => {
        progress.value = withTiming(1, { duration: Motion.pressIn, easing: Easing.out(Easing.cubic) });
      }}
      onPressOut={() => {
        progress.value = withTiming(0, { duration: Motion.pressOut, easing: Easing.out(Easing.cubic) });
      }}
      style={styles.cardHit}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: selected ? theme.primary : theme.border,
          },
          animatedStyle,
        ]}>
        <View style={styles.cardTitle}>
          <VectorIcon
            name={{ ios: 'wineglass.fill', android: 'local_bar', web: 'local_bar' }}
            color={selected ? theme.primary : theme.textSecondary}
            size={IconSize.md}
          />
          <ThemedText type="smallBold">
            {venue.name} · {venue.neighborhood}
          </ThemedText>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {venue.occupancy}/{venue.capacity} inside · {waitCopy(partiesAhead, peopleAhead)}
        </ThemedText>
        <ThemedText type="small">{venue.vibe}</ThemedText>
        {venue.deals.map((deal) => (
          <ThemedView key={deal.id} type="backgroundSelected" style={styles.deal}>
            <ThemedText type="smallBold">{deal.title}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {deal.detail}
            </ThemedText>
          </ThemedView>
        ))}
        <ThemedText type="small" themeColor={selected ? 'primary' : 'textSecondary'}>
          {selected ? 'Selected for tonight' : 'Tap to select'}
        </ThemedText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardHit: { cursor: 'pointer' },
  card: { padding: Spacing.three, borderRadius: Radius.lg, gap: Spacing.two, borderWidth: 2 },
  cardTitle: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flexWrap: 'wrap' },
  deal: { padding: Spacing.two, borderRadius: Radius.sm, gap: Spacing.half },
});
