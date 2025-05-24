(function () {
  window.onerror = function (message, source, lineno, colno, error) {
    console.error('Global error caught:', {
      message,
      source,
      lineno,
      colno,
      error,
    });

    if (message.includes('Cannot read properties of undefined')) {
      console.error('Property access error detected. Details:', {
        message,
        source,
        lineno,
        colno,
      });

      if (!window.hasShownErrorMessage) {
        window.hasShownErrorMessage = true;
        setTimeout(() => {
          window.hasShownErrorMessage = false;
        }, 5000);

        if (!window.location.hash.includes('error')) {
          window.showToast(
            'Terjadi kesalahan saat menampilkan konten. Kami akan mencoba memperbaikinya secara otomatis.',
            'warning'
          );
        }
      }
      return true;
    }
    return false;
  };

  window.showToast = function (message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    const icon = document.createElement('i');
    icon.className = `fas ${
      type === 'success'
        ? 'fa-check-circle'
        : type === 'error'
          ? 'fa-exclamation-circle'
          : type === 'warning'
            ? 'fa-exclamation-triangle'
            : 'fa-info-circle'
    }`;
    icon.setAttribute('aria-hidden', 'true');

    const textSpan = document.createElement('span');
    textSpan.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(textSpan);
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      setTimeout(() => {
        toast.classList.add('show');
      }, 10);
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toastContainer.contains(toast)) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    }, 5000);
  };
})();
