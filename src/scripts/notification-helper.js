import CONFIG from './config';

export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function subscribeUserToPush(registration) {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Push notification permission denied');
      return;
    }
    const token = localStorage.getItem('token'); // Ambil token user
    if (!token) {
      console.warn(
        'User not logged in, cannot subscribe to push notifications'
      );
      return;
    }
    const applicationServerKey = urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
    const { endpoint, keys } = subscription.toJSON();
    const cleanSubscription = { endpoint, keys };

    await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cleanSubscription),
    });
    console.log('User subscribed to push notifications');
  } catch (error) {
    console.error('Failed to subscribe user:', error);
  }
}
