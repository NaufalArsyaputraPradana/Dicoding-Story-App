(function () {
  const connectionStatus = document.getElementById('connection-status');
  const connectionMessage = document.getElementById('connection-message');

  if (!connectionStatus || !connectionMessage) return;

  let hideTimeout = null;

  function showStatus(type, message, duration = 3000) {
    connectionStatus.classList.remove('hidden', 'online', 'offline');
    connectionStatus.classList.add(type);
    connectionMessage.textContent = message;

    // Accessibility: announce status change
    connectionStatus.setAttribute(
      'aria-live',
      type === 'online' ? 'polite' : 'assertive'
    );
    connectionStatus.setAttribute('role', 'status');

    if (type === 'online') {
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        connectionStatus.classList.add('hidden');
      }, duration);
    } else {
      clearTimeout(hideTimeout);
      connectionStatus.classList.remove('hidden');
    }
  }

  function updateConnectionStatus() {
    if (navigator.onLine) {
      showStatus('online', 'Koneksi telah pulih');
      window.showToast?.('Anda kembali online!', 'success', 3000);
    } else {
      showStatus('offline', 'Anda sedang offline', 0);
      window.showToast?.(
        'Anda sedang offline. Beberapa fitur mungkin tidak tersedia.',
        'warning',
        4000
      );
    }
  }

  // Initial check
  updateConnectionStatus();

  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);
})();
