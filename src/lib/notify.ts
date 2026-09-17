import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export const QUEUE_CHANNEL_ID = 'queue';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/** Android 13+ will not show a permission prompt until a channel exists. */
export async function prepareNotifications() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(QUEUE_CHANNEL_ID, {
    name: 'Queue',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    sound: 'default',
  });
}

export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  await prepareNotifications();

  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) {
    return true;
  }

  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

export async function buzz(title: string, body: string) {
  const allowed = await ensureNotificationPermission();
  if (!allowed) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: 'default' },
    trigger: Platform.OS === 'android' ? { channelId: QUEUE_CHANNEL_ID } : null,
  });
}
