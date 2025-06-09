var Be=Object.defineProperty;var ie=s=>{throw TypeError(s)};var xe=(s,e,t)=>e in s?Be(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var N=(s,e,t)=>xe(s,typeof e!="symbol"?e+"":e,t),U=(s,e,t)=>e.has(s)||ie("Cannot "+t);var n=(s,e,t)=>(U(s,e,"read from private field"),t?t.call(s):e.get(s)),y=(s,e,t)=>e.has(s)?ie("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(s):e.set(s,t),m=(s,e,t,a)=>(U(s,e,"write to private field"),a?a.call(s,t):e.set(s,t),t),v=(s,e,t)=>(U(s,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(i){if(i.ep)return;i.ep=!0;const o=t(i);fetch(i.href,o)}})();(function(){window.onerror=function(s,e,t,a,i){var o,r;return console.error("Global error caught:",{message:s,source:e,lineno:t,colno:a,error:i}),s&&s.includes("Cannot read properties of undefined")?(window.hasShownErrorMessage||(window.hasShownErrorMessage=!0,setTimeout(()=>{window.hasShownErrorMessage=!1},5e3),window.location.hash.includes("error")||(o=window.showToast)==null||o.call(window,"Terjadi kesalahan saat menampilkan konten. Kami akan mencoba memperbaikinya secara otomatis.","warning")),!0):(s&&!window.location.hash.includes("error")&&((r=window.showToast)==null||r.call(window,"Terjadi kesalahan tak terduga. Silakan coba lagi atau muat ulang halaman.","error")),!1)},window.showToast=function(s,e="info",t=5e3){const a=document.getElementById("toast-container")||(()=>{const d=document.createElement("div");return d.id="toast-container",d.className="toast-container",d.setAttribute("aria-live","polite"),document.body.appendChild(d),d})(),i=document.createElement("div");i.className=`toast toast-${e}`,i.setAttribute("role","alert"),i.setAttribute("tabindex","0");const o=document.createElement("i");o.className=`fas ${e==="success"?"fa-check-circle":e==="error"?"fa-exclamation-circle":e==="warning"?"fa-exclamation-triangle":"fa-info-circle"}`,o.setAttribute("aria-hidden","true");const r=document.createElement("span");r.textContent=s;const c=document.createElement("button");c.className="toast-close-btn",c.setAttribute("aria-label","Tutup notifikasi"),c.innerHTML='<i class="fas fa-times"></i>',c.onclick=()=>{i.classList.remove("show"),setTimeout(()=>{a.contains(i)&&a.removeChild(i)},300)},i.appendChild(o),i.appendChild(r),i.appendChild(c),a.appendChild(i),requestAnimationFrame(()=>{setTimeout(()=>{i.classList.add("show"),i.focus()},10)}),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>{a.contains(i)&&a.removeChild(i)},300)},t)}})();(function(){const s=document.getElementById("connection-status"),e=document.getElementById("connection-message");if(!s||!e)return;let t=null;function a(o,r,c=3e3){s.classList.remove("hidden","online","offline"),s.classList.add(o),e.textContent=r,s.setAttribute("aria-live",o==="online"?"polite":"assertive"),s.setAttribute("role","status"),o==="online"?(clearTimeout(t),t=setTimeout(()=>{s.classList.add("hidden")},c)):(clearTimeout(t),s.classList.remove("hidden"))}function i(){var o,r;navigator.onLine?(a("online","Koneksi telah pulih"),(o=window.showToast)==null||o.call(window,"Anda kembali online!","success",3e3)):(a("offline","Anda sedang offline",0),(r=window.showToast)==null||r.call(window,"Anda sedang offline. Beberapa fitur mungkin tidak tersedia.","warning",4e3))}i(),window.addEventListener("online",i),window.addEventListener("offline",i)})();const p={BASE_URL:"https://story-api.dicoding.dev/v1",DEFAULT_LANGUAGE:"id-ID",CACHE_NAME:"DicodingStory-V7",DATABASE_NAME:"dicoding-story-db",DATABASE_VERSION:1,OBJECT_STORE_NAME:"stories",FAVORITES_STORE:"favorites",DEFAULT_MAP_CENTER:[-6.1754,106.8272],DEFAULT_MAP_ZOOM:13,PAGE_SIZE:10,API_TIMEOUT:3e4,API_RETRY_ATTEMPTS:2,API_RETRY_DELAY:1e3,MAX_PHOTO_SIZE:5*1024*1024,MAP_TILE_LAYERS:{osm:{url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',name:"OpenStreetMap"},satellite:{url:"https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=WlHVW3GmIbcYKHpoc75N",attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',name:"Satellite"},dark:{url:"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',name:"Dark Mode"}},VAPID_PUBLIC_KEY:"BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",SERVICE_WORKER_PATH:"./sw.js",OFFLINE_PAGE:"./offline.html",ACCESS_TOKEN_KEY:"accessToken",ENABLE_LOGGING:!1,SUPPORT_CONTACT:"support@dicodingstory.app",APP_VERSION:"1.0.0",FEEDBACK_URL:"https://github.com/naufalarsyaputrapradana/Dicoding-Story-App/issues"};class C{static async _fetchWithTimeout(e,t={},a=0){var d;const i=new AbortController,{signal:o}=i,r={...t,signal:o,mode:"cors",credentials:"same-origin"},c=setTimeout(()=>i.abort(),p.API_TIMEOUT);try{if(t.body instanceof FormData&&t.onProgress&&t.method==="POST")return await this._uploadWithProgress(e,t);const u=await fetch(e,r);if(!u.ok){const f=await u.json().catch(()=>({}));let g=f.message||`HTTP error! status: ${u.status}`;if(u.status===400){g=f.message||"Bad Request: The server could not process your request.";const E=new Error(g);throw E.status=u.status,E.data=f,E}else u.status===401?(g="Sesi Anda telah berakhir. Silakan login kembali.",setTimeout(()=>window.location.hash="#/login",2e3)):u.status===403?g="Anda tidak memiliki izin untuk melakukan aksi ini.":u.status===404?g="Resource yang diminta tidak ditemukan.":u.status===413?g="File yang diunggah terlalu besar.":u.status>=500&&(g="Terjadi kesalahan server. Silakan coba lagi nanti.");throw new Error(g)}return await u.json()}catch(u){if(u.name==="AbortError"){if(a<p.API_RETRY_ATTEMPTS)return await new Promise(f=>setTimeout(f,p.API_RETRY_DELAY)),this._fetchWithTimeout(e,t,a+1);throw new Error("Request timed out. Silakan periksa koneksi internet Anda dan coba lagi.")}if(u.message==="Failed to fetch"||u.message.includes("NetworkError")||u.message.includes("CORS")){if(e.includes("/notifications/"))return{status:"failed",error:u.message};(d=window.showToast)==null||d.call(window,"Masalah koneksi jaringan. Silakan periksa koneksi internet Anda.","warning")}throw u}finally{clearTimeout(c)}}static async _uploadWithProgress(e,t){return new Promise((a,i)=>{const o=new XMLHttpRequest;o.open(t.method||"POST",e),t.headers&&Object.keys(t.headers).forEach(r=>{o.setRequestHeader(r,t.headers[r])}),o.upload.addEventListener("progress",r=>{if(r.lengthComputable&&t.onProgress){const c=Math.round(r.loaded/r.total*100);t.onProgress(c)}}),o.addEventListener("load",()=>{if(o.status>=200&&o.status<300)try{a(JSON.parse(o.responseText))}catch{i(new Error("Format respons dari server tidak valid"))}else try{const r=JSON.parse(o.responseText);i(new Error(r.message||`HTTP error! status: ${o.status}`))}catch{i(new Error(`HTTP error! status: ${o.status}`))}}),o.addEventListener("error",()=>i(new Error("Terjadi kesalahan jaringan"))),o.addEventListener("abort",()=>i(new Error("Upload dibatalkan"))),o.addEventListener("timeout",()=>i(new Error("Upload melebihi batas waktu"))),o.send(t.body)})}static async register({name:e,email:t,password:a}){var i;this._validateEmail(t),this._validatePassword(a);try{const o=await this._fetchWithTimeout(`${p.BASE_URL}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,password:a})});return(i=window.showToast)==null||i.call(window,"Registrasi berhasil! Silakan login.","success"),o}catch(o){throw o.message.includes("email is already taken")?new Error("Email sudah digunakan. Silakan gunakan email lain."):o}}static async login({email:e,password:t}){var a;this._validateEmail(e);try{const i=await this._fetchWithTimeout(`${p.BASE_URL}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})});return(a=window.showToast)==null||a.call(window,`Selamat datang kembali, ${i.loginResult.name}!`,"success"),i}catch(i){throw i.message.includes("user not found")||i.message.includes("password")?new Error("Email atau password salah. Silakan coba lagi."):i}}static async getAllStories({token:e,page:t=1,size:a=p.PAGE_SIZE,location:i=0}){var o;this._validateToken(e);try{const r=await this._fetchWithTimeout(`${p.BASE_URL}/stories?page=${t}&size=${a}&location=${i}`,{headers:{Authorization:`Bearer ${e}`}});if(!r||!r.listStory)throw new Error("Format respons dari server tidak valid");return r}catch(r){throw(o=window.showToast)==null||o.call(window,"Gagal memuat cerita. "+r.message,"error"),r}}static async getStoryDetail({token:e,id:t}){if(this._validateToken(e),!t)throw new Error("ID cerita tidak valid");return this._fetchWithTimeout(`${p.BASE_URL}/stories/${t}`,{headers:{Authorization:`Bearer ${e}`}})}static async addNewStory({token:e,data:t,onProgress:a}){var i;this._validateToken(e);try{if(!t.has("description"))throw new Error("Deskripsi wajib diisi");if(!t.has("photo"))throw new Error("Foto wajib diunggah");const o={method:"POST",headers:{Authorization:`Bearer ${e}`},body:t,onProgress:a},r=await this._fetchWithTimeout(`${p.BASE_URL}/stories`,o);return(i=window.showToast)==null||i.call(window,"Cerita berhasil ditambahkan!","success"),r}catch(o){throw o.message.includes("photo")?new Error("Gagal mengunggah foto. Pastikan ukuran foto tidak melebihi 5MB."):o.status===400?new Error("Pastikan semua data yang dikirim valid (foto dan deskripsi wajib diisi)."):o.message.includes("Network")||o.message.includes("timeout")?new Error("Koneksi gagal. Periksa koneksi internet Anda dan coba lagi."):o}}static async subscribeNotification({token:e,subscription:t}){var a,i;this._validateToken(e);try{const o=await this._fetchWithTimeout(`${p.BASE_URL}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify(t)});return(a=window.showToast)==null||a.call(window,"Notifikasi berhasil diaktifkan!","success"),o}catch(o){throw(i=window.showToast)==null||i.call(window,"Gagal mengaktifkan notifikasi","error"),o}}static async unsubscribeNotification({token:e,endpoint:t}){var a,i,o;if(this._validateToken(e),!t)throw new Error("Endpoint notifikasi tidak valid");try{if(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")return(a=window.showToast)==null||a.call(window,"Notifikasi berhasil dinonaktifkan (dev mode)","info"),{success:!0,message:"Unsubscribed from notifications (development mock)"};const c=await this._fetchWithTimeout(`${p.BASE_URL}/notifications/subscribe`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({endpoint:t})});return(i=window.showToast)==null||i.call(window,"Notifikasi berhasil dinonaktifkan","info"),c}catch(r){throw window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||(o=window.showToast)==null||o.call(window,"Gagal menonaktifkan notifikasi","error"),r}}static _validateToken(e){if(!e)throw new Error("Autentikasi diperlukan. Silakan login terlebih dahulu.")}static _validateEmail(e){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))throw new Error("Silakan masukkan alamat email yang valid")}static _validatePassword(e){if(!e||e.length<8)throw new Error("Password harus minimal 8 karakter")}}function fe(s,e="id-ID",t={}){const a={year:"numeric",month:"long",day:"numeric",...t};try{return new Date(s).toLocaleDateString(e,a)}catch(i){return console.error("Error formatting date:",i),s||"Unknown date"}}function se(s,e=100){return s?s.length<=e?s:`${s.substring(0,e)}...`:""}function Me(s,e=300,t=!1){let a;return function(...o){const r=this,c=()=>{a=null,t||s.apply(r,o)},d=t&&!a;clearTimeout(a),a=setTimeout(c,e),d&&s.apply(r,o)}}function H(s){const e=["Bytes","KB","MB","GB"],t=Math.floor(Math.log(s)/Math.log(1024));return parseFloat((s/Math.pow(1024,t)).toFixed(2))+" "+e[t]}function ge(s){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)}function we(s){return!s||typeof s!="string"?"U":s.split(" ").map(e=>e.charAt(0)).join("").toUpperCase().substring(0,2)}function q(){return navigator.onLine}class Pe extends HTMLElement{connectedCallback(){this.render(),this.setupEventListeners(),this.checkNotificationPermission()}render(){const e=!!localStorage.getItem("accessToken");let t=null;try{const a=localStorage.getItem("user");a&&a!=="undefined"&&(t=JSON.parse(a))}catch{localStorage.removeItem("user")}this.innerHTML=`
      <header>
        <div class="container main-header">
          <a class="brand-name" href="#/" aria-label="Home">
            <img src="/images/logo.png" alt="Dicoding Story Logo" width="32" height="32">
            Dicoding Story
          </a>
          <nav id="navigation-drawer" class="navigation-drawer" aria-label="Main navigation">
            <ul id="nav-list" class="nav-list">
              <li>
                <a href="#/" class="${window.location.hash==="#/"?"active":""}" aria-current="${window.location.hash==="#/"?"page":"false"}">
                  <i class="fas fa-home" aria-hidden="true"></i> Home
                </a>
              </li>
              <li>
                <a href="#/about" class="${window.location.hash==="#/about"?"active":""}" aria-current="${window.location.hash==="#/about"?"page":"false"}">
                  <i class="fas fa-info-circle" aria-hidden="true"></i> About
                </a>
              </li>
              ${e?`
                    <li>
                      <a href="#/stories/add" class="${window.location.hash==="#/stories/add"?"active":""}" aria-current="${window.location.hash==="#/stories/add"?"page":"false"}">
                        <i class="fas fa-plus-circle" aria-hidden="true"></i> Add Story
                      </a>
                    </li>
                    <li>
                      <a href="#/saved" class="${window.location.hash==="#/saved"?"active":""}" aria-current="${window.location.hash==="#/saved"?"page":"false"}">
                        <i class="fas fa-database" aria-hidden="true"></i> Saved Stories
                      </a>
                    </li>
                    <li class="user-menu">
                      <div class="user-info" tabindex="0" aria-haspopup="true" aria-expanded="false">
                        <div class="user-avatar" aria-hidden="true">${we(t==null?void 0:t.name)}</div>
                        <span>${(t==null?void 0:t.name)||"User"}</span>
                        <i class="fas fa-chevron-down ml-1" aria-hidden="true"></i>
                      </div>
                      <ul class="user-dropdown" role="menu" style="display: none;">
                        <li role="none">
                          <button id="notification-toggle" class="dropdown-button notification-toggle" role="menuitem">
                            <i class="fas fa-bell" aria-hidden="true"></i>
                            <span id="notification-status">Enable Notifications</span>
                            <span class="status-indicator"></span>
                          </button>
                        </li>
                        <li role="none">
                          <button id="logout-button" class="dropdown-button logout-button" role="menuitem">
                            <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                            Logout
                          </button>
                        </li>
                      </ul>
                    </li>
                  `:`
                    <li>
                      <a href="#/login" class="${window.location.hash==="#/login"?"active":""}" aria-current="${window.location.hash==="#/login"?"page":"false"}">
                        <i class="fas fa-sign-in-alt" aria-hidden="true"></i> Login
                      </a>
                    </li>
                    <li>
                      <a href="#/register" class="${window.location.hash==="#/register"?"active":""}" aria-current="${window.location.hash==="#/register"?"page":"false"}">
                        <i class="fas fa-user-plus" aria-hidden="true"></i> Register
                      </a>
                    </li>
                  `}
            </ul>
          </nav>
          <button id="drawer-button" class="drawer-button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="navigation-drawer">
            <i class="fas fa-bars" aria-hidden="true"></i>
          </button>
        </div>
      </header>
    `}setupEventListeners(){this._setupDrawerToggle(),this._setupUserMenu(),this._setupLogoutButton(),this._setupNotificationToggle()}_setupDrawerToggle(){const e=this.querySelector("#drawer-button"),t=this.querySelector("#navigation-drawer");!e||!t||(e.addEventListener("click",a=>{a.stopPropagation();const i=t.classList.toggle("open");if(e.setAttribute("aria-expanded",i),i){const o=t.querySelector("a");o&&o.focus()}}),document.addEventListener("click",a=>{t.contains(a.target)||(t.classList.remove("open"),e.setAttribute("aria-expanded","false"))}),document.addEventListener("keydown",a=>{a.key==="Escape"&&(t.classList.remove("open"),e.setAttribute("aria-expanded","false"),e.focus())}))}_setupUserMenu(){const e=this.querySelector(".user-menu");if(!e)return;const t=e.querySelector(".user-info"),a=e.querySelector(".user-dropdown");t.addEventListener("click",i=>{i.stopPropagation();const o=t.getAttribute("aria-expanded")==="true";t.setAttribute("aria-expanded",!o),a.style.display=o?"none":"block"}),document.addEventListener("click",()=>{t.setAttribute("aria-expanded","false"),a.style.display="none"}),t.addEventListener("keydown",i=>{if(i.key==="Enter"||i.key===" "){i.preventDefault();const o=t.getAttribute("aria-expanded")==="true";if(t.setAttribute("aria-expanded",!o),a.style.display=o?"none":"block",!o){const r=a.querySelector("button");r&&r.focus()}}})}_setupLogoutButton(){const e=this.querySelector("#logout-button");e&&e.addEventListener("click",()=>{Swal.fire({title:"Logout",text:"Are you sure you want to logout?",icon:"question",showCancelButton:!0,confirmButtonColor:"#4361ee",cancelButtonColor:"#f72585",confirmButtonText:"Yes, Logout",cancelButtonText:"Cancel",focusCancel:!0}).then(t=>{t.isConfirmed&&(this._cleanupNotifications(),localStorage.removeItem("token"),localStorage.removeItem("user"),window.showToast&&window.showToast("Logout berhasil","success"),window.location.hash="#/login")})})}async _cleanupNotifications(){if(!(!("serviceWorker"in navigator)||!("PushManager"in window)))try{const t=await(await navigator.serviceWorker.ready).pushManager.getSubscription();t&&await t.unsubscribe()}catch{}}async checkNotificationPermission(){const e=this.querySelector("#notification-toggle"),t=this.querySelector("#notification-status"),a=this.querySelector(".status-indicator");if(!(!e||!t||!a))if(Notification.permission==="granted"){const i=await this._checkActiveSubscription();t.textContent=i?"Disable Notifications":"Enable Notifications",a.classList.toggle("active",i),e.classList.toggle("enabled",i)}else Notification.permission==="denied"?(t.textContent="Notifications Blocked",e.disabled=!0,e.classList.add("blocked"),a.classList.add("blocked")):(t.textContent="Enable Notifications",a.classList.remove("active"),e.classList.remove("enabled"))}async _checkActiveSubscription(){if(!("serviceWorker"in navigator)||!("PushManager"in window))return!1;try{return!!await(await navigator.serviceWorker.ready).pushManager.getSubscription()}catch{return!1}}_setupNotificationToggle(){const e=this.querySelector("#notification-toggle"),t=this.querySelector("#notification-status"),a=this.querySelector(".status-indicator");!e||!t||!a||e.addEventListener("click",async()=>{if(e.disabled)return;e.disabled=!0,e.classList.add("loading");const i=t.textContent;t.textContent="Processing...";try{if(await this._checkActiveSubscription())await this._unsubscribeFromNotifications(),t.textContent="Enable Notifications",a.classList.remove("active"),e.classList.remove("enabled");else if(Notification.permission==="granted")await this._subscribeToNotifications(),t.textContent="Disable Notifications",a.classList.add("active"),e.classList.add("enabled");else{const r=await Notification.requestPermission();r==="granted"?(await this._subscribeToNotifications(),t.textContent="Disable Notifications",a.classList.add("active"),e.classList.add("enabled")):r==="denied"&&(t.textContent="Notifications Blocked",e.disabled=!0,e.classList.add("blocked"),a.classList.add("blocked"),window.showToast&&window.showToast("Izin notifikasi ditolak oleh browser","warning"))}}catch{t.textContent=i,window.showToast&&window.showToast("Gagal mengubah status notifikasi","error")}finally{e.disabled=!1,e.classList.remove("loading")}})}async _subscribeToNotifications(){if(!("serviceWorker"in navigator)||!("PushManager"in window))return;const e=localStorage.getItem("accessToken");if(e)try{const t=await navigator.serviceWorker.ready,a=await t.pushManager.getSubscription();a&&await a.unsubscribe();const i=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:p.VAPID_PUBLIC_KEY}),{endpoint:o,keys:r}=i.toJSON();return await C.subscribeNotification({token:e,subscription:{endpoint:o,keys:r}}),window.showToast&&window.showToast("Notifikasi berhasil diaktifkan","success"),!0}catch{return window.showToast&&window.showToast("Gagal mengaktifkan notifikasi","error"),!1}}async _unsubscribeFromNotifications(){const e=localStorage.getItem("accessToken");if(!e)return!1;try{const a=await(await navigator.serviceWorker.ready).pushManager.getSubscription();if(a){try{await C.unsubscribeNotification({token:e,endpoint:a.endpoint})}catch{}return await a.unsubscribe(),window.showToast&&window.showToast("Notifikasi berhasil dinonaktifkan","info"),!0}return!0}catch{return window.showToast&&window.showToast("Gagal menonaktifkan notifikasi","error"),!1}}}customElements.define("app-header",Pe);class De extends HTMLElement{constructor(){super(),this._isInitialized=!1,this._isLoggedIn=!1,this._userData=null,this._checkLoginStatus()}connectedCallback(){this._render(),this._isInitialized=!0,this._bindEvents(),window.addEventListener("hashchange",()=>this._render()),window.addEventListener("user-login-state-changed",e=>{this._isLoggedIn=e.detail.isLoggedIn,this._userData=e.detail.userData,this._render()})}disconnectedCallback(){window.removeEventListener("hashchange",this._render),window.removeEventListener("user-login-state-changed",this._render)}_checkLoginStatus(){try{const e=localStorage.getItem("accessToken"),t=localStorage.getItem("user");if(e&&t&&t!=="undefined")try{this._isLoggedIn=!0,this._userData=JSON.parse(t)}catch{localStorage.removeItem("user"),this._isLoggedIn=!!e,this._userData=null}else this._isLoggedIn=!1,this._userData=null}catch{this._isLoggedIn=!1,this._userData=null}}_render(){this.innerHTML=`
      <div class="sidebar-container">
        <button id="sidebar-toggle" class="sidebar-toggle" aria-label="Open sidebar">
          <i class="fas fa-bars"></i>
        </button>
        <div id="sidebar" class="sidebar position-fixed" tabindex="-1" aria-label="Sidebar navigation">
          <div class="sidebar-header">
            <img src="./images/logo.png" alt="Dicoding Story Logo" class="sidebar-logo">
            <h2 class="sidebar-title">Dicoding Story</h2>
            <button id="sidebar-close" class="sidebar-close" aria-label="Close sidebar">
              <i class="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>
          <div class="sidebar-content">
            ${this._renderUserSection()}
            <nav class="sidebar-nav" aria-label="Sidebar main navigation">
              <ul>
                <li>
                  <a href="#/" class="sidebar-link ${this._isActiveRoute("#/")?"active":""}">
                    <i class="fas fa-home" aria-hidden="true"></i>
                    <span>Home</span>
                  </a>
                </li>
                ${this._isLoggedIn?`
                <li>
                  <a href="#/stories/add" class="sidebar-link ${this._isActiveRoute("#/stories/add")?"active":""}">
                    <i class="fas fa-plus-circle" aria-hidden="true"></i>
                    <span>Add Story</span>
                  </a>
                </li>
                `:""}
                <li>
                  <a href="#/about" class="sidebar-link ${this._isActiveRoute("#/about")?"active":""}">
                    <i class="fas fa-info-circle" aria-hidden="true"></i>
                    <span>About</span>
                  </a>
                </li>
                <li>
                  <a href="#/saved" class="sidebar-link ${this._isActiveRoute("#/saved")?"active":""}" id="sidebar-saved-link">
                    <i class="fas fa-database" aria-hidden="true"></i>
                    <span>Saved Stories</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div class="sidebar-footer">
            ${this._isLoggedIn?`
              <button id="logout-button" class="sidebar-logout-button">
                <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                <span>Log Out</span>
              </button>
            `:`
              <div class="sidebar-auth-buttons">
                <a href="#/login" class="sidebar-auth-button login">
                  <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
                  <span>Login</span>
                </a>
                <a href="#/register" class="sidebar-auth-button register">
                  <i class="fas fa-user-plus" aria-hidden="true"></i>
                  <span>Register</span>
                </a>
              </div>
            `}
          </div>
        </div>
        <div id="sidebar-overlay" class="sidebar-overlay"></div>
      </div>
    `}_renderUserSection(){if(!this._isLoggedIn||!this._userData)return`
        <div class="sidebar-guest">
          <i class="fas fa-user-circle sidebar-guest-icon" aria-hidden="true"></i>
          <p>Welcome, Guest!</p>
          <small>Login to share your story</small>
        </div>
      `;const e=this._getInitials(this._userData.name);return`
      <div class="sidebar-user">
        <div class="sidebar-user-avatar" style="background-color: ${this._getAvatarColor(this._userData.name)}">
          ${this._userData.photoUrl?`<img src="${this._userData.photoUrl}" alt="${this._userData.name}'s avatar">`:`<span class="avatar-initials">${e}</span>`}
        </div>
        <div class="sidebar-user-info">
          <h3 class="sidebar-user-name">${this._userData.name}</h3>
          <p class="sidebar-user-email">${this._userData.email}</p>
        </div>
      </div>
    `}_getInitials(e){return!e||typeof e!="string"?"?":e.split(" ").map(t=>t.charAt(0)).join("").toUpperCase().substring(0,2)}_getAvatarColor(e){if(!e)return"#4361ee";const t=["#4361ee","#3a0ca3","#f72585","#4cc9f0","#4895ef","#560bad","#f8961e","#fb5607","#80b918"];let a=0;for(let i=0;i<e.length;i++)a=e.charCodeAt(i)+((a<<5)-a);return t[Math.abs(a)%t.length]}_bindEvents(){const e=this.querySelector("#sidebar-toggle"),t=this.querySelector("#sidebar"),a=this.querySelector("#sidebar-overlay"),i=this.querySelector("#sidebar-close");e&&e.addEventListener("click",()=>this._toggleSidebar()),i&&i.addEventListener("click",()=>this._closeSidebar()),a&&a.addEventListener("click",()=>this._closeSidebar());const o=this.querySelector("#logout-button");o&&o.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("user-logout",{bubbles:!0,composed:!0})),this._closeSidebar()}),this.querySelectorAll(".sidebar-link").forEach(d=>{d.addEventListener("click",()=>this._closeSidebar())});const c=this.querySelector("#sidebar-saved-link");c&&c.addEventListener("click",d=>{d.preventDefault(),window.location.hash="#/saved",this._closeSidebar()}),t&&t.addEventListener("keydown",d=>{d.key==="Escape"&&this._closeSidebar()})}_toggleSidebar(){const e=this.querySelector("#sidebar"),t=this.querySelector("#sidebar-overlay");!e||!t||(e.classList.contains("open")?this._closeSidebar():(e.classList.add("open"),t.classList.add("visible"),document.body.classList.add("sidebar-open"),e.focus()))}_closeSidebar(){const e=this.querySelector("#sidebar"),t=this.querySelector("#sidebar-overlay");!e||!t||(e.classList.remove("open"),t.classList.remove("visible"),document.body.classList.remove("sidebar-open"))}_isActiveRoute(e){const t=window.location.hash||"#/";return!!(t===e||e==="#/stories/add"&&t.includes("#/stories/add")||e==="#/stories"&&t.includes("#/stories/")&&!t.includes("#/stories/add")||e==="#/saved"&&(t==="#/favorites"||t==="#/saved"))}}customElements.define("app-sidebar",De);class Ne extends HTMLElement{connectedCallback(){this.render(),this.setupEventListeners()}render(){const e=new Date().getFullYear();this.innerHTML=`
      <footer class="app-footer" role="contentinfo">
        <div class="container footer-content">
          <div class="social-links" aria-label="Social media links">
            <a href="https://github.com/NaufalArsyaputraPradana/" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/naufalarsyaputrapradana/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-linkedin"></i>
            </a>
            <a href="https://www.instagram.com/arsya.pradana_/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
          <p class="footer-year" tabindex="0" style="cursor:pointer;">
            &copy; ${e} Dicoding Story. All rights reserved.
          </p>
          <p class="copyright">
            Made with <i class="fas fa-code" style="color: var(--danger)" aria-hidden="true"></i>
            by <a href="https://github.com/NaufalArsyaputraPradana/" target="_blank" rel="noopener noreferrer">Naufal Arsyaputra Pradana</a>
            for Dicoding Submission
          </p>
        </div>
      </footer>
    `}setupEventListeners(){const e=this.querySelector(".footer-year");e&&(e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}),e.addEventListener("keydown",t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),window.scrollTo({top:0,behavior:"smooth"}))}))}}customElements.define("app-footer",Ne);class Oe extends HTMLElement{constructor(){super(),this.message="Loading...",this._timeout=null}static get observedAttributes(){return["message"]}attributeChangedCallback(e,t,a){e==="message"&&t!==a&&(this.message=a,this.renderMessage())}connectedCallback(){this.render(),this.hide()}show(e="",t=0){e&&(this.message=e,this.renderMessage()),this.style.display="flex",this.setAttribute("aria-busy","true"),t>0&&(clearTimeout(this._timeout),this._timeout=setTimeout(()=>this.hide(),t))}hide(){this.style.display="none",this.setAttribute("aria-busy","false"),clearTimeout(this._timeout)}render(){this.innerHTML=`
      <div class="loading-spinner" aria-live="polite" aria-busy="true">
        <div class="spinner"></div>
        <p class="loading-message">${this.message}</p>
      </div>
    `}renderMessage(){const e=this.querySelector(".loading-message");e&&(e.textContent=this.message)}}customElements.define("app-loader",Oe);const J=(s,e)=>e.some(t=>s instanceof t);let oe,re;function Fe(){return oe||(oe=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function $e(){return re||(re=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const W=new WeakMap,j=new WeakMap,R=new WeakMap;function qe(s){const e=new Promise((t,a)=>{const i=()=>{s.removeEventListener("success",o),s.removeEventListener("error",r)},o=()=>{t(M(s.result)),i()},r=()=>{a(s.error),i()};s.addEventListener("success",o),s.addEventListener("error",r)});return R.set(e,s),e}function Re(s){if(W.has(s))return;const e=new Promise((t,a)=>{const i=()=>{s.removeEventListener("complete",o),s.removeEventListener("error",r),s.removeEventListener("abort",r)},o=()=>{t(),i()},r=()=>{a(s.error||new DOMException("AbortError","AbortError")),i()};s.addEventListener("complete",o),s.addEventListener("error",r),s.addEventListener("abort",r)});W.set(s,e)}let Y={get(s,e,t){if(s instanceof IDBTransaction){if(e==="done")return W.get(s);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return M(s[e])},set(s,e,t){return s[e]=t,!0},has(s,e){return s instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in s}};function ve(s){Y=s(Y)}function Ue(s){return $e().includes(s)?function(...e){return s.apply(K(this),e),M(this.request)}:function(...e){return M(s.apply(K(this),e))}}function He(s){return typeof s=="function"?Ue(s):(s instanceof IDBTransaction&&Re(s),J(s,Fe())?new Proxy(s,Y):s)}function M(s){if(s instanceof IDBRequest)return qe(s);if(j.has(s))return j.get(s);const e=He(s);return e!==s&&(j.set(s,e),R.set(e,s)),e}const K=s=>R.get(s);function je(s,e,{blocked:t,upgrade:a,blocking:i,terminated:o}={}){const r=indexedDB.open(s,e),c=M(r);return a&&r.addEventListener("upgradeneeded",d=>{a(M(r.result),d.oldVersion,d.newVersion,M(r.transaction),d)}),t&&r.addEventListener("blocked",d=>t(d.oldVersion,d.newVersion,d)),c.then(d=>{o&&d.addEventListener("close",()=>o()),i&&d.addEventListener("versionchange",u=>i(u.oldVersion,u.newVersion,u))}).catch(()=>{}),c}const Ve=["get","getKey","getAll","getAllKeys","count"],ze=["put","add","delete","clear"],V=new Map;function ne(s,e){if(!(s instanceof IDBDatabase&&!(e in s)&&typeof e=="string"))return;if(V.get(e))return V.get(e);const t=e.replace(/FromIndex$/,""),a=e!==t,i=ze.includes(t);if(!(t in(a?IDBIndex:IDBObjectStore).prototype)||!(i||Ve.includes(t)))return;const o=async function(r,...c){const d=this.transaction(r,i?"readwrite":"readonly");let u=d.store;return a&&(u=u.index(c.shift())),(await Promise.all([u[t](...c),i&&d.done]))[0]};return V.set(e,o),o}ve(s=>({...s,get:(e,t,a)=>ne(e,t)||s.get(e,t,a),has:(e,t)=>!!ne(e,t)||s.has(e,t)}));const Ge=["continue","continuePrimaryKey","advance"],ce={},Z=new WeakMap,ye=new WeakMap,Je={get(s,e){if(!Ge.includes(e))return s[e];let t=ce[e];return t||(t=ce[e]=function(...a){Z.set(this,ye.get(this)[e](...a))}),t}};async function*We(...s){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...s)),!e)return;e=e;const t=new Proxy(e,Je);for(ye.set(t,e),R.set(t,K(e));e;)yield t,e=await(Z.get(t)||e.continue()),Z.delete(t)}function le(s,e){return e===Symbol.asyncIterator&&J(s,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&J(s,[IDBIndex,IDBObjectStore])}ve(s=>({...s,get(e,t,a){return le(e,t)?We:s.get(e,t,a)},has(e,t){return le(e,t)||s.has(e,t)}}));const Ye="dicoding-story-db",Ke=1,P="stories",A="favorites";async function S(){return je(Ye,Ke,{upgrade(s){s.objectStoreNames.contains(P)||s.createObjectStore(P,{keyPath:"id"}),s.objectStoreNames.contains(A)||s.createObjectStore(A,{keyPath:"id"})}})}async function X(s){if(!Array.isArray(s))return;const t=(await S()).transaction(P,"readwrite");for(const a of s)try{await t.store.put(a)}catch(i){console.error("Failed to save story:",a,i)}await t.done}async function be(){return(await S()).getAll(P)}async function Ze(s){return(await S()).get(P,s)}async function Xe(s){return(await S()).delete(P,s)}async function Qe(){return(await S()).clear(P)}async function et(s){if(!s||!s.id)return;await(await S()).put(A,s)}async function tt(s){await(await S()).delete(A,s)}async function at(){return(await S()).getAll(A)}async function it(s){return!!await(await S()).get(A,s)}async function st(){return(await S()).clear(A)}async function ot(s){if(!Array.isArray(s))return;const t=(await S()).transaction(A,"readwrite");for(const a of s)try{await t.store.put(a)}catch(i){console.error("Failed to save favorite:",a,i)}await t.done}const B={saveStories:X,getAllStories:be,getStoryById:Ze,deleteStory:Xe,clearStories:Qe,addToFavorites:et,removeFromFavorites:tt,getFavorites:at,isFavorite:it,clearFavorites:st,bulkSaveFavorites:ot};class rt extends HTMLElement{set story(e){this._story=e,this.render()}render(){if(this._story)try{const e={id:this._story.id||`unknown-${Date.now()}`,name:this._story.name||"Unknown User",description:this._story.description||"No description provided",photoUrl:this._story.photoUrl||"./images/placeholder.jpg",createdAt:this._story.createdAt||new Date().toISOString(),lat:this._story.lat,lon:this._story.lon},t=fe(e.createdAt,"id-ID"),a=`story-title-${e.id}`,i=`story-desc-${e.id}`,o=de(e.name);let r=!1;try{const d=localStorage.getItem("favoriteStories");if(d){const u=JSON.parse(d);r=Array.isArray(u)&&u.includes(e.id)}}catch{r=!1}this.innerHTML=`
        <article class="story-item" aria-labelledby="${a}" aria-describedby="${i}">
          <div class="story-image-container">
            <div class="story-badge" style="background-color: ${o}">
              <i class="fas fa-camera" aria-hidden="true"></i>
            </div>
            <img 
              class="story-image" 
              src="${e.photoUrl}" 
              alt="Photo shared by ${e.name}" 
              loading="lazy"
              onerror="this.src='./images/placeholder.jpg'"
            >
          </div>
          <div class="story-content">
            <div class="story-header">
              <div class="story-user">
                <div class="user-avatar" aria-hidden="true" style="background-color: ${o}">
                  ${we(e.name)}
                </div>
                <div>
                  <h3 class="story-name" id="${a}">${e.name}</h3>
                  <time class="story-date" datetime="${e.createdAt}">
                    <i class="far fa-calendar-alt" aria-hidden="true"></i> ${t}
                  </time>
                </div>
              </div>
              ${e.lat&&e.lon?`<div class="story-location-badge" title="Has location data">
                      <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                    </div>`:""}
            </div>
            <p class="story-description" id="${i}">${se(e.description,120)}</p>
            ${e.lat&&e.lon?`<div class="story-map" id="map-${e.id}" aria-label="Location of story by ${e.name}" tabindex="0"></div>`:""}
            <div class="story-actions">
              <a href="#/stories/${e.id}" class="story-link" aria-label="Read full story by ${e.name}">
                <i class="fas fa-book-reader" aria-hidden="true"></i>
                Read Full Story
              </a>
              <button 
                class="save-story-btn${r?" saved":""}" 
                aria-label="${r?"Saved":"Save to favorites"}"
                title="${r?"Saved":"Save to favorites"}"
              >
                <i class="fas fa-bookmark"></i>
                <span>${r?"Saved":"Save"}</span>
              </button>
            </div>
          </div>
        </article>
      `;const c=this.querySelector(".save-story-btn");c&&c.addEventListener("click",async d=>{var g,E,te,ae;d.preventDefault();let u=[];try{const D=localStorage.getItem("favoriteStories");u=D?JSON.parse(D):[]}catch{u=[]}if(u.includes(e.id)){u=u.filter(D=>D!==e.id),localStorage.setItem("favoriteStories",JSON.stringify(u)),c.classList.remove("saved"),c.setAttribute("aria-label","Save to favorites"),c.title="Save to favorites",c.querySelector("span").textContent="Save";try{await B.removeFromFavorites(e.id)}catch{(te=window.showToast)==null||te.call(window,"Gagal menghapus dari database lokal","error")}(ae=window.showToast)==null||ae.call(window,"Cerita dihapus dari Favorit","info")}else{u.push(e.id),localStorage.setItem("favoriteStories",JSON.stringify(u)),c.classList.add("saved"),c.setAttribute("aria-label","Saved"),c.title="Saved",c.querySelector("span").textContent="Saved";try{await B.addToFavorites(e)}catch{(g=window.showToast)==null||g.call(window,"Gagal menyimpan ke database lokal","error")}(E=window.showToast)==null||E.call(window,"Cerita disimpan ke Favorit!","success")}}),e.lat&&e.lon&&requestAnimationFrame(()=>this.renderMap())}catch{this.innerHTML=`
        <article class="story-item">
          <div class="story-content">
            <div class="story-header">
              <div class="story-user">
                <div class="user-avatar" style="background-color: #4361ee">U</div>
                <div>
                  <h3 class="story-name">Story data error</h3>
                  <time class="story-date">Unknown date</time>
                </div>
              </div>
            </div>
            <p class="story-description">There was an error rendering this story. Please try refreshing the page.</p>
            <div class="story-actions">
              <a href="#/" class="story-link">
                <i class="fas fa-home" aria-hidden="true"></i>
                Back to Home
              </a>
            </div>
          </div>
        </article>
      `}}renderMap(){try{if(!this._story)return;const e=parseFloat(this._story.lat),t=parseFloat(this._story.lon);if(isNaN(e)||isNaN(t))return;const a=this._story.id||`unknown-${Date.now()}`,i=this._story.name||"Unknown User",o=this._story.description||"",r=this.querySelector(`#map-${a}`);if(!r||!window.L)return;const c=L.map(r,{zoomControl:!1,dragging:!1,touchZoom:!1,scrollWheelZoom:!1,doubleClickZoom:!1,boxZoom:!1,keyboard:!1,attributionControl:!1}).setView([e,t],13);L.tileLayer(p.MAP_TILE_LAYERS.osm.url,{maxZoom:19}).addTo(c);const d=de(i),u=L.divIcon({html:`<div style="background-color: ${d}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                <i class="fas fa-map-marker-alt"></i>
              </div>`,className:"",iconSize:[30,30],iconAnchor:[15,30]});L.marker([e,t],{icon:u}).addTo(c).bindPopup(`<div class="map-popup">
            <b>${i}</b>
            <p>${se(o,50)}...</p>
            <a href="#/stories/${a}" class="popup-link">View Details</a>
          </div>`,{className:"custom-popup",closeButton:!1}).openPopup(),c.on("click",()=>{window.location.hash=`#/stories/${a}`}),r.addEventListener("keydown",f=>{(f.key==="Enter"||f.key===" ")&&(window.location.hash=`#/stories/${a}`)})}catch{}}connectedCallback(){try{if("IntersectionObserver"in window&&window.matchMedia("(prefers-reduced-motion: no-preference)").matches){const e=new IntersectionObserver(t=>{t.forEach(a=>{a.isIntersecting&&(this.classList.add("visible"),e.unobserve(this))})},{threshold:.2});e.observe(this)}else this.classList.add("visible")}catch{this.classList.add("visible")}}}customElements.define("app-card",rt);function de(s){const e=["#4361ee","#3f37c9","#4895ef","#4cc9f0","#f72585","#7209b7","#3a0ca3","#f8961e","#fb5607","#80b918"];if(!s||typeof s!="string")return e[0];const t=s.split("").reduce((a,i)=>i.charCodeAt(0)+((a<<5)-a),0);return e[Math.abs(t)%e.length]}var h,I,b,_,O,k,Se,Q,Ee;class nt{constructor({view:e}){y(this,k);y(this,h);y(this,I,1);y(this,b,!0);y(this,_,!1);y(this,O,!1);m(this,h,e)}async init(){try{n(this,h).renderPage(),v(this,k,Se).call(this),await v(this,k,Q).call(this)}catch(e){console.error("Error in HomePresenter.init:",e),n(this,h).showError("Error initializing page. Please try refreshing.")}}}h=new WeakMap,I=new WeakMap,b=new WeakMap,_=new WeakMap,O=new WeakMap,k=new WeakSet,Se=function(){n(this,h).setLoadMoreCallback(()=>v(this,k,Ee).call(this)),n(this,h).setLocationFilterCallback(e=>{m(this,O,e),m(this,I,1),m(this,b,!0),v(this,k,Q).call(this)})},Q=async function(){if(!n(this,_)){m(this,_,!0),m(this,I,1);try{n(this,h).clearStories(),n(this,h).showLoading();const e=localStorage.getItem("accessToken");if(!e){n(this,h).showLoginRequired();return}const t=await C.getAllStories({token:e,page:n(this,I),location:n(this,O)?1:0});if(t.error){n(this,h).showError(t.message||"Gagal memuat cerita");return}if(!t||typeof t!="object"){n(this,h).showError("Format respons server tidak valid");return}const a=t.listStory||[],i=t.size||10;if(!Array.isArray(a)){n(this,h).showError("Format data cerita tidak valid");return}a.length===0?(n(this,h).showEmptyState(),m(this,b,!1)):(await X(a),n(this,h).renderStories(a),m(this,b,a.length===i),n(this,h).updateLoadMoreButton(n(this,b)))}catch(e){const t=await be();t&&t.length>0?(n(this,h).renderStories(t),n(this,h).showOfflineMessage()):n(this,h).showError(e.message||"Gagal memuat cerita")}finally{m(this,_,!1),n(this,h).hideLoading()}}},Ee=async function(){if(!(n(this,_)||!n(this,b))){m(this,_,!0),m(this,I,n(this,I)+1);try{n(this,h).showLoadingMore();const e=localStorage.getItem("accessToken");if(!e){n(this,h).showLoginRequired();return}const t=await C.getAllStories({token:e,page:n(this,I),location:n(this,O)?1:0});if(t.error){n(this,h).showError(t.message||"Gagal memuat cerita tambahan");return}if(!t||typeof t!="object"){n(this,h).showError("Format respons server tidak valid");return}const a=t.listStory||[],i=t.size||10;if(!Array.isArray(a)){n(this,h).showError("Format data cerita tidak valid");return}a.length>0?(await X(a),n(this,h).appendStories(a),m(this,b,a.length===i)):m(this,b,!1),n(this,h).updateLoadMoreButton(n(this,b))}catch{n(this,h).showOfflineMessage()}finally{m(this,_,!1),n(this,h).hideLoadingMore()}}};class ue{constructor(){this._presenter=new nt({view:this}),this._debouncedScroll=Me(this._handleScroll.bind(this),200)}renderPage(){this._setupInfiniteScroll(),this._setupOfflineListener()}async render(){return`
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="container">
          <h1 class="page-title">
            <i class="fas fa-book-open" aria-hidden="true"></i>
            Latest Stories
          </h1>
          <div class="filter-container mb-2">
            <label for="include-location" class="filter-label">
              <input type="checkbox" id="include-location" name="include-location">
              <span class="ml-1">Show stories with location only</span>
            </label>
          </div>
          <div id="stories-list" class="stories-list"></div>
          <div id="loading-more" class="hidden">
            <div class="spinner" style="width: 30px; height: 30px; margin: 0 auto;"></div>
          </div>
          <button id="load-more" class="load-more" aria-label="Load more stories">
            <i class="fas fa-arrow-down" aria-hidden="true"></i>
            Load More
          </button>
          <div id="empty-state" class="empty-state hidden">
            <i class="fas fa-inbox fa-3x"></i>
            <p>No stories found. Be the first to share your experience!</p>
          </div>
        </section>
      </main>
      <app-footer></app-footer>
      <app-loader></app-loader>
    `}async afterRender(){this._presenter.init(),this._setupAccessibility()}setLoadMoreCallback(e){const t=document.getElementById("load-more");t&&t.addEventListener("click",e)}setLocationFilterCallback(e){const t=document.getElementById("include-location");t&&t.addEventListener("change",a=>{e(a.target.checked)})}_setupInfiniteScroll(){window.addEventListener("scroll",this._debouncedScroll)}_handleScroll(){const e=document.getElementById("load-more");if(!e||e.style.display==="none"||e.disabled)return;const t=window.scrollY,a=document.documentElement.clientHeight,i=document.documentElement.scrollHeight;a+t>=i-100&&e.click()}_setupOfflineListener(){window.addEventListener("online",()=>{this._presenter.init()})}_setupAccessibility(){const e=document.getElementById("main-content");e&&setTimeout(()=>e.focus(),200);const t=document.querySelector(".skip-link");t&&t.addEventListener("click",function(a){a.preventDefault(),e&&(t.blur(),e.focus(),e.scrollIntoView({behavior:"smooth"}))})}showLoading(){var e;(e=document.querySelector("app-loader"))==null||e.show("Loading stories...")}hideLoading(){var e;(e=document.querySelector("app-loader"))==null||e.hide()}showLoadingMore(){var e;(e=document.getElementById("loading-more"))==null||e.classList.remove("hidden")}hideLoadingMore(){var e;(e=document.getElementById("loading-more"))==null||e.classList.add("hidden")}clearStories(){var t;const e=document.getElementById("stories-list");e&&(e.innerHTML=""),(t=document.getElementById("empty-state"))==null||t.classList.add("hidden")}renderStories(e){const t=document.getElementById("stories-list");if(!t)return;if(!e||!Array.isArray(e)){console.error("Invalid stories data:",e);return}e.filter(i=>i&&typeof i=="object").forEach((i,o)=>{try{const r=document.createElement("app-card");r.story=i,t.appendChild(r),window.matchMedia("(prefers-reduced-motion: no-preference)").matches&&r.animate([{opacity:0,transform:"translateY(20px)"},{opacity:1,transform:"translateY(0)"}],{duration:300,easing:"ease-out",delay:o*50})}catch(r){console.error("Error rendering story card:",r,{story:i})}})}appendStories(e){const t=document.getElementById("stories-list");if(!t)return;if(!e||!Array.isArray(e)){console.error("Invalid stories data:",e);return}const a=e.filter(i=>i&&typeof i=="object");if(a.length===0){console.warn("No valid stories to append");return}a.forEach((i,o)=>{try{const r=document.createElement("app-card");r.story=i,t.appendChild(r),window.matchMedia("(prefers-reduced-motion: no-preference)").matches&&r.animate([{opacity:0,transform:"translateY(20px)"},{opacity:1,transform:"translateY(0)"}],{duration:300,easing:"ease-out",delay:o*50})}catch(r){console.error("Error appending story card:",r,{story:i})}})}updateLoadMoreButton(e){const t=document.getElementById("load-more");t&&(e?(t.style.display="flex",t.disabled=!1):(t.style.display="none",t.disabled=!0))}showEmptyState(){var t;(t=document.getElementById("empty-state"))==null||t.classList.remove("hidden");const e=document.getElementById("load-more");e&&(e.style.display="none")}showLoginRequired(){Swal.fire({icon:"warning",title:"Login Required",text:"You need to login to view stories",confirmButtonText:"Login Now",confirmButtonColor:"#4361ee"}).then(e=>{e.isConfirmed&&(window.location.hash="#/login")})}showOfflineMessage(){window.showToast&&window.showToast("Anda sedang offline. Menampilkan data tersimpan.","info")}showError(e){Swal.fire({icon:"error",title:"Error",text:e||"Failed to load stories",confirmButtonColor:"#4361ee"})}}class ct{async render(){return document.title="About - Dicoding Story",`
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="container">
          <h1 class="page-title">
            <i class="fas fa-info-circle"></i>
            About the App
          </h1>
          <div class="about-content">
            <div class="about-card" id="about-app">
              <h2><i class="fas fa-book-open"></i> Dicoding Story</h2>
              <p>
                <strong>Dicoding Story</strong> is a platform for sharing programming and technology 
                learning experiences. This app was created as a submission project 
                for Dicoding's <em>Menjadi Front-End Web Developer Expert</em> class.
              </p>
              <p class="mt-2">
                The application allows users to share their learning journey with others,
                add location to their stories, and explore stories from other learners.
              </p>
            </div>
            <div class="about-card" id="about-features">
              <h2><i class="fas fa-feather-alt"></i> Features</h2>
              <ul class="feature-list">
                <li><i class="fas fa-check-circle"></i> Share stories with images</li>
                <li><i class="fas fa-check-circle"></i> Add location to stories with interactive maps</li>
                <li><i class="fas fa-check-circle"></i> View stories from other users</li>
                <li><i class="fas fa-check-circle"></i> Responsive design for all devices</li>
                <li><i class="fas fa-check-circle"></i> Offline capability with cached data</li>
                <li><i class="fas fa-check-circle"></i> Push notifications for new features</li>
                <li><i class="fas fa-check-circle"></i> PWA: Installable & works offline</li>
                <li><i class="fas fa-check-circle"></i> Accessibility & dark mode support</li>
                <li><i class="fas fa-check-circle"></i> Modern UI/UX with animations</li>
                <li><i class="fas fa-check-circle"></i> Favorite & save stories for offline</li>
              </ul>
            </div>
            <div class="about-card" id="about-tech">
              <h2><i class="fas fa-code"></i> Technology Stack</h2>
              <div class="tech-stack">
                <div class="tech-item"><i class="fab fa-html5"></i><span>HTML5</span></div>
                <div class="tech-item"><i class="fab fa-css3-alt"></i><span>CSS3</span></div>
                <div class="tech-item"><i class="fab fa-js"></i><span>JavaScript</span></div>
                <div class="tech-item"><i class="fas fa-map-marked-alt"></i><span>Leaflet.js</span></div>
                <div class="tech-item"><i class="fas fa-mobile-alt"></i><span>PWA</span></div>
                <div class="tech-item"><i class="fas fa-server"></i><span>REST API</span></div>
                <div class="tech-item"><i class="fas fa-database"></i><span>IndexedDB</span></div>
                <div class="tech-item"><i class="fas fa-bolt"></i><span>Service Worker</span></div>
                <div class="tech-item"><i class="fas fa-bell"></i><span>Push Notification</span></div>
                <div class="tech-item"><i class="fas fa-paint-brush"></i><span>Animate.css</span></div>
                <div class="tech-item"><i class="fas fa-universal-access"></i><span>A11y</span></div>
              </div>
            </div>
            <div class="about-card" id="about-developer">
              <h2><i class="fas fa-user-tie"></i> About Developer</h2>
              <p>
                This application was developed by <strong>Naufal Arsyaputra Pradana</strong> 
                as part of the submission for Dicoding's Front-End Web Developer Expert class.
              </p>
              <div class="tech-stack mt-2">
                <div class="tech-item">
                  <a href="https://github.com/NaufalArsyaputraPradana/" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-github"></i>
                    <span>GitHub</span>
                  </a>
                </div>
                <div class="tech-item">
                  <a href="https://www.linkedin.com/in/naufalarsyaputrapradana/" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-linkedin"></i>
                    <span>LinkedIn</span>
                  </a>
                </div>
                <div class="tech-item">
                  <a href="https://www.instagram.com/arsya.pradana_/" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-instagram"></i>
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
              <div class="mt-2">
                <a href="mailto:support@dicodingstory.app" class="btn btn-secondary" aria-label="Contact Support">
                  <i class="fas fa-envelope"></i> Contact Support
                </a>
                <a href="https://github.com/naufalarsyaputrapradana/Dicoding-Story-App/issues" target="_blank" rel="noopener noreferrer" class="btn btn-primary ml-2" aria-label="Feedback & Issues">
                  <i class="fas fa-comment-dots"></i> Feedback & Issues
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <app-footer></app-footer>
    `}async afterRender(){window.matchMedia("(prefers-reduced-motion: no-preference)").matches&&[document.getElementById("about-app"),document.getElementById("about-features"),document.getElementById("about-tech"),document.getElementById("about-developer")].forEach((a,i)=>{a&&(a.style.opacity="0",a.style.transform="translateY(20px)",a.style.transition="opacity 0.3s, transform 0.3s",setTimeout(()=>{a.style.opacity="1",a.style.transform="translateY(0)"},i*100+300))});const e=document.getElementById("main-content");e&&setTimeout(()=>e.focus(),200)}}class lt{async render(){return`
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="auth-container">
          <h1 class="auth-title">
            <i class="fas fa-sign-in-alt"></i>
            Login
          </h1>
          <form id="login-form" class="auth-form" novalidate autocomplete="on">
            <div class="auth-form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                placeholder="Enter your email"
                aria-describedby="email-help"
                autocomplete="username"
              >
              <small id="email-help" class="text-muted">Enter a valid email address</small>
              <div class="error-message" id="email-error"></div>
            </div>
            <div class="auth-form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                minlength="8"
                placeholder="Enter your password"
                aria-describedby="password-help"
                autocomplete="current-password"
              >
              <small id="password-help" class="text-muted">Minimum 8 characters</small>
              <div class="error-message" id="password-error"></div>
            </div>
            <button type="submit" class="auth-submit-button">
              <i class="fas fa-sign-in-alt"></i>
              Login
            </button>
            <div class="flex items-center mt-2">
              <input type="checkbox" id="remember-me" name="remember-me">
              <label for="remember-me" class="ml-2">Remember me</label>
            </div>
          </form>
          <div class="auth-link">
            Don't have an account? <a href="#/register">Register here</a>
          </div>
          ${q()?"":`
            <div class="offline-notice mt-2">
              <i class="fas fa-wifi-slash"></i> You are currently offline. 
              Login is not available without internet connection.
            </div>
          `}
        </section>
      </main>
      <app-footer></app-footer>
      <app-loader></app-loader>
    `}async afterRender(){this._setupForm(),this._setupInputValidation(),this._checkRememberedUser(),this._focusFirstInput()}_setupForm(){const e=document.querySelector("#login-form");e&&e.addEventListener("submit",async t=>{if(t.preventDefault(),!this._validateForm())return;if(!q()){Swal.fire({icon:"error",title:"Offline Mode",text:"Login is not available without internet connection.",confirmButtonColor:"#4361ee"});return}const a=e.querySelector("#email").value.trim(),i=e.querySelector("#password").value.trim(),o=e.querySelector("#remember-me").checked,r=document.querySelector("app-loader");r&&r.show("Authenticating...");try{const c=await C.login({email:a,password:i});localStorage.setItem("accessToken",c.loginResult.token),localStorage.setItem("user",JSON.stringify(c.loginResult.user)),window.dispatchEvent(new CustomEvent("user-login-state-changed",{detail:{isLoggedIn:!0,userData:c.loginResult.user}})),o?localStorage.setItem("rememberedEmail",a):localStorage.removeItem("rememberedEmail"),await Swal.fire({icon:"success",title:"Login successful!",showConfirmButton:!1,timer:1500}),window.location.hash="#/"}catch(c){console.error("Login failed:",c),Swal.fire({icon:"error",title:"Login failed",text:c.message||"Invalid email or password",confirmButtonColor:"#4361ee"})}finally{r&&r.hide()}})}_setupInputValidation(){const e=document.querySelector("#email"),t=document.querySelector("#password");e&&e.addEventListener("input",()=>{this._validateEmail()}),t&&t.addEventListener("input",()=>{this._validatePassword()})}_validateForm(){const e=this._validateEmail(),t=this._validatePassword();return e&&t}_validateEmail(){const e=document.querySelector("#email"),t=document.querySelector("#email-error");if(!e||!t)return!1;const a=e.value.trim();return a?ge(a)?(t.textContent="",!0):(t.textContent="Please enter a valid email address",!1):(t.textContent="Email is required",!1)}_validatePassword(){const e=document.querySelector("#password"),t=document.querySelector("#password-error");if(!e||!t)return!1;const a=e.value.trim();return a?a.length<8?(t.textContent="Password must be at least 8 characters",!1):(t.textContent="",!0):(t.textContent="Password is required",!1)}_checkRememberedUser(){const e=localStorage.getItem("rememberedEmail"),t=document.querySelector("#email"),a=document.querySelector("#remember-me");e&&t&&(t.value=e,a&&(a.checked=!0),document.querySelector("#password").focus())}_focusFirstInput(){const e=document.querySelector("#email");e&&setTimeout(()=>e.focus(),200)}}class dt{async render(){return`
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="auth-container">
          <h1 class="auth-title">
            <i class="fas fa-user-plus"></i>
            Register
          </h1>
          <form id="register-form" class="auth-form" novalidate autocomplete="on">
            <div class="auth-form-group">
              <label for="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required
                minlength="3"
                placeholder="Enter your full name"
                aria-describedby="name-help"
                autocomplete="name"
              >
              <small id="name-help" class="text-muted">Minimum 3 characters</small>
              <div class="error-message" id="name-error"></div>
            </div>
            <div class="auth-form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                placeholder="Enter your email"
                aria-describedby="email-help"
                autocomplete="username"
              >
              <small id="email-help" class="text-muted">Enter a valid email address</small>
              <div class="error-message" id="email-error"></div>
            </div>
            <div class="auth-form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                minlength="8"
                placeholder="Enter password (min 8 characters)"
                aria-describedby="password-help"
                autocomplete="new-password"
              >
              <small id="password-help" class="text-muted">Minimum 8 characters</small>
              <div class="error-message" id="password-error"></div>
            </div>
            <button type="submit" class="auth-submit-button">
              <i class="fas fa-user-plus"></i>
              Register
            </button>
          </form>
          <div class="auth-link">
            Already have an account? <a href="#/login">Login here</a>
          </div>
          ${q()?"":`
            <div class="offline-notice mt-2">
              <i class="fas fa-wifi-slash"></i> You are currently offline. 
              Registration is not available without internet connection.
            </div>
          `}
        </section>
      </main>
      <app-footer></app-footer>
      <app-loader></app-loader>
    `}async afterRender(){this._setupForm(),this._setupInputValidation(),this._focusFirstInput()}_setupForm(){const e=document.querySelector("#register-form");e&&e.addEventListener("submit",async t=>{if(t.preventDefault(),!this._validateForm())return;if(!q()){Swal.fire({icon:"error",title:"Offline Mode",text:"Registration is not available without internet connection.",confirmButtonColor:"#4361ee"});return}const a=e.querySelector("#name").value.trim(),i=e.querySelector("#email").value.trim(),o=e.querySelector("#password").value.trim(),r=document.querySelector("app-loader");r&&r.show("Creating account...");try{await C.register({name:a,email:i,password:o}),await Swal.fire({icon:"success",title:"Registration successful!",text:"Please login with your new account",confirmButtonColor:"#4361ee"}),window.location.hash="#/login",e.reset()}catch(c){Swal.fire({icon:"error",title:"Registration failed",text:c.message||"Email may already be registered",confirmButtonColor:"#4361ee"})}finally{r&&r.hide()}})}_setupInputValidation(){const e=document.querySelector("#name"),t=document.querySelector("#email"),a=document.querySelector("#password");e&&e.addEventListener("input",()=>{this._validateName()}),t&&t.addEventListener("input",()=>{this._validateEmail()}),a&&a.addEventListener("input",()=>{this._validatePassword()})}_validateForm(){const e=this._validateName(),t=this._validateEmail(),a=this._validatePassword();return e&&t&&a}_validateName(){const e=document.querySelector("#name"),t=document.querySelector("#name-error");if(!e||!t)return!1;const a=e.value.trim();return a?a.length<3?(t.textContent="Name must be at least 3 characters",!1):(t.textContent="",!0):(t.textContent="Name is required",!1)}_validateEmail(){const e=document.querySelector("#email"),t=document.querySelector("#email-error");if(!e||!t)return!1;const a=e.value.trim();return a?ge(a)?(t.textContent="",!0):(t.textContent="Please enter a valid email address",!1):(t.textContent="Email is required",!1)}_validatePassword(){const e=document.querySelector("#password"),t=document.querySelector("#password-error");if(!e||!t)return!1;const a=e.value.trim();return a?a.length<8?(t.textContent="Password must be at least 8 characters",!1):(t.textContent="",!0):(t.textContent="Password is required",!1)}_focusFirstInput(){const e=document.querySelector("#name");e&&setTimeout(()=>e.focus(),200)}}class ut{constructor({view:e,id:t}){this._view=e,this._id=t,this._map=null,this._story=null,this._mapInitialized=!1}async init(){this._view.renderPage(),await this._loadStoryDetail(),this._setupOnlineListener(),this._setupActions()}async _loadStoryDetail(){try{this._view.showLoading();const e=localStorage.getItem("accessToken");if(!e){this._view.showLoginRequired();return}const t=this._getCachedStory();try{const a=await C.getStoryDetail({token:e,id:this._id});if(a.error)throw new Error(a.message||"Gagal memuat cerita");this._story=a.story,this._cacheStory(a.story),this._view.renderStoryDetail(a.story),this._view.hideOfflineMessage(),this._story.lat&&this._story.lon&&this._initMapWithDelay(300)}catch(a){t?(this._story=t,this._view.renderStoryDetail(t),this._view.showOfflineMessage(),t.lat&&t.lon&&!this._mapInitialized&&this._initMapWithDelay(300)):this._view.showError(a.message)}}catch{const t=this._getCachedStory();t?(this._story=t,this._view.renderStoryDetail(t),this._view.showOfflineMessage(),t.lat&&t.lon&&!this._mapInitialized&&this._initMapWithDelay(300)):this._view.showError("Terjadi kesalahan. Silakan coba lagi.")}finally{this._view.hideLoading()}}_setupOnlineListener(){window.addEventListener("online",()=>{this._story?this._view.hideOfflineMessage():this._loadStoryDetail()}),window.addEventListener("offline",()=>{this._story&&this._view.showOfflineMessage()})}_initMapWithDelay(e=100){if(!window.L){console.error("Leaflet library not available");return}setTimeout(()=>{this._initMap()},e)}_initMap(){if(this._mapInitialized||!this._story)return;const e=parseFloat(this._story.lat),t=parseFloat(this._story.lon);if(isNaN(e)||isNaN(t))return;const a=this._view.getMapContainer();if(a)try{this._map=L.map(a).setView([e,t],13);const i=this._createBaseMaps();i.Street.addTo(this._map),L.control.layers(i,{},{position:"topright"}).addTo(this._map),this._addStoryMarker(),this._addLocateControl(),this._updateMapSize(),this._mapInitialized=!0}catch{this._view.showMapError()}}_createBaseMaps(){const e={};return e.Street=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}),e.Satellite=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",maxZoom:19}),e.Dark=L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',maxZoom:19}),e.Topographic=L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',maxZoom:17}),e}_addStoryMarker(){if(!this._map||!this._story)return;const e=parseFloat(this._story.lat),t=parseFloat(this._story.lon);if(isNaN(e)||isNaN(t))return;const a=this._story.name||"Untitled Story",i=this._story.description||"",o=`
      <div class="custom-popup">
        <h3>${a}</h3>
        <p>${i.substring(0,100)}${i.length>100?"...":""}</p>
      </div>
    `;L.marker([e,t]).addTo(this._map).bindPopup(o).openPopup()}_addLocateControl(){this._map&&L.control.locate({position:"topright",strings:{title:"Show my location"},locateOptions:{enableHighAccuracy:!0}}).addTo(this._map)}_updateMapSize(){this._map&&(setTimeout(()=>{this._map.invalidateSize()},300),window.addEventListener("resize",()=>{this._map&&this._map.invalidateSize()}))}_cacheStory(e){try{const t={...e,cachedAt:new Date().toISOString()};localStorage.setItem(`story_${e.id}`,JSON.stringify(t));const a=JSON.parse(localStorage.getItem("cachedStories")||"[]"),i=a.map(r=>r.id===e.id?t:r);a.some(r=>r.id===e.id)||i.push(t);const o=i.slice(0,50);localStorage.setItem("cachedStories",JSON.stringify(o))}catch{}}_getCachedStory(){try{const e=localStorage.getItem(`story_${this._id}`);if(e)try{const a=JSON.parse(e);return!a||typeof a!="object"?null:(a.name=a.name||"Unknown User",a.description=a.description||"",a.photoUrl=a.photoUrl||"./images/placeholder.jpg",a.createdAt=a.createdAt||new Date().toISOString(),a)}catch{return localStorage.removeItem(`story_${this._id}`),null}const t=localStorage.getItem("cachedStories");if(!t)return null;try{const a=JSON.parse(t);if(!Array.isArray(a))return null;const i=a.find(o=>o&&o.id===this._id);return i?(i.name=i.name||"Unknown User",i.description=i.description||"",i.photoUrl=i.photoUrl||"./images/placeholder.jpg",i.createdAt=i.createdAt||new Date().toISOString(),i):null}catch{return null}}catch{return null}}_setupActions(){navigator.share&&(this._view.showShareButton(),this._view.setShareButtonCallback(()=>this._shareStory())),this._view.setFavoriteButtonCallback(e=>{this._toggleFavorite(e)})}async _shareStory(){if(this._story)try{const e={title:`Cerita dari ${this._story.name}`,text:this._story.description,url:window.location.href};await navigator.share(e),window.showToast&&window.showToast("Cerita berhasil dibagikan!","success")}catch(e){e.name!=="AbortError"&&window.showToast&&window.showToast("Gagal membagikan cerita","error")}}_toggleFavorite(e){if(this._story)try{const t=localStorage.getItem("favoriteStories");let a=t?JSON.parse(t):[];e?a.includes(this._story.id)||(a.push(this._story.id),window.showToast&&window.showToast("Ditambahkan ke favorit!","success")):(a=a.filter(i=>i!==this._story.id),window.showToast&&window.showToast("Dihapus dari favorit","info")),localStorage.setItem("favoriteStories",JSON.stringify(a))}catch{}}async saveCurrentStoryToOffline(){this._story&&window.showToast&&window.showToast("Cerita disimpan untuk offline","success")}}class ht{constructor(){const{id:e}=this._getUrlParams();this._id=e,this._presenter=new ut({view:this,id:this._id}),this._mapContainer=null,this._favoriteCallback=null,this._story=null}renderPage(){if(!this._id){this.showInvalidIdError();return}}async render(){return`
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="container">
          <div id="story-content">
            <div class="loading-placeholder">
              <div class="ph-item">
                <div class="ph-col-12">
                  <div class="ph-picture"></div>
                  <div class="ph-row">
                    <div class="ph-col-4"></div>
                    <div class="ph-col-8 empty"></div>
                    <div class="ph-col-6"></div>
                    <div class="ph-col-6 empty"></div>
                    <div class="ph-col-12"></div>
                    <div class="ph-col-12"></div>
                    <div class="ph-col-12"></div>
                    <div class="ph-col-8"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="offline-notice" class="offline-notice mt-2 hidden">
            <i class="fas fa-wifi-slash"></i> You are currently offline. Some features may be limited.
          </div>
        </section>
      </main>
      <app-footer></app-footer>
      <app-loader></app-loader>
    `}async afterRender(){this._presenter.init();const e=document.getElementById("save-story-button");e&&this._story&&e.addEventListener("click",async()=>{await B.addToFavorites(this._story),window.showToast&&window.showToast("Cerita disimpan ke halaman Favorit!","success")})}renderStoryDetail(e){this._story=e;const t=document.querySelector("#story-content");if(!e||!t)return;const a=e.name||"Unknown User",i=e.description||"No description provided",o=e.photoUrl||"./images/placeholder.jpg",r=e.createdAt||new Date().toISOString(),c=fe(r,"id-ID",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}),d=this._getUserColor(a),u=`story-title-${e.id}`,f=`story-desc-${e.id}`,g=this._isInFavorites(e.id);t.innerHTML=`
      <article class="story-detail-item" id="story-article" aria-labelledby="${u}">
        <div class="story-image-wrapper">
          <img 
            class="story-detail-image" 
            src="${o}" 
            alt="Photo shared by ${a}" 
            loading="lazy"
            onerror="this.src='./images/placeholder.jpg'"
          >
          <div class="story-image-overlay">
            <div class="story-image-badge" style="background-color: ${d}">
              <i class="fas fa-camera-retro" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div class="story-detail-content">
          <div class="story-header">
            <div class="story-user">
              <div class="user-avatar" aria-hidden="true" style="background-color: ${d}">
                ${this._getInitials(a)}
              </div>
              <div>
                <h1 class="story-name" id="${u}">${a}</h1>
                <time class="story-date" datetime="${r}">
                  <i class="far fa-calendar-alt" aria-hidden="true"></i> ${c}
                </time>
              </div>
            </div>
            <div class="story-actions-top">
              <button id="favorite-button" class="icon-button ${g?"active":""}" aria-label="${g?"Remove from favorites":"Add to favorites"}">
                <i class="fas fa-heart" aria-hidden="true"></i>
              </button>
              <button id="share-button" class="icon-button hidden" aria-label="Share this story">
                <i class="fas fa-share-alt" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div class="story-body">
            <p class="story-description" id="${f}">${i}</p>
          </div>
          ${e.lat&&e.lon?`
                <div class="story-location">
                  <h2 class="section-title">
                    <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                    Location
                  </h2>
                  <div class="story-map-container">
                    <div class="story-map-large" id="detail-map" tabindex="0" aria-label="Map showing the location of ${a}'s story"></div>
                  </div>
                  <p class="map-instructions">
                    <i class="fas fa-info-circle" aria-hidden="true"></i>
                    You can switch between different map styles using the layer control in the top right.
                  </p>
                </div>
              `:""}
          <div class="story-actions mt-3">
            <a href="#/" class="back-link" aria-label="Back to stories list">
              <i class="fas fa-arrow-left" aria-hidden="true"></i>
              Back to Stories
            </a>
            <button id="save-story-button" class="btn btn-primary">
              <i class="fas fa-bookmark"></i> Simpan ke Favorit
            </button>
            <a href="#/stories/add" class="action-button" aria-label="Share your own story">
              <i class="fas fa-plus-circle"></i>
              Share Your Story
            </a>
          </div>
        </div>
      </article>
    `,e.lat&&e.lon&&(this._mapContainer=document.getElementById("detail-map")),this._setupFavoriteButton(g),navigator.share&&(this.showShareButton(),this.setShareButtonCallback(async()=>{try{await navigator.share({title:`Cerita dari ${a}`,text:i,url:window.location.href}),window.showToast&&window.showToast("Cerita berhasil dibagikan!","success")}catch(E){E.name!=="AbortError"&&window.showToast&&window.showToast("Gagal membagikan cerita","error")}}))}getMapContainer(){return this._mapContainer}showLoading(){var e;(e=document.querySelector("app-loader"))==null||e.show("Loading story...")}hideLoading(){var e;(e=document.querySelector("app-loader"))==null||e.hide()}showOfflineMessage(){var e;(e=document.getElementById("offline-notice"))==null||e.classList.remove("hidden")}hideOfflineMessage(){var e;(e=document.getElementById("offline-notice"))==null||e.classList.add("hidden")}showOfflineNoDataMessage(){Swal.fire({icon:"warning",title:"Offline",text:"This story is not available offline. Please connect to the internet and try again.",confirmButtonColor:"#4361ee"}).then(()=>{window.location.hash="#/"})}showLoginRequired(){Swal.fire({icon:"warning",title:"Login Required",text:"Please login to view story details",confirmButtonText:"Login Now",confirmButtonColor:"#4361ee"}).then(()=>{window.location.hash="#/login"})}showInvalidIdError(){Swal.fire({icon:"error",title:"Invalid Story ID",text:"The story ID is missing or invalid",confirmButtonColor:"#4361ee"}).then(()=>{window.location.hash="#/"})}showError(e){Swal.fire({icon:"error",title:"Error",text:e||"Failed to load story",confirmButtonColor:"#4361ee"}).then(()=>{window.location.hash="#/"})}showTimeoutError(){const e=document.getElementById("offline-notice");e&&(e.innerHTML=`
        <i class="fas fa-exclamation-triangle"></i> 
        Server response is slow. Showing cached data if available.
      `,e.classList.remove("hidden"),e.style.backgroundColor="#f8961e"),Swal.fire({icon:"warning",title:"Connection Issue",text:"The server is taking too long to respond. We'll try to show cached data if available.",confirmButtonColor:"#4361ee",showCancelButton:!0,cancelButtonText:"Back to Home",confirmButtonText:"Continue with Cache"}).then(t=>{t.isConfirmed||(window.location.hash="#/")})}showMapError(){const e=document.querySelector(".story-map-container");e&&(e.innerHTML=`
        <div class="map-error-container">
          <div class="map-error-message">
            <i class="fas fa-map-marked-alt"></i>
            <p>Failed to load map. Please try refreshing the page.</p>
          </div>
        </div>
      `)}_getUrlParams(){const t=window.location.hash.match(/#\/stories\/([^/]+)$/);return{id:t?t[1]:null}}_getInitials(e){return!e||typeof e!="string"?"U":e.split(" ").map(t=>t.charAt(0)).join("").toUpperCase().substring(0,2)}_getUserColor(e){const t=["#4361ee","#3f37c9","#4895ef","#4cc9f0","#f72585","#7209b7","#3a0ca3","#f8961e","#fb5607","#80b918"],a=e.split("").reduce((i,o)=>o.charCodeAt(0)+((i<<5)-i),0);return t[Math.abs(a)%t.length]}_isInFavorites(e){try{const t=localStorage.getItem("favoriteStories");if(!t)return!1;const a=JSON.parse(t);return Array.isArray(a)&&a.includes(e)}catch(t){return console.error("Error checking favorites:",t),!1}}_setupFavoriteButton(e){const t=document.getElementById("favorite-button");t&&t.addEventListener("click",()=>{const i=!t.classList.contains("active");i?(t.classList.add("active"),t.setAttribute("aria-label","Remove from favorites")):(t.classList.remove("active"),t.setAttribute("aria-label","Add to favorites")),this._favoriteCallback&&this._favoriteCallback(i);try{const o=localStorage.getItem("favoriteStories");let r=o?JSON.parse(o):[];i?r.includes(this._story.id)||(r.push(this._story.id),window.showToast&&window.showToast("Ditambahkan ke favorit!","success")):(r=r.filter(c=>c!==this._story.id),window.showToast&&window.showToast("Dihapus dari favorit","info")),localStorage.setItem("favoriteStories",JSON.stringify(r))}catch(o){console.error("Error updating favorites:",o)}})}setFavoriteButtonCallback(e){this._favoriteCallback=e}showShareButton(){var e;(e=document.getElementById("share-button"))==null||e.classList.remove("hidden")}setShareButtonCallback(e){const t=document.getElementById("share-button");t&&t.addEventListener("click",e)}animateRemoval(e){const t=document.getElementById("story-article");if(!t){e&&e();return}t.style.transition="all 0.5s ease-out",t.style.opacity="0",t.style.transform="scale(0.9)",setTimeout(()=>{e&&e()},500)}cancelRemovalAnimation(){const e=document.getElementById("story-article");e&&(e.style.opacity="1",e.style.transform="scale(1)")}}var l;class mt{constructor({view:e}){y(this,l);N(this,"_photoFile",null);N(this,"_map",null);N(this,"_marker",null);N(this,"_cameraStream",null);N(this,"_mapInitialized",!1);m(this,l,e),window.addEventListener("hashchange",()=>this.stopCamera()),window.addEventListener("beforeunload",()=>this.stopCamera())}init(){this._setupForm(),this._setupPhotoPreview(),this._setupCamera(),this._setupLocationCheckbox(),this._setupInputValidation(),this._setupAutoSaveDraft(),this._checkMediaPermissions()}loadRecentDrafts(){try{const e=localStorage.getItem("recentDrafts");if(!e){n(this,l).displayRecentDrafts([]);return}const t=JSON.parse(e);n(this,l).displayRecentDrafts(t)}catch(e){console.error("Error loading recent drafts:",e),n(this,l).displayRecentDrafts([])}}useDraft(e){try{const t=localStorage.getItem("recentDrafts");if(!t)return;const i=JSON.parse(t).find(o=>o.id===e);if(i){let o=i.fullDescription||i.description;n(this,l).applyDraftToForm(o)}}catch(t){console.error("Error using draft:",t)}}_setupAutoSaveDraft(){let e;const t=document.getElementById("description");t&&t.addEventListener("input",()=>{clearTimeout(e),e=setTimeout(()=>{this._saveDraft(t.value)},3e4)})}_saveDraft(e){if(!(!e||e.trim().length<5))try{const t=localStorage.getItem("recentDrafts");let a=t?JSON.parse(t):[];const i=e.substring(0,50)+(e.length>50?"...":""),o={id:Date.now().toString(),description:i,fullDescription:e,timestamp:new Date().toISOString()};a.unshift(o),a=a.slice(0,5),localStorage.setItem("recentDrafts",JSON.stringify(a)),window.showToast&&window.showToast("Draft saved automatically","info")}catch(t){console.error("Error saving draft:",t)}}_checkMediaPermissions(){navigator.permissions&&navigator.permissions.query&&navigator.permissions.query({name:"camera"}).then(e=>{const t=document.getElementById("camera-button");e.state==="denied"&&t&&(t.classList.add("permission-denied"),t.title="Camera permission denied. Please update your browser settings."),e.onchange=()=>{t&&(e.state==="denied"?(t.classList.add("permission-denied"),t.title="Camera permission denied. Please update your browser settings."):(t.classList.remove("permission-denied"),t.title=""))}}).catch(e=>{console.log("Error checking camera permission:",e)})}stopCamera(){if(this._cameraStream){try{this._cameraStream.getTracks().forEach(e=>e.stop())}catch(e){console.error("Error stopping camera tracks:",e)}this._cameraStream=null,n(this,l)&&n(this,l).resetCameraUI()}}_setupCamera(){n(this,l).setOpenCameraCallback(async()=>{try{if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error("Your browser does not support camera access");this.stopCamera();const e=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:1280},height:{ideal:720}},audio:!1});this._cameraStream=e,n(this,l).showCameraStream(e),window.addEventListener("beforeunload",()=>this.stopCamera(),{once:!0})}catch(e){if(e.name==="NotAllowedError")n(this,l).showCameraError("Camera access denied. Please allow camera access in your browser settings.");else if(e.name==="NotFoundError")n(this,l).showCameraError("No camera found on your device or camera is in use by another application.");else if(e.name==="NotReadableError")n(this,l).showCameraError("Could not access camera. Your camera might be in use by another application.");else if(e.name==="OverconstrainedError")try{const t=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1});this._cameraStream=t,n(this,l).showCameraStream(t)}catch{n(this,l).showCameraError("Could not access camera with requested settings. Please try a different device.")}else n(this,l).showCameraError("Could not access camera: "+(e.message||"Unknown error"))}}),n(this,l).setTakePhotoCallback(()=>{if(!this._cameraStream){n(this,l).showCameraError("Camera is not ready. Please try again.");return}try{const e=n(this,l).capturePhoto();if(!e){n(this,l).showCameraError("Failed to capture photo");return}n(this,l).showCameraFlash();const t="camera-photo-"+new Date().getTime()+".jpg",a=this._dataURLToFile(e,t);if(!a){n(this,l).showCameraError("Failed to process captured photo");return}if(a.size>p.MAX_PHOTO_SIZE){n(this,l).showPhotoError(`File too large. Maximum size is ${H(p.MAX_PHOTO_SIZE)}`);return}this._photoFile=a,n(this,l).showPhotoPreview(a),window.showToast&&window.showToast("Photo captured successfully!","success"),setTimeout(()=>this.stopCamera(),500)}catch(e){n(this,l).showCameraError("Error capturing photo: "+e.message)}}),n(this,l).setCloseCameraCallback(()=>this.stopCamera())}_dataURLToFile(e,t){try{if(!e||typeof e!="string"||!e.startsWith("data:image/"))return null;const a=e.split(",");if(a.length!==2)return null;const i=a[0].match(/:(.*?);/);if(!i||i.length<2)return null;const o=i[1],r=atob(a[1]);let c=r.length;const d=new Uint8Array(c);for(;c--;)d[c]=r.charCodeAt(c);return new File([d],t,{type:o})}catch(a){return console.error("Error converting data URL to file:",a),null}}_setupPhotoPreview(){n(this,l).setPhotoInputCallback(e=>{if(e){if(e.size>p.MAX_PHOTO_SIZE){n(this,l).showPhotoError(`File too large. Maximum size is ${H(p.MAX_PHOTO_SIZE)}`);return}if(!["image/jpeg","image/png","image/jpg"].includes(e.type)){n(this,l).showPhotoError("Only JPEG and PNG images are allowed");return}this._photoFile=e,n(this,l).clearPhotoError(),n(this,l).showPhotoPreview(e)}})}_setupForm(){n(this,l).setSubmitCallback(async e=>{const t=localStorage.getItem("accessToken");if(!t){await n(this,l).showLoginRequiredAlert(),window.location.hash="#/login";return}if(!this._validateForm()){n(this,l).showFormValidationError();return}if(!e.has("description")||!e.get("description").trim()){n(this,l).showDescriptionError("Description is required"),n(this,l).showFormValidationError();return}if(!e.has("photo")||!e.get("photo"))if(this._photoFile)e.set("photo",this._photoFile);else{n(this,l).showPhotoError("Please select or take a photo"),n(this,l).showFormValidationError();return}n(this,l).showLoader("Saving your story..."),n(this,l).showProgressBar();try{await C.addNewStory({token:t,data:e,onProgress:a=>n(this,l).updateProgressBar(a)}),n(this,l).updateProgressBar(100),setTimeout(()=>n(this,l).hideProgressBar(),500),await n(this,l).showSuccessAlert(),n(this,l).showConfetti(),this._addToRecents(e.get("description")),setTimeout(()=>{window.location.hash="#/",n(this,l).resetForm(),this.stopCamera()},1e3)}catch(a){n(this,l).hideProgressBar(),n(this,l).showErrorAlert(a.message)}finally{n(this,l).hideLoader()}})}_setupInputValidation(){n(this,l).setDescriptionInputCallback(e=>this._validateDescription(e))}_validateDescription(e){return e?e.length<10?(n(this,l).showDescriptionError("Description must be at least 10 characters"),!1):["judi","poker","togel","seks","adult","xxx"].some(i=>e.toLowerCase().includes(i))?(n(this,l).showDescriptionError("Your story may contain inappropriate content. Please revise."),!1):(n(this,l).clearDescriptionError(),!0):(n(this,l).showDescriptionError("Please enter a description"),!1)}_validateForm(){const e=this._validateDescription(n(this,l).getDescription()),t=this._validatePhoto();return e&&t}_validatePhoto(){if(!this._photoFile){const e=document.getElementById("photo");if(e&&e.files.length>0)this._photoFile=e.files[0];else{const t=document.querySelector("#photo-preview img");if(!t||t.classList.contains("hidden"))return n(this,l).showPhotoError("Please select or take a photo"),!1}}return this._photoFile&&this._photoFile.size>p.MAX_PHOTO_SIZE?(n(this,l).showPhotoError(`File too large. Maximum size is ${H(p.MAX_PHOTO_SIZE)}`),!1):!0}_setupLocationCheckbox(){n(this,l).setLocationCheckboxCallback(e=>{e?(n(this,l).showMapContainer(),this._mapInitialized?this._map&&this._map.invalidateSize():setTimeout(()=>this._initMap(),300)):n(this,l).hideMapContainer()})}_initMap(){if(!window.L){n(this,l).showMapError("Map library not loaded. Please check your internet connection and reload the page.");return}try{if(!document.getElementById("map"))return;if(this._map=L.map("map",{zoomControl:!0,attributionControl:!0}).setView(p.DEFAULT_MAP_CENTER,p.DEFAULT_MAP_ZOOM),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(this._map),setTimeout(()=>this._map.invalidateSize(),100),this._mapInitialized=!0,window.L.Control&&window.L.Control.Geocoder){const t=L.Control.Geocoder.nominatim({geocodingQueryParams:{countrycodes:"id",limit:5}});L.Control.geocoder({defaultMarkGeocode:!1,geocoder:t,placeholder:"Search for places...",errorMessage:"Nothing found.",suggestMinLength:3,suggestTimeout:250,queryMinLength:1}).addTo(this._map).on("markgeocode",i=>{const{lat:o,lng:r}=i.geocode.center;this._updateLocation(o,r),this._map.setView([o,r],15)})}window.L.control&&window.L.control.locate&&L.control.locate({position:"topright",strings:{title:"Temukan lokasi saya"},locateOptions:{enableHighAccuracy:!0,maxZoom:15},flyTo:!0}).addTo(this._map),this._map.on("click",t=>this._updateLocation(t.latlng.lat,t.latlng.lng)),n(this,l).setLocateMeCallback(()=>{"geolocation"in navigator?(n(this,l).showLoader("Finding your location..."),navigator.geolocation.getCurrentPosition(t=>{n(this,l).hideLoader();const{latitude:a,longitude:i}=t.coords;this._updateLocation(a,i),this._map.setView([a,i],15),window.showToast&&window.showToast("Location found!","success")},t=>{n(this,l).hideLoader();let a="Could not get your location.";switch(t.code){case t.PERMISSION_DENIED:a="Location access denied. Please check your browser settings.";break;case t.POSITION_UNAVAILABLE:a="Location information is unavailable.";break;case t.TIMEOUT:a="Location request timed out.";break}n(this,l).showMapError(a)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:0})):n(this,l).showMapError("Geolocation is not supported by your browser")}),n(this,l).setSearchLocationCallback(()=>{const t=document.querySelector(".leaflet-control-geocoder");if(t)try{const a=t.querySelector(".leaflet-control-geocoder-icon"),i=t.querySelector("input");a&&a.click(),i&&i.focus()}catch{this._showLocationSearchPrompt()}else this._showLocationSearchPrompt()})}catch(e){n(this,l).showMapError("Failed to initialize map: "+e.message)}}_showLocationSearchPrompt(){Swal.fire({title:"Search Location",input:"text",inputPlaceholder:"Enter a place or address",showCancelButton:!0,confirmButtonColor:"#4361ee",cancelButtonColor:"#6c757d",confirmButtonText:"Search",showLoaderOnConfirm:!0,preConfirm:e=>{if(!e){Swal.showValidationMessage("Please enter a location");return}return fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(e)}&limit=5`).then(t=>{if(!t.ok)throw new Error("Network response was not ok");return t.json()}).catch(t=>{Swal.showValidationMessage(`Search failed: ${t.message}`)})},allowOutsideClick:()=>!Swal.isLoading()}).then(e=>{if(e.isConfirmed&&e.value&&e.value.length>0){const t=e.value;if(t.length===1){const a=t[0],i=parseFloat(a.lat),o=parseFloat(a.lon);this._updateLocation(i,o),this._map&&this._map.setView([i,o],15)}else if(t.length>1){const a=t.map(i=>({text:i.display_name,value:i.place_id,lat:parseFloat(i.lat),lon:parseFloat(i.lon)}));Swal.fire({title:"Select Location",input:"radio",inputOptions:a.reduce((i,o)=>(i[o.value]=o.text,i),{}),showCancelButton:!0,confirmButtonColor:"#4361ee",confirmButtonText:"Select"}).then(i=>{if(i.isConfirmed){const o=a.find(r=>r.value.toString()===i.value);o&&(this._updateLocation(o.lat,o.lon),this._map&&this._map.setView([o.lat,o.lon],15))}})}else Swal.fire({icon:"info",title:"No Results",text:"No locations found for your search."})}})}_updateLocation(e,t){if(n(this,l).updateLocationCoordinates(e,t),this._marker?this._marker.setLatLng([e,t]):this._map&&(this._marker=L.marker([e,t],{draggable:!0,autoPan:!0}).addTo(this._map),this._marker.on("dragend",a=>{const o=a.target.getLatLng();this._updateLocation(o.lat,o.lng)})),this._map){this._map.setView([e,t],this._map.getZoom()||15);const a=document.getElementById("location-text");a&&(a.innerHTML=`
          <span class="loading-dots">Getting location name</span>
          <br>Coordinates: ${e.toFixed(6)}, ${t.toFixed(6)}
        `),this._reverseGeocode(e,t)}}_reverseGeocode(e,t){if(window.L&&window.L.Control&&window.L.Control.Geocoder)try{const a=L.Control.Geocoder.nominatim();if(a){a.reverse({lat:e,lng:t},this._map.getZoom(),i=>{if(i&&i.length>0){const o=i[0].name,r=document.getElementById("location-text");r&&o&&(r.innerHTML=`
                  <strong>${o}</strong>
                  <br>Coordinates: ${e.toFixed(6)}, ${t.toFixed(6)}
                `)}});return}}catch(a){console.warn("Leaflet reverse geocoding failed:",a)}try{fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e}&lon=${t}&zoom=18&addressdetails=1`).then(a=>a.json()).then(a=>{if(a&&a.display_name){const i=document.getElementById("location-text");i&&(i.innerHTML=`
                <strong>${a.display_name}</strong>
                <br>Coordinates: ${e.toFixed(6)}, ${t.toFixed(6)}
              `)}}).catch(a=>{const i=document.getElementById("location-text");i&&(i.textContent=`Coordinates: ${e.toFixed(6)}, ${t.toFixed(6)}`)})}catch{}}_addToRecents(e){try{const t=localStorage.getItem("recentDrafts");let a=t?JSON.parse(t):[];const i=e.substring(0,50)+(e.length>50?"...":"");a.unshift({description:i,timestamp:new Date().toISOString(),id:Date.now().toString()}),a=a.slice(0,5),localStorage.setItem("recentDrafts",JSON.stringify(a))}catch(t){console.error("Error saving to recents:",t)}}}l=new WeakMap;class pt{constructor(){this._presenter=new mt({view:this})}async render(){return`
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="container">
          <div class="add-story-container">
            <h1 class="page-title">Share Your Story</h1>
            <div class="recent-drafts-container hidden" id="recent-drafts"></div>
            <form id="add-story-form" class="story-form" autocomplete="on" novalidate>
              <div class="form-group">
                <label for="description" class="form-label">Story Description</label>
                <textarea
                  id="description"
                  class="form-control"
                  placeholder="Share your learning experience..."
                  rows="4"
                  required
                  maxlength="280"
                  aria-describedby="description-error"
                ></textarea>
                <small id="description-error" class="error-text"></small>
                <div class="character-counter">
                  <span id="char-count">0</span> / 280 characters
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Photo</label>
                <div class="photo-upload-container">
                  <div class="photo-preview-container">
                    <div class="photo-preview" id="photo-preview">
                      <i class="fas fa-image preview-placeholder"></i>
                      <img id="preview-image" class="hidden" alt="Preview of your photo">
                    </div>
                  </div>
                  <div class="photo-actions">
                    <div class="photo-upload">
                      <label for="photo" class="custom-file-upload">
                        <i class="fas fa-upload"></i> Select Photo
                      </label>
                      <input type="file" id="photo" name="photo" accept="image/jpeg, image/png" hidden>
                    </div>
                    <div class="or-divider">or</div>
                    <button type="button" id="camera-button" class="camera-button">
                      <i class="fas fa-camera"></i> Take Photo
                    </button>
                  </div>
                </div>
                <small id="photo-error" class="error-text"></small>
              </div>
              <div class="camera-container hidden" id="camera-container">
                <div class="camera-view-container">
                  <video id="camera-view" autoplay playsinline></video>
                  <canvas id="camera-canvas" class="hidden"></canvas>
                </div>
                <div class="camera-controls">
                  <button type="button" id="take-photo" class="camera-control-button">
                    <i class="fas fa-circle"></i>
                  </button>
                  <button type="button" id="close-camera" class="camera-control-button">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <small id="camera-error" class="error-text"></small>
              </div>
              <div class="form-group">
                <div class="custom-checkbox">
                  <input type="checkbox" id="location-enabled" name="location-enabled">
                  <label for="location-enabled">
                    <i class="fas fa-map-marker-alt"></i> Include location
                  </label>
                </div>
              </div>
              <div id="map-container" class="map-container hidden">
                <div id="map" class="add-story-map"></div>
                <input type="hidden" id="lat" name="lat">
                <input type="hidden" id="lon" name="lon">
                <small id="map-error" class="error-text"></small>
                <div class="location-info" id="location-info">
                  <i class="fas fa-map-pin"></i>
                  <span id="location-text">No location selected</span>
                </div>
              </div>
              <div class="progress-container hidden" id="progress-container">
                <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
              </div>
              <div class="form-actions">
                <a href="#/" class="cancel-button">Cancel</a>
                <button type="submit" class="submit-button" id="submit-button">
                  <i class="fas fa-paper-plane"></i> Share Story
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <app-footer></app-footer>
      <app-loader></app-loader>
      <canvas id="confetti-canvas" class="confetti-canvas"></canvas>
    `}async afterRender(){this._presenter.init(),this._presenter.loadRecentDrafts(),this._setupCharCounter(),this._setupAccessibility()}_setupCharCounter(){const e=document.getElementById("description"),t=document.getElementById("char-count");e&&t&&e.addEventListener("input",()=>{const a=e.value.length;t.textContent=a,a>240&&a<=270?(t.classList.add("text-warning"),t.classList.remove("text-danger")):a>270?(t.classList.add("text-danger"),t.classList.remove("text-warning")):t.classList.remove("text-warning","text-danger")})}_setupAccessibility(){const e=document.getElementById("description");e&&setTimeout(()=>e.focus(),200);const t=document.querySelector(".skip-link"),a=document.getElementById("main-content");t&&a&&t.addEventListener("click",function(i){i.preventDefault(),t.blur(),a.focus(),a.scrollIntoView({behavior:"smooth"})})}displayRecentDrafts(e){const t=document.getElementById("recent-drafts");if(!t)return;if(!e||!Array.isArray(e)||e.length===0){t.classList.add("hidden");return}t.classList.remove("hidden");let a='<h2 class="recent-drafts-title">Recent Drafts</h2><div class="recent-drafts-list">';e.forEach(i=>{const r=new Date(i.timestamp).toLocaleDateString("id-ID",{day:"numeric",month:"short"});a+=`
        <div class="recent-draft-item" data-id="${i.id}">
          <div class="draft-content">
            <p class="draft-text">${i.description}</p>
            <span class="draft-date">${r}</span>
          </div>
          <button class="use-draft-btn" data-id="${i.id}">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      `}),a+="</div>",t.innerHTML=a,document.querySelectorAll(".use-draft-btn").forEach(i=>{i.addEventListener("click",()=>{const o=i.getAttribute("data-id");this._presenter.useDraft(o)})})}applyDraftToForm(e){const t=document.getElementById("description");t&&(t.value=e,t.dispatchEvent(new Event("input")),t.focus(),document.querySelector(".story-form").scrollIntoView({behavior:"smooth"}))}setOpenCameraCallback(e){const t=document.querySelector("#camera-button");t&&t.addEventListener("click",e)}setTakePhotoCallback(e){const t=document.querySelector("#take-photo");t&&t.addEventListener("click",e)}showCameraStream(e){const t=document.querySelector("#camera-container"),a=document.querySelector("#camera-view");!t||!a||(t.classList.remove("hidden"),a.srcObject=e,a.onloadedmetadata=()=>{a.play().catch(i=>console.error("Error playing video:",i))})}capturePhoto(){const e=document.querySelector("#camera-view"),t=document.querySelector("#camera-canvas");return!e||!t||e.videoWidth===0||e.videoHeight===0?null:(t.width=e.videoWidth,t.height=e.videoHeight,t.getContext("2d").drawImage(e,0,0,t.width,t.height),t.toDataURL("image/jpeg",.9))}showCameraFlash(){const e=document.createElement("div");e.className="camera-flash",document.body.appendChild(e),setTimeout(()=>{e.style.opacity="0.8",setTimeout(()=>{e.style.opacity="0",setTimeout(()=>{document.body.removeChild(e)},300)},100)},10)}resetCameraUI(){const e=document.querySelector("#camera-container"),t=document.querySelector("#camera-view");e&&e.classList.add("hidden"),t&&(t.srcObject=null)}showCameraError(e){Swal.fire({icon:"error",title:"Camera Error",text:e,confirmButtonColor:"#4361ee"})}setPhotoInputCallback(e){const t=document.querySelector("#photo");t&&t.addEventListener("change",a=>{e(a.target.files[0])})}showPhotoPreview(e){const t=document.getElementById("photo-preview");if(!t)return;const a=new FileReader;a.onload=i=>{t.innerHTML=`
        <img 
          src="${i.target.result}" 
          alt="Selected photo preview" 
          style="max-width: 100%; border-radius: 8px; max-height: 300px;"
        >
      `},a.readAsDataURL(e)}showPhotoError(e){const t=document.getElementById("photo-error");t&&(t.textContent=e,t.style.display="block")}clearPhotoError(){const e=document.getElementById("photo-error");e&&(e.textContent="",e.style.display="none")}setLocationCheckboxCallback(e){const t=document.getElementById("location-enabled");t&&t.addEventListener("change",()=>{e(t.checked)})}showMapContainer(){const e=document.getElementById("map-container");e&&(e.classList.remove("hidden"),setTimeout(()=>{var t;if(window.L&&window.L.map){const a=(t=window.L.map._instances)==null?void 0:t[0];a&&a.invalidateSize()}},100))}hideMapContainer(){const e=document.getElementById("map-container");e&&e.classList.add("hidden")}setLocateMeCallback(e){const t=document.getElementById("locate-me");t&&t.addEventListener("click",e)}setSearchLocationCallback(e){const t=document.getElementById("search-location");t&&t.addEventListener("click",e)}updateLocationCoordinates(e,t){const a=document.getElementById("lat"),i=document.getElementById("lon"),o=document.getElementById("location-text");a&&i&&(a.value=e,i.value=t),o&&(o.textContent=`Coordinates: ${e.toFixed(6)}, ${t.toFixed(6)}`)}showMapError(e){Swal.fire({icon:"error",title:"Map Error",text:e,confirmButtonColor:"#4361ee"})}setSubmitCallback(e){const t=document.getElementById("add-story-form");t&&t.addEventListener("submit",async a=>{a.preventDefault();const i=this.getDescription(),r=document.getElementById("photo").files[0],c=document.getElementById("location-enabled").checked,d=document.getElementById("lat").value,u=document.getElementById("lon").value,f=new FormData;f.append("description",i),r&&f.append("photo",r),c&&d&&u&&(f.append("lat",d),f.append("lon",u)),e(f)})}getDescription(){const e=document.getElementById("description");return e?e.value.trim():""}setDescriptionInputCallback(e){const t=document.getElementById("description");t&&t.addEventListener("input",()=>{e(t.value.trim())})}showDescriptionError(e){const t=document.getElementById("description-error");if(t){t.textContent=e,t.style.display="block";const a=document.getElementById("description");a&&(a.classList.add("error"),a.setAttribute("aria-invalid","true"))}}clearDescriptionError(){const e=document.getElementById("description-error");if(e){e.textContent="",e.style.display="none";const t=document.getElementById("description");t&&(t.classList.remove("error"),t.setAttribute("aria-invalid","false"))}}showLoader(e="Loading..."){var t;(t=document.querySelector("app-loader"))==null||t.show(e)}hideLoader(){var e;(e=document.querySelector("app-loader"))==null||e.hide()}disableSubmitButton(){const e=document.getElementById("submit-button");e&&(e.disabled=!0)}resetForm(){const e=document.getElementById("add-story-form"),t=document.getElementById("photo-preview"),a=document.getElementById("map-container"),i=document.getElementById("location-enabled");e&&e.reset(),t&&(t.innerHTML=`<i class="fas fa-image preview-placeholder"></i>
      <img id="preview-image" class="hidden" alt="Preview of your photo">`),a&&a.classList.add("hidden"),i&&(i.checked=!1);const o=document.getElementById("char-count");o&&(o.textContent="0",o.classList.remove("text-warning","text-danger"))}async showLoginRequiredAlert(){return Swal.fire({icon:"warning",title:"Login Required",text:"You need to login first",confirmButtonText:"OK",confirmButtonColor:"#4361ee"})}async showOfflineAlert(){return Swal.fire({icon:"error",title:"Offline Mode",text:"Adding stories is not available without internet connection.",confirmButtonColor:"#4361ee"})}async showSuccessAlert(){return Swal.fire({icon:"success",title:"Story added successfully!",showConfirmButton:!1,timer:1500})}async showErrorAlert(e){return Swal.fire({icon:"error",title:"Error",text:e||"Failed to add story",confirmButtonColor:"#4361ee"})}showProgressBar(){var e;(e=document.getElementById("progress-container"))==null||e.classList.remove("hidden")}hideProgressBar(){var e;(e=document.getElementById("progress-container"))==null||e.classList.add("hidden")}updateProgressBar(e){const t=document.getElementById("progress-bar");t&&(t.style.width=`${e}%`)}showFormValidationError(){Swal.fire({icon:"warning",title:"Form Validation Error",text:"Please fix the errors in the form before submitting.",confirmButtonColor:"#4361ee"})}showConfetti(){const e=document.getElementById("confetti-canvas");if(!e)return;e.classList.add("active");const t={target:e,max:150,size:1.5,animate:!0,props:["circle","square","triangle","line"],colors:[[165,104,246],[230,61,135],[0,199,228],[253,214,126]],clock:25,rotate:!0,start_from_edge:!0,respawn:!1};window.confetti.create(e,t)({particleCount:150,spread:160}),setTimeout(()=>{e.classList.remove("active")},3e3)}setCloseCameraCallback(e){const t=document.getElementById("close-camera");t&&t.addEventListener("click",e)}}class he{async render(){return`
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="container not-found text-center" aria-labelledby="not-found-title">
          <h1 class="page-title" id="not-found-title">
            <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
            404 - Halaman Tidak Ditemukan
          </h1>
          <p class="mb-2">Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
          <a href="#/" class="btn btn-primary back-link" aria-label="Kembali ke Beranda">
            <i class="fas fa-home"></i>
            Kembali ke Beranda
          </a>
          <div class="mt-2">
            <button class="btn btn-secondary" id="reload-btn" aria-label="Muat ulang halaman">
              <i class="fas fa-sync-alt"></i> Muat Ulang
            </button>
          </div>
        </section>
      </main>
      <app-footer></app-footer>
    `}async afterRender(){const e=document.getElementById("main-content");e&&setTimeout(()=>e.focus(),200);const t=document.getElementById("reload-btn");t&&t.addEventListener("click",()=>window.location.reload())}}function _e(s){const t=s.split("?")[0].split("/").filter(Boolean);return{resource:t[0]||null,id:t[1]&&t[1]!=="add"?t[1]:null,isAddPage:t[1]==="add",extra:t.slice(2)}}function ke(){return location.hash.replace("#","")||"/"}function ft(){const{resource:s,id:e,isAddPage:t}=_e(ke());let a="#/";return s&&(a=`#/${s}`),t&&(a+="/add"),e&&(a+="/:id"),a}function gt(){return _e(ke())}const wt=p.ACCESS_TOKEN_KEY;function vt(){try{const s=localStorage.getItem(wt);return!s||s==="null"||s==="undefined"?null:s}catch(s){return console.error("getAccessToken: error:",s),null}}class me{constructor(){this._title="Cerita Favorit - DicoStory"}async render(){return document.title=this._title,`
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="favorites-page page-transition">
          <div class="coordinator-layout">
            <div class="coordinator-header">
              <div>
                <h2 class="coordinator-title text-gradient">
                  <i class="fas fa-heart"></i> Cerita Favorit
                </h2>
                <p class="subtitle">Kumpulan cerita yang Anda tandai sebagai favorit</p>
              </div>
              <a href="#/" class="btn btn-secondary animated-underline">
                <i class="fas fa-arrow-left"></i> Kembali ke Beranda
              </a>
            </div>
            <div id="favorites-container" class="coordinator-grid fade-in-up">
              <div class="loader" id="favorites-loader"></div>
            </div>
            <div id="error-container" class="error-container hidden"></div>
          </div>
        </section>
      </main>
      <app-footer></app-footer>
    `}async afterRender(){const e=document.getElementById("main-content");if(e&&setTimeout(()=>e.focus(),200),!vt()){window.location.hash="#/login";return}this.showLoading();try{const t=await B.getFavorites();this.renderFavorites(t)}catch(t){console.error("Error loading favorites:",t),this.showError("Gagal memuat cerita favorit: "+(t.message||"Unknown error"))}}showLoading(){var e,t;(e=document.getElementById("favorites-loader"))==null||e.classList.remove("hidden"),(t=document.getElementById("error-container"))==null||t.classList.add("hidden")}hideLoading(){var e;(e=document.getElementById("favorites-loader"))==null||e.classList.add("hidden")}async renderFavorites(e){this.hideLoading();const t=document.getElementById("favorites-container");if(t){if(!e||e.length===0){t.innerHTML=`
        <div class="empty-state text-center fade-in-up">
          <img src="./images/empty-favorite.svg" alt="Tidak ada favorit" style="max-width:120px; margin-bottom:1rem;opacity:.85;">
          <h3 class="mb-1">Belum ada cerita favorit</h3>
          <p class="mb-2">Tandai cerita yang Anda sukai agar mudah ditemukan di sini.</p>
          <a href="#/" class="btn btn-primary gradient-border">
            <i class="fas fa-compass"></i> Jelajahi Cerita
          </a>
        </div>
      `;return}t.innerHTML="",e.forEach((a,i)=>{const o=document.createElement("app-card");o.story=a,o.classList.add("glass","fade-in-up"),o.style.animationDelay=`${i*60}ms`,o.addEventListener("DOMSubtreeModified",function c(){const d=o.querySelector(".story-header");if(d&&!o.querySelector(".badge-favorite")){const u=document.createElement("span");u.className="badge badge-favorite",u.innerHTML='<i class="fas fa-heart"></i> Favorit',u.style.marginLeft="0.5em",d.appendChild(u),o.removeEventListener("DOMSubtreeModified",c)}});const r=document.createElement("button");r.className="remove-favorite-btn gradient-border",r.innerHTML='<i class="fas fa-trash"></i> Hapus',r.setAttribute("aria-label","Hapus dari favorit"),r.title="Hapus dari favorit",r.style.marginLeft="auto",r.addEventListener("click",async c=>{var u;c.preventDefault(),await B.removeFromFavorites(a.id);try{const f=localStorage.getItem("favoriteStories");let g=f?JSON.parse(f):[];g=g.filter(E=>E!==a.id),localStorage.setItem("favoriteStories",JSON.stringify(g))}catch{}o.style.transition="all 0.4s cubic-bezier(.4,0,.2,1)",o.style.opacity="0",o.style.transform="scale(0.97) translateY(20px)",setTimeout(()=>o.remove(),400),(await B.getFavorites()).length===0&&this.renderFavorites([]),(u=window.showToast)==null||u.call(window,"Cerita dihapus dari Favorit","info")}),o.addEventListener("DOMSubtreeModified",function c(){const d=o.querySelector(".story-actions");d&&!d.querySelector(".remove-favorite-btn")&&(d.appendChild(r),o.removeEventListener("DOMSubtreeModified",c))}),t.appendChild(o)})}}showError(e){var a;this.hideLoading();const t=document.getElementById("error-container");t&&(t.classList.remove("hidden"),t.innerHTML=`
      <div class="error-content text-center fade-in-up">
        <i class="fas fa-exclamation-triangle fa-3x mb-2"></i>
        <h3>Gagal memuat cerita favorit</h3>
        <p>${e}</p>
        <button id="retry-button" class="btn btn-primary mt-2 gradient-border">Coba Lagi</button>
      </div>
    `,(a=document.getElementById("retry-button"))==null||a.addEventListener("click",async()=>{this.showLoading();try{const i=await B.getFavorites();this.renderFavorites(i)}catch(i){this.showError("Gagal memuat cerita favorit: "+(i.message||"Unknown error"))}}))}_truncateText(e,t){return e?e.length<=t?e:e.substr(0,t)+"...":""}_formatDate(e){if(!e)return"-";const t={year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"};return new Date(e).toLocaleDateString("id-ID",t)}}const z={"#/":ue,"#/home":ue,"#/about":ct,"#/login":lt,"#/register":dt,"#/stories/:id":ht,"#/stories/add":pt,"#/saved":me,"#/favorites":me,"#/404":he,"*":he};var x,T,F,w,ee,Le,Ie,Te,Ce,Ae,$;class yt{constructor({content:e}){y(this,w);y(this,x,null);y(this,T,null);y(this,F,null);m(this,x,e),document.addEventListener("user-logout",()=>{var t;localStorage.removeItem("token"),localStorage.removeItem("user"),(t=window.showToast)==null||t.call(window,"Logout berhasil","success"),window.location.hash="#/login",v(this,w,$).call(this)})}async renderPage(){const e=ft(),{resource:t,id:a,isAddPage:i}=gt();if(v(this,w,Le).call(this),v(this,w,Ie).call(this,t,a),i){await v(this,w,ee).call(this,async()=>{var c;const r=new z["#/stories/add"];n(this,x).innerHTML=await r.render(),await((c=r.afterRender)==null?void 0:c.call(r)),r._presenter&&m(this,T,r._presenter),m(this,F,e),v(this,w,$).call(this)},{direction:"right"});return}const o=z[e]||z["#/404"];await v(this,w,ee).call(this,async()=>{var c;const r=new o;n(this,x).innerHTML=await r.render(),await((c=r.afterRender)==null?void 0:c.call(r)),r._presenter&&m(this,T,r._presenter),m(this,F,e),v(this,w,$).call(this)},{direction:"left"})}}x=new WeakMap,T=new WeakMap,F=new WeakMap,w=new WeakSet,ee=async function(e,{direction:t="left"}={}){v(this,w,Te).call(this);try{await document.startViewTransition(async()=>{if(await e(),window.matchMedia("(prefers-reduced-motion: no-preference)").matches){const a=document.getElementById("main-content");a&&a.animate(t==="right"?[{transform:"translateX(100%)",opacity:0},{transform:"translateX(0)",opacity:1}]:[{transform:"translateX(-50px)",opacity:0},{transform:"translateX(0)",opacity:1}],{duration:300,easing:"ease-out"})}}).finished}catch(a){console.error("Error rendering page:",a),v(this,w,Ae).call(this)}finally{v(this,w,Ce).call(this)}},Le=function(){var e;n(this,F)==="#/stories/add"&&((e=n(this,T))!=null&&e.stopCamera)&&n(this,T).stopCamera(),m(this,T,null)},Ie=function(e,t){const a={stories:t?"Story Details":"Add Story",login:"Login",register:"Register",about:"About",default:"Home"};document.title=`Dicoding Story | ${a[e]||a.default}`},Te=function(){var e;(e=document.querySelector("app-loader"))==null||e.show()},Ce=function(){var e;(e=document.querySelector("app-loader"))==null||e.hide()},Ae=function(){n(this,x).innerHTML=`
      <app-sidebar></app-sidebar>
      <section class="container">
        <h1 class="page-title">Error</h1>
        <p>Gagal memuat halaman. Silakan coba lagi.</p>
        <div class="flex gap-2 mt-3">
          <a href="#/" class="back-link">
            <i class="fas fa-home"></i>
            Kembali ke Beranda
          </a>
          <button onclick="window.location.reload()" class="back-link" style="background-color: var(--danger)">
            <i class="fas fa-sync-alt"></i>
            Muat Ulang
          </button>
        </div>
      </section>
    `},$=function(){try{const e=localStorage.getItem("accessToken"),t=localStorage.getItem("user");if(e&&t&&t!=="undefined")try{window.dispatchEvent(new CustomEvent("user-login-state-changed",{detail:{isLoggedIn:!0,userData:JSON.parse(t)}}))}catch{localStorage.removeItem("user");const a={name:"User",email:""};localStorage.setItem("user",JSON.stringify(a)),window.dispatchEvent(new CustomEvent("user-login-state-changed",{detail:{isLoggedIn:!0,userData:a}}))}else window.dispatchEvent(new CustomEvent("user-login-state-changed",{detail:{isLoggedIn:!1,userData:null}}))}catch(e){console.error("Error updating sidebar:",e)}};function bt(){const s=document.createElement("div");s.className="splash-screen";const e=document.createElement("img");e.src="/images/logo.png",e.alt="Dicoding Story Logo",e.className="splash-logo";const t=document.createElement("div");t.className="splash-title",t.textContent="Dicoding Story";const a=document.createElement("div");a.className="splash-dots";for(let i=0;i<3;i++){const o=document.createElement("div");o.className="splash-dot",a.appendChild(o)}return s.appendChild(e),s.appendChild(t),s.appendChild(a),document.body.appendChild(s),s}function G(s){s.style.opacity="0",setTimeout(()=>{s.style.visibility="hidden",document.body.contains(s)&&document.body.removeChild(s)},600)}const St=()=>"startViewTransition"in document&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches;St()||(document.startViewTransition=s=>{try{const e=Promise.resolve(s());return{ready:Promise.resolve(),updateCallbackDone:e,finished:e}}catch(e){return console.error("Error in startViewTransition callback:",e),{ready:Promise.reject(e),updateCallbackDone:Promise.reject(e),finished:Promise.reject(e)}}});function Et(){const s=localStorage.getItem("theme");s?document.documentElement.setAttribute("data-theme",s):window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches&&(document.documentElement.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"))}Et();async function _t(){const s=bt();setTimeout(async()=>{const e=document.querySelector("#app");if(!e){console.error("App element not found"),G(s);return}const t=new yt({content:e});try{await t.renderPage(),G(s),kt(),Lt(),pe()}catch(r){console.error("Error loading initial page:",r),G(s),e.innerHTML=`
        <section class="container">
          <h1 class="page-title">Error</h1>
          <p>Gagal memuat halaman. Silakan coba lagi.</p>
          <a href="#/" class="back-link">
            <i class="fas fa-home"></i>
            Kembali ke Beranda
          </a>
        </section>
      `,window.showToast&&window.showToast("Gagal memuat halaman, silakan coba lagi","error")}window.addEventListener("hashchange",async()=>{try{const r=document.createElement("div");r.className="loading-spinner",r.innerHTML=`
          <div class="spinner-container">
            <div class="spinner-pulse"></div>
            <div class="spinner"></div>
          </div>
          <div class="spinner-text">Loading...</div>
        `,document.body.appendChild(r),await t.renderPage(),pe(),document.body.removeChild(r)}catch(r){console.error("Error loading page:",r),window.showToast&&window.showToast("Gagal memuat halaman","error")}});const a=()=>{const r=document.querySelector(".skip-link");r&&r.addEventListener("click",function(c){c.preventDefault();const d=document.querySelector("#main-content");d&&(r.blur(),d.focus(),d.scrollIntoView({behavior:"smooth"}))})};a(),window.addEventListener("hashchange",()=>setTimeout(a,100));let i;const o=document.createElement("div");o.id="install-container",o.classList.add("install-prompt"),o.innerHTML=`
      <div class="install-content">
        <img src="/images/logo.png" alt="App icon" width="48" height="48">
        <div class="install-text">
          <h3>Install Dicoding Story</h3>
          <p>Install aplikasi ini untuk pengalaman offline yang lebih baik!</p>
        </div>
        <div class="install-actions">
          <button id="install-button" class="primary-button">Install</button>
          <button id="dismiss-button" class="secondary-button">Nanti</button>
        </div>
      </div>
    `,document.body.appendChild(o),window.addEventListener("beforeinstallprompt",r=>{r.preventDefault(),i=r,setTimeout(()=>{o.classList.add("show")},3e3),document.getElementById("install-button").onclick=()=>{o.classList.remove("show"),i.prompt(),i.userChoice.then(c=>{c.outcome==="accepted"&&window.showToast&&window.showToast("Aplikasi sedang diinstall!","success"),i=null})},document.getElementById("dismiss-button").onclick=()=>{o.classList.remove("show")}}),window.showToast&&setTimeout(()=>{window.showToast("Selamat datang di Dicoding Story!","info")},1e3)},1800)}function kt(){const s=document.querySelector("header");if(!s)return;const e=()=>{window.scrollY>30?s.classList.add("scrolled"):s.classList.remove("scrolled")};e(),window.addEventListener("scroll",e)}function Lt(){const s=localStorage.getItem("theme");s&&document.documentElement.setAttribute("data-theme",s);const e=document.querySelector(".nav-list");if(e&&!document.getElementById("theme-toggle-item")){const t=document.createElement("li");t.id="theme-toggle-item";const a=s||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");t.innerHTML=`
      <button id="theme-toggle" aria-label="Toggle dark/light mode">
        <i class="fas ${a==="dark"?"fa-sun":"fa-moon"}" aria-hidden="true"></i>
        <span>${a==="dark"?"Light Mode":"Dark Mode"}</span>
      </button>
    `;const i=e.children[1];i?e.insertBefore(t,i.nextSibling):e.appendChild(t);const o=document.getElementById("theme-toggle");o&&o.addEventListener("click",It)}}function It(){const e=(document.documentElement.getAttribute("data-theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"))==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",e),localStorage.setItem("theme",e);const t=document.getElementById("theme-toggle");if(t){const a=t.querySelector("i"),i=t.querySelector("span");a&&(a.className=`fas ${e==="dark"?"fa-sun":"fa-moon"}`),i&&(i.textContent=e==="dark"?"Light Mode":"Dark Mode")}window.showToast&&window.showToast(`Switched to ${e==="dark"?"dark":"light"} mode`,"info")}function pe(){const s=()=>{document.querySelectorAll(".story-item, .page-title, .story-form, .auth-container").forEach(a=>{const i=a.getBoundingClientRect();if(i.top<=(window.innerHeight||document.documentElement.clientHeight)*.85&&i.bottom>=0)if(a.classList.add("visible"),a.classList.contains("story-item")){a.classList.add("animate__animated","animate__fadeInUp");const r=Array.from(a.parentNode.children).indexOf(a);a.style.animationDelay=`${r*.1}s`}else a.classList.contains("page-title")?a.classList.add("animate__animated","animate__fadeInDown"):a.classList.add("animate__animated","animate__fadeIn")})};setTimeout(s,100);let e;window.addEventListener("scroll",()=>{clearTimeout(e),e=setTimeout(s,20)})}document.addEventListener("DOMContentLoaded",_t);
//# sourceMappingURL=main-CtBsCFfp.js.map
