if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/Dicoding-Story-App/sw.js', {
      scope: '/Dicoding-Story-App/',
    });
  });
}
