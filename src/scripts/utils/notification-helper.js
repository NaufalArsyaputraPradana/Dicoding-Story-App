import CONFIG from '../config';

/**
 * Cek ketersediaan Notification API di browser
 */
export function isNotificationAvailable() {
  return (
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
}

/**
 * Cek apakah notifikasi sudah di-grant
 */
export function isNotificationGranted() {
  return Notification.permission === 'granted';
}

/**
 * Minta izin notifikasi ke user, dengan feedback toast
 */
export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    window.showToast?.('Browser tidak mendukung Notification API.', 'error');
    return false;
  }
  if (isNotificationGranted()) return true;
  const status = await Notification.requestPermission();
  if (status === 'denied') {
    window.showToast?.('Izin notifikasi ditolak.', 'warning');
    return false;
  }
  if (status === 'default') {
    window.showToast?.('Izin notifikasi ditutup atau diabaikan.', 'info');
    return false;
  }
  return true;
}

/**
 * Ambil Push Subscription aktif (jika ada)
 */
export async function getPushSubscription() {
  if (!isNotificationAvailable()) return null;
  const registration = await navigator.serviceWorker.ready;
  return await registration.pushManager.getSubscription();
}

/**
 * Cek apakah sudah ada push subscription aktif
 */
export async function isCurrentPushSubscriptionAvailable() {
  const sub = await getPushSubscription();
  return !!sub;
}

/**
 * Helper konversi VAPID key ke Uint8Array
 */
export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

/**
 * Opsi subscribe push notification
 */
export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
  };
}

/**
 * Subscribe user ke push notification (dengan feedback & error handling)
 */
export async function subscribeUserToPush() {
  try {
    if (!isNotificationAvailable()) {
      window.showToast?.('Browser tidak mendukung push notification.', 'error');
      return;
    }
    const registration = await navigator.serviceWorker.ready;
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      window.showToast?.('Izin push notification tidak diberikan.', 'warning');
      return;
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.showToast?.(
        'Anda harus login untuk mengaktifkan notifikasi.',
        'warning'
      );
      return;
    }
    const subscription = await registration.pushManager.subscribe(
      generateSubscribeOptions()
    );
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

    window.showToast?.('Notifikasi berhasil diaktifkan!', 'success');
    return subscription;
  } catch (error) {
    window.showToast?.(
      'Gagal mengaktifkan notifikasi: ' + error.message,
      'error'
    );
    console.error('Failed to subscribe user:', error);
    return null;
  }
}

/**
 * Unsubscribe user dari push notification (dengan feedback & error handling)
 */
export async function unsubscribeUserFromPush() {
  try {
    if (!isNotificationAvailable()) return false;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      window.showToast?.('Notifikasi berhasil dinonaktifkan.', 'info');
      return true;
    }
    window.showToast?.('Tidak ada notifikasi aktif.', 'info');
    return false;
  } catch (error) {
    window.showToast?.(
      'Gagal menonaktifkan notifikasi: ' + error.message,
      'error'
    );
    return false;
  }
}
