if (!self.define) {
  let e,
    i = {};
  const n = (n, s) => (
    (n = new URL(n + '.js', s).href),
    i[n] ||
      new Promise((i) => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = n), (e.onload = i), document.head.appendChild(e);
        } else (e = n), importScripts(n), i();
      }).then(() => {
        let e = i[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (s, a) => {
    const r =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href;
    if (i[r]) return;
    let o = {};
    const l = (e) => n(e, r),
      t = { module: { uri: r }, exports: o, require: l };
    i[r] = Promise.all(s.map((e) => t[e] || l(e))).then((e) => (a(...e), o));
  };
}
define(['./workbox-675956ea'], function (e) {
  'use strict';
  self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: 'assets/index-C2ibc2Zd.js', revision: null },
        { url: 'assets/main-BsmEGtnH.css', revision: null },
        { url: 'assets/main-OTiXoW2h.js', revision: null },
        { url: 'index.html', revision: 'b66176bea2af7c85919d8d6485d0bcf1' },
        { url: 'offline.html', revision: '482dfda22f8d7e7da5527b13a40f784d' },
        { url: 'registerSW.js', revision: '67e84a2bf0fe378157e29e58690f153e' },
        { url: 'favicon.png', revision: '21a0a0a9b1fdb78eae4c9d97f7e90078' },
        { url: 'offline.html', revision: '482dfda22f8d7e7da5527b13a40f784d' },
        {
          url: 'images/icon-192x192.png',
          revision: '46d630e053c5521bd713e79f78d8a765',
        },
        {
          url: 'images/icon-512x512.png',
          revision: 'af195f67ce897a9b1d7e35d9e15bb627',
        },
        {
          url: 'images/logo.png',
          revision: 'ac73f380ba0147f4fa5951dfaba2a665',
        },
        {
          url: 'images/maskable_icon.png',
          revision: '136315ec86f97241a9057655581e3aed',
        },
        {
          url: 'manifest.webmanifest',
          revision: '2e7b93eaa0388626551120ba3cedf851',
        },
      ],
      {}
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      new e.NavigationRoute(e.createHandlerBoundToURL('index.html'))
    ),
    e.registerRoute(
      /^https:\/\/story-api\.dicoding\.dev\/v1\//,
      new e.NetworkFirst({
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        plugins: [],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:png|jpg|jpeg|svg|gif)$/,
      new e.CacheFirst({
        cacheName: 'image-cache',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 2592e3 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\//,
      new e.NetworkFirst({ cacheName: 'html-cache', plugins: [] }),
      'GET'
    );
});
//# sourceMappingURL=sw.js.map
