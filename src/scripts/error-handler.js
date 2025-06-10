(function () {
  // Global error handler
  window.onerror = function (message, source, lineno, colno, error) {
    console.error('Global error caught:', {
      message,
      source,
      lineno,
      colno,
      error,
    });

    // Handle common undefined errors gracefully
    if (message && message.includes('Cannot read properties of undefined')) {
      if (!window.hasShownErrorMessage) {
        window.hasShownErrorMessage = true;
        setTimeout(() => {
          window.hasShownErrorMessage = false;
        }, 5000);

        if (!window.location.hash.includes('error')) {
          window.showToast?.(
            'Terjadi kesalahan saat menampilkan konten. Kami akan mencoba memperbaikinya secara otomatis.',
            'warning'
          );
        }
      }
      return true;
    }

    // Show generic error toast for other errors (improvisasi)
    if (message && !window.location.hash.includes('error')) {
      window.showToast?.(
        'Terjadi kesalahan tak terduga. Silakan coba lagi atau muat ulang halaman.',
        'error'
      );
    }
    return false;
  };

  // Toast notification utility
  window.showToast = function (message, type = 'info', duration = 5000) {
    const toastContainer =
      document.getElementById('toast-container') ||
      (() => {
        // Auto-create toast container if not present (improvisasi)
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
        return container;
      })();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('tabindex', '0');

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

    // Add close button for accessibility (improvisasi)
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close-btn';
    closeBtn.setAttribute('aria-label', 'Tutup notifikasi');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.onclick = () => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toastContainer.contains(toast)) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    };

    toast.appendChild(icon);
    toast.appendChild(textSpan);
    toast.appendChild(closeBtn);
    toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      setTimeout(() => {
        toast.classList.add('show');
        toast.focus();
      }, 10);
    });

    // Auto-dismiss after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toastContainer.contains(toast)) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    }, duration);
  };
})();
