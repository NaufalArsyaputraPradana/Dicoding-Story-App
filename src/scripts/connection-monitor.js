(function () {
  const connectionStatus = document.getElementById('connection-status');
  const connectionMessage = document.getElementById('connection-message');

  if (!connectionStatus || !connectionMessage) return;

  function updateConnectionStatus() {
    if (navigator.onLine) {
      connectionStatus.classList.add('online');
      connectionStatus.classList.remove('offline');
      connectionMessage.textContent = 'Koneksi telah pulih';
      setTimeout(() => {
        connectionStatus.classList.add('hidden');
      }, 3000);
    } else {
      connectionStatus.classList.remove('online');
      connectionStatus.classList.add('offline');
      connectionStatus.classList.remove('hidden');
      connectionMessage.textContent = 'Anda sedang offline';
    }
  }

  updateConnectionStatus();

  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);
})();
