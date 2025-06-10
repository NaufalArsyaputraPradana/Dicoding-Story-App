# 🚀 DicoStory - Aplikasi Berbagi Cerita Dicoding

**Naufal Arsyaputra Pradana**
FC007D5Y1312
📧 Email: [111202214606@mhs.dinus.ac.id](mailto:111202214606@mhs.dinus.ac.id)

---

## 🌟 Aplikasi Web Progresif (PWA) Dicoding

**DicoStory** adalah platform berbagi cerita yang dirancang untuk memberikan pengalaman pengguna yang cepat, responsif, dan dapat diandalkan, bahkan dalam kondisi jaringan yang tidak stabil atau tanpa koneksi internet. Aplikasi ini dilengkapi dengan fitur *offline-first* dan *notifikasi push* untuk menjaga pengguna tetap terhubung dengan cerita-cerita terbaru.

---

## 📌 Catatan Penting

Aplikasi ini menggunakan layanan peta dari **Leaflet.js** dengan:

* **OpenStreetMap** sebagai provider *(tidak memerlukan API key)*.
* **MapTiler API**: `WlHVW3GmIbcYKHpoc75N`
* Untuk basemap tambahan:

  * **Satellite View** - ArcGIS *(tidak memerlukan API key untuk penggunaan dasar)*
  * **Topographic View** - OpenTopoMap *(tidak memerlukan API key)*

### API Digunakan

* **Dicoding Story API**
  Base URL: `https://story-api.dicoding.dev/v1`

---

## 🛠 Fitur Utama Aplikasi

### About the App

**Dicoding Story** is a platform for sharing programming and technology learning experiences. This app was created as a submission project for Dicoding's *Menjadi Front-End Web Developer Expert* class.

The application allows users to share their learning journey with others, add location to their stories, and explore stories from other learners.

### Features

* Share stories with images
* Add location to stories with interactive maps
* View stories from other users
* Responsive design for all devices
* Offline capability with cached data
* Push notifications for new features
* PWA: Installable & works offline
* Accessibility & dark mode support
* Modern UI/UX with animations
* Favorite & save stories for offline

---

## 🔥 Fitur Progressive Web App (PWA)

### Installable

* Dapat dipasang ke *homescreen* perangkat dengan icon dan splash screen yang disertakan.
* Disertai *shortcuts* untuk navigasi cepat.

### Offline Capability

* Menggunakan **Service Worker** dengan **Workbox** untuk *caching* aset statis.
* Penanganan jaringan offline dengan UI yang informatif.

### Penyimpanan Lokal (IndexedDB)

* Menyimpan cerita favorit untuk akses offline penuh.
* Dukungan untuk menambah, menampilkan, dan menghapus data favorit.
* Sinkronisasi data saat kembali online.

### Push Notification

* Menerima notifikasi saat ada cerita baru dan saat menambahkan cerita ke favorit.
* Dukungan untuk pengelolaan izin notifikasi.

---

## 🌐 Teknologi yang Digunakan

* HTML5
* CSS3
* JavaScript
* Leaflet.js
* **Leaflet Plugins**:

  * Leaflet.Control.Geocoder
  * Leaflet.LocateControl
  * Leaflet.vectorGrid
* PWA
* REST API
* IndexedDB
* Service Worker
* Push Notification
* Animate.css
* A11y

---

## 📝 Cara Penggunaan Aplikasi

1. Buka aplikasi di browser.
2. Register akun baru atau login jika sudah memiliki akun.
3. Di halaman utama, lihat daftar cerita yang telah dibagikan.
4. Klik tombol **"Tambah Cerita"** untuk membagikan cerita baru.

   * Ambil foto dengan kamera 📸
   * Isi deskripsi cerita ✍️
   * Pilih lokasi pada peta 🌍
   * Klik **"Bagikan Cerita"**
5. Klik **"Peta Cerita"** untuk melihat semua cerita dengan lokasi pada peta.
6. Tambahkan cerita ke favorit untuk akses offline dengan mengklik icon **bookmark**.
7. Pasang aplikasi ke homescreen dengan mengklik banner instalasi.

---

## ⚙️ Instalasi Aplikasi

### Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

#### Clone Repositori:

```bash
git clone https://github.com/NaufalArsyaputraPradana/Dicoding-Story-App
cd Dicoding-Story-App
```

#### Instal Dependensi (jika ada):

Jika proyek Anda memiliki dependensi Node.js atau lainnya, instal dengan:

```bash
npm install
# atau
yarn install
```

#### Jalankan Server Lokal:

Untuk PWA dan Service Worker, Anda perlu menjalankan aplikasi melalui server lokal. Anda bisa menggunakan `http-server` (Node.js) atau *Live Server* dari ekstensi VS Code.

##### Menggunakan http-server:

1. Instal secara global:

```bash
npm install -g http-server
```

2. Jalankan di direktori proyek:

```bash
http-server -p 8080
```

Aplikasi akan tersedia di `http://localhost:8080`.

---

## 🔔 Mengaktifkan Notifikasi Push

1. Akses aplikasi di browser yang mendukung PWA (misalnya Google Chrome, Firefox, Edge).
2. Aplikasi akan meminta izin untuk menampilkan notifikasi. Izinkan.
3. Pastikan Anda telah login (sesuai dengan `localStorage.getItem('accessToken')` di `notification-helper.js`) agar proses *subscription* notifikasi berhasil.
4. Setelah berhasil subscribe, notifikasi akan muncul secara real-time saat ada pembaruan dari server, bahkan saat aplikasi tidak aktif atau browser tertutup.

### Konfigurasi Notifikasi Push:

* Pastikan Anda telah mengonfigurasi `CONFIG.VAPID_PUBLIC_KEY` di file `CONFIG.js` (sesuai dengan `notification-helper.js` yang Anda miliki).
* Aplikasi ini memerlukan backend server yang dapat mengirim notifikasi push menggunakan kunci VAPID Anda.
* Pastikan server Anda terhubung dengan aplikasi ini dan dapat mengirimkan *payload* notifikasi yang sesuai.

---

## 🚀 Deployment

Aplikasi ini di-*deploy* menggunakan **GitHub Pages** dan dapat diakses melalui:

🔗 [https://naufalarsyaputrapradana.github.io/Dicoding-Story-App](https://naufalarsyaputrapradana.github.io/Dicoding-Story-App)

---

## 📄 Lisensi

Proyek ini dibuat sebagai bagian dari submission Dicoding dan hanya digunakan untuk keperluan pembelajaran.
Lisensi default mengikuti kebijakan penggunaan Dicoding Submission.

---

Terima kasih telah menggunakan **DicoStory**! 🎉
Selamat berbagi cerita dan menjelajah inspirasi!
