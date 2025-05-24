var U=r=>{throw TypeError(r)};var k=(r,e,t)=>e.has(r)||U("Cannot "+t);var g=(r,e,t)=>(k(r,e,"read from private field"),t?t.call(r):e.get(r)),S=(r,e,t)=>e.has(r)?U("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(r):e.set(r,t),y=(r,e,t,o)=>(k(r,e,"write to private field"),o?o.call(r,t):e.set(r,t),t),p=(r,e,t)=>(k(r,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();const l={BASE_URL:"https://story-api.dicoding.dev/v1",DEFAULT_LANGUAGE:"id-ID",CACHE_NAME:"DicodingStory-V5",DATABASE_NAME:"dicoding-story-database",DATABASE_VERSION:1,OBJECT_STORE_NAME:"stories",DEFAULT_MAP_CENTER:[-6.1754,106.8272],DEFAULT_MAP_ZOOM:13,PAGE_SIZE:10,API_TIMEOUT:3e4,API_RETRY_ATTEMPTS:2,API_RETRY_DELAY:1e3,MAX_PHOTO_SIZE:5*1024*1024,MAP_TILE_LAYERS:{osm:{url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',name:"OpenStreetMap"},satellite:{url:"https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=WlHVW3GmIbcYKHpoc75N",attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',name:"Satellite"},dark:{url:"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',name:"Dark Mode"}},VAPID_PUBLIC_KEY:"BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",SERVICE_WORKER_PATH:"./sw.js",OFFLINE_PAGE:"./offline.html"};class v{static async _fetchWithTimeout(e,t={},o=0){const a=new AbortController,{signal:i}=a,s={...t,signal:i,mode:"cors",credentials:"same-origin"},c=setTimeout(()=>{a.abort()},l.API_TIMEOUT);try{if(t.body instanceof FormData&&t.onProgress&&t.method==="POST")return await this._uploadWithProgress(e,t);const n=await fetch(e,s);if(!n.ok){const h=await n.json().catch(()=>({}));let m=h.message||`HTTP error! status: ${n.status}`;if(n.status===400){m=h.message||"Bad Request: The server could not process your request.";const E=new Error(m);throw E.status=n.status,E.data=h,E}else n.status===401?(m="Your session has expired. Please login again.",setTimeout(()=>{window.location.hash="#/login"},2e3)):n.status===403?m="You don't have permission to perform this action.":n.status===404?m="The requested resource was not found.":n.status===413?m="The file you are trying to upload is too large.":n.status>=500&&(m="Server error. Please try again later.");throw new Error(m)}return await n.json()}catch(n){if(n.name==="AbortError"){if(console.warn(`Request timed out: ${e}`),o<l.API_RETRY_ATTEMPTS)return console.log(`Retrying request (${o+1}/${l.API_RETRY_ATTEMPTS})...`),await new Promise(u=>setTimeout(u,l.API_RETRY_DELAY)),this._fetchWithTimeout(e,t,o+1);throw new Error("Request timed out. Please check your internet connection and try again.")}if(n.message==="Failed to fetch"||n.message.includes("NetworkError")||n.message.includes("CORS")){if(console.error("Network or CORS error:",n),e.includes("/notifications/"))return console.warn("Notification API request failed - this is expected in development environment"),{status:"failed",error:n.message};window.showToast&&window.showToast("Network connection issue. Please check your internet connection.","warning")}throw n}finally{clearTimeout(c)}}static async _uploadWithProgress(e,t){return new Promise((o,a)=>{const i=new XMLHttpRequest;i.open(t.method||"POST",e),t.headers&&Object.keys(t.headers).forEach(s=>{i.setRequestHeader(s,t.headers[s])}),i.upload.addEventListener("progress",s=>{if(s.lengthComputable&&t.onProgress){const c=Math.round(s.loaded/s.total*100);t.onProgress(c)}}),i.addEventListener("load",()=>{if(i.status>=200&&i.status<300)try{const s=JSON.parse(i.responseText);o(s)}catch{a(new Error("Invalid response format from server"))}else try{const s=JSON.parse(i.responseText);a(new Error(s.message||`HTTP error! status: ${i.status}`))}catch{a(new Error(`HTTP error! status: ${i.status}`))}}),i.addEventListener("error",()=>{a(new Error("Network error occurred"))}),i.addEventListener("abort",()=>{a(new Error("Upload aborted"))}),i.addEventListener("timeout",()=>{a(new Error("Upload timed out"))}),i.send(t.body)})}static async register({name:e,email:t,password:o}){this._validateEmail(t),this._validatePassword(o);try{const a=await this._fetchWithTimeout(`${l.BASE_URL}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,password:o})});return window.showToast&&window.showToast("Registrasi berhasil! Silakan login.","success"),a}catch(a){throw a.message.includes("email is already taken")?new Error("Email sudah digunakan. Silakan gunakan email lain."):a}}static async login({email:e,password:t}){this._validateEmail(e);try{const o=await this._fetchWithTimeout(`${l.BASE_URL}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})});return window.showToast&&window.showToast(`Selamat datang kembali, ${o.loginResult.name}!`,"success"),o}catch(o){throw o.message.includes("user not found")||o.message.includes("password")?new Error("Email atau password salah. Silakan coba lagi."):o}}static async getAllStories({token:e,page:t=1,size:o=l.PAGE_SIZE,location:a=0}){this._validateToken(e);try{console.log(`Fetching stories data: page=${t}, size=${o}, location=${a}`);const i=await this._fetchWithTimeout(`${l.BASE_URL}/stories?page=${t}&size=${o}&location=${a}`,{headers:{Authorization:`Bearer ${e}`}});if(!i||!i.listStory)throw console.error("Invalid response format from API:",i),new Error("Format respons dari server tidak valid");return console.log(`Successfully fetched ${i.listStory.length} stories`),i}catch(i){throw console.error("Error fetching stories:",i),window.showToast&&window.showToast("Gagal memuat cerita. "+i.message,"error"),i}}static async getStoryDetail({token:e,id:t}){if(this._validateToken(e),!t)throw new Error("ID cerita tidak valid");return this._fetchWithTimeout(`${l.BASE_URL}/stories/${t}`,{headers:{Authorization:`Bearer ${e}`}})}static async addNewStory({token:e,data:t,onProgress:o}){this._validateToken(e);try{if(!t.has("description"))throw new Error("Description is required");if(!t.has("photo"))throw new Error("Photo is required");const a={method:"POST",headers:{Authorization:`Bearer ${e}`},body:t,onProgress:o},i=await this._fetchWithTimeout(`${l.BASE_URL}/stories`,a);return window.showToast&&window.showToast("Cerita berhasil ditambahkan!","success"),i}catch(a){throw console.error("Error adding story:",a),a.message.includes("photo")?new Error("Gagal mengunggah foto. Pastikan ukuran foto tidak melebihi 5MB."):a.status===400?new Error("Bad request: Pastikan semua data yang dikirim valid (foto dan deskripsi wajib diisi)."):a.message.includes("Network")||a.message.includes("timeout")?new Error("Koneksi gagal. Periksa koneksi internet Anda dan coba lagi."):a}}static async subscribeNotification({token:e,subscription:t}){this._validateToken(e);try{const o=await this._fetchWithTimeout(`${l.BASE_URL}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify(t)});return window.showToast&&window.showToast("Notifikasi berhasil diaktifkan!","success"),o}catch(o){throw console.error("Error subscribing to notifications:",o),window.showToast&&window.showToast("Gagal mengaktifkan notifikasi","error"),o}}static async unsubscribeNotification({token:e,endpoint:t}){if(this._validateToken(e),!t)throw new Error("Endpoint notifikasi tidak valid");try{if(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")return console.log("Development environment detected - skipping actual notification unsubscribe request"),window.showToast&&window.showToast("Notifikasi berhasil dinonaktifkan (dev mode)","info"),{success:!0,message:"Unsubscribed from notifications (development mock)"};const a=await this._fetchWithTimeout(`${l.BASE_URL}/notifications/unsubscribe`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({endpoint:t})});return window.showToast&&window.showToast("Notifikasi berhasil dinonaktifkan","info"),a}catch(o){throw console.error("Error unsubscribing from notifications:",o),window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.showToast&&window.showToast("Gagal menonaktifkan notifikasi","error"),o}}static _validateToken(e){if(!e)throw new Error("Autentikasi diperlukan. Silakan login terlebih dahulu.")}static _validateEmail(e){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))throw new Error("Silakan masukkan alamat email yang valid")}static _validatePassword(e){if(e.length<8)throw new Error("Password harus minimal 8 karakter")}}class ae extends HTMLElement{connectedCallback(){this.render(),this.setupEventListeners(),this.checkNotificationPermission()}render(){const e=localStorage.getItem("token")!==null;let t=null;try{const o=localStorage.getItem("user");o&&o!=="undefined"&&(t=JSON.parse(o))}catch(o){console.error("Failed to parse user data:",o),localStorage.removeItem("user")}this.innerHTML=`
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
                  <i class="fas fa-home" aria-hidden="true"></i>
                  Home
                </a>
              </li>
              <li>
                <a href="#/about" class="${window.location.hash==="#/about"?"active":""}" aria-current="${window.location.hash==="#/about"?"page":"false"}">
                  <i class="fas fa-info-circle" aria-hidden="true"></i>
                  About
                </a>
              </li>
              ${e?`
                    <li>
                      <a href="#/stories/add" class="${window.location.hash==="#/stories/add"?"active":""}" aria-current="${window.location.hash==="#/stories/add"?"page":"false"}">
                        <i class="fas fa-plus-circle" aria-hidden="true"></i>
                        Add Story
                      </a>
                    </li>
                    <li class="user-menu">
                      <div class="user-info" tabindex="0" aria-haspopup="true" aria-expanded="false">
                        <div class="user-avatar" aria-hidden="true">${re(t==null?void 0:t.name)}</div>
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
                          <button id="theme-toggle" class="dropdown-button" role="menuitem">
                            <i class="fas fa-moon" aria-hidden="true"></i>
                            <span>Dark Mode</span>
                          </button>
                        </li>
                        <li role="none" class="dropdown-divider"></li>
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
                        <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
                        Login
                      </a>
                    </li>
                    <li>
                      <a href="#/register" class="${window.location.hash==="#/register"?"active":""}" aria-current="${window.location.hash==="#/register"?"page":"false"}">
                        <i class="fas fa-user-plus" aria-hidden="true"></i>
                        Register
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
    `}setupEventListeners(){this._setupDrawerToggle(),this._setupUserMenu(),this._setupLogoutButton(),this._setupNotificationToggle(),this._setupThemeToggle()}_setupDrawerToggle(){const e=this.querySelector("#drawer-button"),t=this.querySelector("#navigation-drawer");!e||!t||(e.addEventListener("click",o=>{o.stopPropagation();const a=t.classList.toggle("open");if(e.setAttribute("aria-expanded",a),a){const i=t.querySelector("a");i&&i.focus()}}),document.addEventListener("click",o=>{t.contains(o.target)||(t.classList.remove("open"),e.setAttribute("aria-expanded","false"))}),document.addEventListener("keydown",o=>{o.key==="Escape"&&(t.classList.remove("open"),e.setAttribute("aria-expanded","false"),e.focus())}))}_setupUserMenu(){const e=this.querySelector(".user-menu");if(!e)return;const t=e.querySelector(".user-info"),o=e.querySelector(".user-dropdown");t.addEventListener("click",a=>{a.stopPropagation();const i=t.getAttribute("aria-expanded")==="true";t.setAttribute("aria-expanded",!i),o.style.display=i?"none":"block"}),document.addEventListener("click",()=>{t.setAttribute("aria-expanded","false"),o.style.display="none"}),t.addEventListener("keydown",a=>{if(a.key==="Enter"||a.key===" "){a.preventDefault();const i=t.getAttribute("aria-expanded")==="true";if(t.setAttribute("aria-expanded",!i),o.style.display=i?"none":"block",!i){const s=o.querySelector("button");s&&s.focus()}}})}_setupThemeToggle(){const e=this.querySelector("#theme-toggle");if(!e)return;const t=document.documentElement.getAttribute("data-theme")==="dark",o=e.querySelector("i"),a=e.querySelector("span");t&&(o.classList.replace("fa-moon","fa-sun"),a.textContent="Light Mode"),e.addEventListener("click",()=>{const s=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",s),localStorage.setItem("theme",s);const c=e.querySelector("i"),n=e.querySelector("span");s==="dark"?(c.classList.replace("fa-moon","fa-sun"),n.textContent="Light Mode"):(c.classList.replace("fa-sun","fa-moon"),n.textContent="Dark Mode"),window.showToast&&window.showToast(`${s==="dark"?"Dark":"Light"} mode activated`,"info")})}_setupLogoutButton(){const e=this.querySelector("#logout-button");e&&e.addEventListener("click",()=>{Swal.fire({title:"Logout",text:"Are you sure you want to logout?",icon:"question",showCancelButton:!0,confirmButtonColor:"#4361ee",cancelButtonColor:"#f72585",confirmButtonText:"Yes, Logout",cancelButtonText:"Cancel",focusCancel:!0}).then(t=>{t.isConfirmed&&(this._cleanupNotifications(),localStorage.removeItem("token"),localStorage.removeItem("user"),window.showToast&&window.showToast("Logout successful","success"),window.location.hash="#/login")})})}async _cleanupNotifications(){if(!(!("serviceWorker"in navigator)||!("PushManager"in window)))try{const t=await(await navigator.serviceWorker.ready).pushManager.getSubscription();t&&(await t.unsubscribe(),console.log("Cleaned up push subscription on logout"))}catch(e){console.error("Error cleaning up notifications on logout:",e)}}async checkNotificationPermission(){const e=this.querySelector("#notification-toggle"),t=this.querySelector("#notification-status"),o=this.querySelector(".status-indicator");!e||!t||!o||(Notification.permission==="granted"?await this._checkActiveSubscription()?(t.textContent="Disable Notifications",o.classList.add("active"),e.classList.add("enabled")):(t.textContent="Enable Notifications",o.classList.remove("active"),e.classList.remove("enabled")):Notification.permission==="denied"?(t.textContent="Notifications Blocked",e.disabled=!0,e.classList.add("blocked"),o.classList.add("blocked")):(t.textContent="Enable Notifications",o.classList.remove("active"),e.classList.remove("enabled")))}async _checkActiveSubscription(){if(!("serviceWorker"in navigator)||!("PushManager"in window))return!1;try{return!!await(await navigator.serviceWorker.ready).pushManager.getSubscription()}catch(e){return console.error("Error checking subscription:",e),!1}}_setupNotificationToggle(){const e=this.querySelector("#notification-toggle"),t=this.querySelector("#notification-status"),o=this.querySelector(".status-indicator");!e||!t||!o||e.addEventListener("click",async()=>{if(e.disabled)return;e.disabled=!0,e.classList.add("loading");const a=t.textContent;t.textContent="Processing...";try{if(await this._checkActiveSubscription())await this._unsubscribeFromNotifications(),t.textContent="Enable Notifications",o.classList.remove("active"),e.classList.remove("enabled");else if(Notification.permission==="granted")await this._subscribeToNotifications(),t.textContent="Disable Notifications",o.classList.add("active"),e.classList.add("enabled");else{const s=await Notification.requestPermission();s==="granted"?(await this._subscribeToNotifications(),t.textContent="Disable Notifications",o.classList.add("active"),e.classList.add("enabled")):s==="denied"&&(t.textContent="Notifications Blocked",e.disabled=!0,e.classList.add("blocked"),o.classList.add("blocked"),window.showToast&&window.showToast("Notification permission denied by browser","warning"))}}catch(i){console.error("Error toggling notifications:",i),t.textContent=a,window.showToast&&window.showToast("Failed to toggle notifications","error")}finally{e.disabled=!1,e.classList.remove("loading")}})}async _subscribeToNotifications(){if(!("serviceWorker"in navigator)||!("PushManager"in window)){console.log("Push notifications are not supported");return}const e=localStorage.getItem("token");if(e)try{const t=await navigator.serviceWorker.ready,o=await t.pushManager.getSubscription();o&&await o.unsubscribe();const i=(await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:l.VAPID_PUBLIC_KEY})).toJSON(),{endpoint:s,keys:c}=i,n={endpoint:s,keys:c};return await v.subscribeNotification({token:e,subscription:n}),console.log("Successfully subscribed to notifications"),window.showToast&&window.showToast("Notifications enabled successfully","success"),!0}catch(t){return console.error("Error subscribing to notifications:",t),window.showToast&&window.showToast("Failed to enable notifications","error"),!1}}async _unsubscribeFromNotifications(){const e=localStorage.getItem("token");if(!e)return!1;try{const o=await(await navigator.serviceWorker.ready).pushManager.getSubscription();if(o){try{await v.unsubscribeNotification({token:e,endpoint:o.endpoint})}catch(i){console.warn("API unsubscribe notification failed (expected in development):",i)}const a=await o.unsubscribe();return console.log("Successfully unsubscribed from push notification service"),window.showToast&&window.showToast("Notifications disabled successfully","info"),a}return!0}catch(t){return console.error("Error unsubscribing from notifications:",t),!(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")&&window.showToast&&window.showToast("Failed to disable notifications","error"),!1}}}customElements.define("app-header",ae);function re(r){return r?r.split(" ").map(e=>e.charAt(0)).join("").toUpperCase():"U"}function Y(r,e="id-ID",t={}){const o={year:"numeric",month:"long",day:"numeric",...t};try{return new Date(r).toLocaleDateString(e,o)}catch(a){return console.error("Error formatting date:",a),r||"Unknown date"}}function ie(r,e=300,t=!1){let o;return function(...i){const s=this,c=()=>{o=null,t||r.apply(s,i)},n=t&&!o;clearTimeout(o),o=setTimeout(c,e),n&&r.apply(s,i)}}function C(r){const e=["Bytes","KB","MB","GB"],t=Math.floor(Math.log(r)/Math.log(1024));return parseFloat((r/Math.pow(1024,t)).toFixed(2))+" "+e[t]}function Z(r){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r)}class se extends HTMLElement{set story(e){this._story=e,this.render()}render(){if(this._story)try{const e={id:this._story.id||`unknown-${Date.now()}`,name:this._story.name||"Unknown User",description:this._story.description||"No description provided",photoUrl:this._story.photoUrl||"./images/placeholder.jpg",createdAt:this._story.createdAt||new Date().toISOString(),lat:this._story.lat,lon:this._story.lon},t=Y(e.createdAt,"id-ID",{year:"numeric",month:"long",day:"numeric"}),o=`story-title-${e.id}`,a=`story-desc-${e.id}`,i=H(e.name);this.innerHTML=`
        <article class="story-item" aria-labelledby="${o}" aria-describedby="${a}">
          <div class="story-image-container">
            <div class="story-badge" style="background-color: ${i}">
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
                <div class="user-avatar" aria-hidden="true" style="background-color: ${i}">
                  ${ne(e.name)}
                </div>
                <div>
                  <h3 class="story-name" id="${o}">${e.name}</h3>
                  <time class="story-date" datetime="${e.createdAt}">
                    <i class="far fa-calendar-alt" aria-hidden="true"></i> ${t}
                  </time>
                </div>
              </div>
              ${e.lat&&e.lon?`<div class="story-location-badge" title="Has location data">
                      <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                    </div>`:""}
            </div>
            
            <p class="story-description" id="${a}">${z(e.description,120)}</p>
            
            ${e.lat&&e.lon?`<div class="story-map" id="map-${e.id}" 
                        aria-label="Location of story by ${e.name}" 
                        tabindex="0"></div>`:""}
            
            <div class="story-actions">
              <a href="#/stories/${e.id}" class="story-link" 
                 aria-label="Read full story by ${e.name}">
                <i class="fas fa-book-reader" aria-hidden="true"></i>
                Read Full Story
              </a>
            </div>
          </div>
        </article>
      `,e.lat&&e.lon&&requestAnimationFrame(()=>this.renderMap())}catch(e){console.error("Error rendering card:",e,{story:this._story}),this.innerHTML=`
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
      `}}renderMap(){try{if(!this._story){console.error("Cannot render map: story data is missing");return}const e=parseFloat(this._story.lat),t=parseFloat(this._story.lon);if(isNaN(e)||isNaN(t)){console.error("Cannot render map: invalid coordinates",{lat:this._story.lat,lon:this._story.lon});return}const o=this._story.id||`unknown-${Date.now()}`,a=this._story.name||"Unknown User",i=this._story.description||"",s=this.querySelector(`#map-${o}`);if(!s||!window.L){console.error("Cannot render map: DOM element or Leaflet not available");return}const c=L.map(s,{zoomControl:!1,dragging:!1,touchZoom:!1,scrollWheelZoom:!1,doubleClickZoom:!1,boxZoom:!1,keyboard:!1,attributionControl:!1}).setView([e,t],13);L.tileLayer(l.MAP_TILE_LAYERS.osm.url,{maxZoom:19}).addTo(c);const n=H(a),u=L.divIcon({html:`<div style="background-color: ${n}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                <i class="fas fa-map-marker-alt"></i>
              </div>`,className:"",iconSize:[30,30],iconAnchor:[15,30]});L.marker([e,t],{icon:u}).addTo(c).bindPopup(`<div class="map-popup">
            <b>${a}</b>
            <p>${z(i,50)}...</p>
            <a href="#/stories/${o}" class="popup-link">View Details</a>
          </div>`,{className:"custom-popup",closeButton:!1}).openPopup(),c.on("click",()=>{window.location.hash=`#/stories/${o}`}),s.addEventListener("keydown",h=>{(h.key==="Enter"||h.key===" ")&&(window.location.hash=`#/stories/${o}`)})}catch(e){console.error("Error rendering map:",e,{story:this._story})}}connectedCallback(){try{if("IntersectionObserver"in window&&window.matchMedia("(prefers-reduced-motion: no-preference)").matches){const e=new IntersectionObserver(t=>{t.forEach(o=>{o.isIntersecting&&(this.classList.add("visible"),e.unobserve(this))})},{threshold:.2});e.observe(this)}else this.classList.add("visible")}catch(e){console.error("Error in connectedCallback:",e),this.classList.add("visible")}}}customElements.define("app-card",se);function ne(r){if(typeof r!="string")return"U";try{return r.split(" ").map(e=>e.charAt(0)).join("").toUpperCase().substring(0,2)}catch(e){return console.error("Error getting initials:",e,{name:r}),"U"}}function H(r){const e=["#4361ee","#3f37c9","#4895ef","#4cc9f0","#f72585","#7209b7","#3a0ca3","#4cc9f0","#f72585","#f8961e"];if(!r||typeof r!="string")return e[0];const t=r.split("").reduce((o,a)=>a.charCodeAt(0)+((o<<5)-o),0);return e[Math.abs(t)%e.length]}function z(r,e=100){if(!r||typeof r!="string")return"";try{return r.length<=e?r:`${r.substring(0,e)}...`}catch(t){return console.error("Error truncating text:",t,{text:r}),""}}class ce extends HTMLElement{constructor(){super(),this.message="Loading..."}static get observedAttributes(){return["message"]}attributeChangedCallback(e,t,o){e==="message"&&t!==o&&(this.message=o,this.renderMessage())}connectedCallback(){this.render(),this.hide()}show(e=""){e&&(this.message=e,this.renderMessage()),this.style.display="flex"}hide(){this.style.display="none"}render(){this.innerHTML=`
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p class="loading-message">${this.message}</p>
      </div>
    `}renderMessage(){const e=this.querySelector(".loading-message");e&&(e.textContent=this.message)}}customElements.define("app-loader",ce);class le extends HTMLElement{connectedCallback(){this.render(),this.setupEventListeners()}render(){const e=new Date().getFullYear();this.innerHTML=`
      <footer class="app-footer">
        <div class="container footer-content">
          <div class="social-links">
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
          <p>&copy; ${e} Dicoding Story. All rights reserved.</p>
          <p class="copyright">
            Made with Naufal Arsyaputra Pradana <i class="fas fa-code" style="color: var(--danger)"></i> for Dicoding Submission
          </p>
        </div>
      </footer>
    `}setupEventListeners(){const e=this.querySelector("p:first-of-type");e&&e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})})}}customElements.define("app-footer",le);class de extends HTMLElement{constructor(){super(),this._isInitialized=!1,this._isLoggedIn=!1,this._userData=null,this._checkLoginStatus()}connectedCallback(){this._render(),this._isInitialized=!0,this._bindEvents(),window.addEventListener("hashchange",()=>{this._render()}),window.addEventListener("user-login-state-changed",e=>{this._isLoggedIn=e.detail.isLoggedIn,this._userData=e.detail.userData,this._render()})}disconnectedCallback(){const e=this.querySelector("#sidebar-toggle");e&&e.removeEventListener("click",this._toggleSidebar),window.removeEventListener("hashchange",this._render),window.removeEventListener("user-login-state-changed",this._render)}_checkLoginStatus(){try{const e=localStorage.getItem("token"),t=localStorage.getItem("user");if(e&&t)try{this._isLoggedIn=!0,this._userData=JSON.parse(t)}catch(o){console.error("Invalid user data format in localStorage:",o),localStorage.removeItem("user"),this._isLoggedIn=!!e,this._userData=null}else this._isLoggedIn=!1,this._userData=null}catch(e){console.error("Error checking login status",e),this._isLoggedIn=!1,this._userData=null}}_render(){this.innerHTML=`
      <div class="sidebar-container">
        <button id="sidebar-toggle" class="sidebar-toggle" aria-label="Toggle sidebar">
          <i class="fas fa-bars" aria-hidden="true"></i>
        </button>
        
        <div id="sidebar" class="sidebar">
          <div class="sidebar-header">
            <img src="./images/logo.png" alt="Dicoding Story Logo" class="sidebar-logo">
            <h2 class="sidebar-title">Dicoding Story</h2>
            <button id="sidebar-close" class="sidebar-close" aria-label="Close sidebar">
              <i class="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>
          
          <div class="sidebar-content">
            ${this._renderUserSection()}
            
            <nav class="sidebar-nav">
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
                  <a href="#/saved" class="sidebar-link ${this._isActiveRoute("#/saved")?"active":""}">
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
    `}_getInitials(e){return!e||typeof e!="string"?"?":e.split(" ").map(t=>t.charAt(0)).join("").toUpperCase().substring(0,2)}_getAvatarColor(e){if(!e)return"#4361ee";const t=["#4361ee","#3a0ca3","#f72585","#4cc9f0","#4895ef","#560bad","#f8961e","#fb5607","#80b918"];let o=0;for(let a=0;a<e.length;a++)o=e.charCodeAt(a)+((o<<5)-o);return t[Math.abs(o)%t.length]}_bindEvents(){const e=this.querySelector("#sidebar-toggle");this.querySelector("#sidebar");const t=this.querySelector("#sidebar-overlay"),o=this.querySelector("#sidebar-close");e&&e.addEventListener("click",()=>this._toggleSidebar()),o&&o.addEventListener("click",()=>this._closeSidebar()),t&&t.addEventListener("click",()=>this._closeSidebar());const a=this.querySelector("#logout-button");a&&a.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("user-logout",{bubbles:!0,composed:!0})),this._closeSidebar()}),this.querySelectorAll(".sidebar-link").forEach(s=>{s.addEventListener("click",()=>this._closeSidebar())})}_toggleSidebar(){try{const e=this.querySelector("#sidebar"),t=this.querySelector("#sidebar-overlay");if(!e||!t)return;e.classList.contains("open")?this._closeSidebar():(e.classList.add("open"),t.classList.add("visible"),document.body.classList.add("sidebar-open"))}catch(e){console.error("Error toggling sidebar:",e)}}_closeSidebar(){try{const e=this.querySelector("#sidebar"),t=this.querySelector("#sidebar-overlay");if(!e||!t)return;e.classList.remove("open"),t.classList.remove("visible"),document.body.classList.remove("sidebar-open")}catch(e){console.error("Error closing sidebar:",e)}}_isActiveRoute(e){const t=window.location.hash||"#/";return!!(t===e||e==="#/stories/add"&&t.includes("#/stories/add")||e==="#/stories"&&t.includes("#/stories/")&&!t.includes("#/stories/add"))}}customElements.define("app-sidebar",de);const ue=(r,e)=>e.some(t=>r instanceof t);let V,j;function he(){return V||(V=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function me(){return j||(j=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const K=new WeakMap,D=new WeakMap,X=new WeakMap,T=new WeakMap,R=new WeakMap;function pe(r){const e=new Promise((t,o)=>{const a=()=>{r.removeEventListener("success",i),r.removeEventListener("error",s)},i=()=>{t(w(r.result)),a()},s=()=>{o(r.error),a()};r.addEventListener("success",i),r.addEventListener("error",s)});return e.then(t=>{t instanceof IDBCursor&&K.set(t,r)}).catch(()=>{}),R.set(e,r),e}function fe(r){if(D.has(r))return;const e=new Promise((t,o)=>{const a=()=>{r.removeEventListener("complete",i),r.removeEventListener("error",s),r.removeEventListener("abort",s)},i=()=>{t(),a()},s=()=>{o(r.error||new DOMException("AbortError","AbortError")),a()};r.addEventListener("complete",i),r.addEventListener("error",s),r.addEventListener("abort",s)});D.set(r,e)}let x={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return D.get(r);if(e==="objectStoreNames")return r.objectStoreNames||X.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return w(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function ge(r){x=r(x)}function we(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const o=r.call(I(this),e,...t);return X.set(o,e.sort?e.sort():[e]),w(o)}:me().includes(r)?function(...e){return r.apply(I(this),e),w(K.get(this))}:function(...e){return w(r.apply(I(this),e))}}function ve(r){return typeof r=="function"?we(r):(r instanceof IDBTransaction&&fe(r),ue(r,he())?new Proxy(r,x):r)}function w(r){if(r instanceof IDBRequest)return pe(r);if(T.has(r))return T.get(r);const e=ve(r);return e!==r&&(T.set(r,e),R.set(e,r)),e}const I=r=>R.get(r);function ye(r,e,{blocked:t,upgrade:o,blocking:a,terminated:i}={}){const s=indexedDB.open(r,e),c=w(s);return o&&s.addEventListener("upgradeneeded",n=>{o(w(s.result),n.oldVersion,n.newVersion,w(s.transaction),n)}),t&&s.addEventListener("blocked",n=>t(n.oldVersion,n.newVersion,n)),c.then(n=>{i&&n.addEventListener("close",()=>i()),a&&n.addEventListener("versionchange",u=>a(u.oldVersion,u.newVersion,u))}).catch(()=>{}),c}const be=["get","getKey","getAll","getAllKeys","count"],_e=["put","add","delete","clear"],A=new Map;function G(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(A.get(e))return A.get(e);const t=e.replace(/FromIndex$/,""),o=e!==t,a=_e.includes(t);if(!(t in(o?IDBIndex:IDBObjectStore).prototype)||!(a||be.includes(t)))return;const i=async function(s,...c){const n=this.transaction(s,a?"readwrite":"readonly");let u=n.store;return o&&(u=u.index(c.shift())),(await Promise.all([u[t](...c),a&&n.done]))[0]};return A.set(e,i),i}ge(r=>({...r,get:(e,t,o)=>G(e,t)||r.get(e,t,o),has:(e,t)=>!!G(e,t)||r.has(e,t)}));const F=ye(l.DATABASE_NAME,l.DATABASE_VERSION,{upgrade(r){r.objectStoreNames.contains(l.OBJECT_STORE_NAME)||r.createObjectStore(l.OBJECT_STORE_NAME,{keyPath:"id"})}});async function W(r){if(!Array.isArray(r)||r.length===0)return;const t=(await F).transaction(l.OBJECT_STORE_NAME,"readwrite");for(const o of r)t.store.put(o);await t.done}async function Q(){return await(await F).getAll(l.OBJECT_STORE_NAME)||[]}async function Se(r){const t=(await F).transaction(l.OBJECT_STORE_NAME,"readwrite");await t.store.delete(r),await t.done}class Ee{constructor({view:e}){this._view=e,this._page=1,this._hasMoreData=!0,this._isLoading=!1,this._includeLocation=!1}async init(){try{this._view.renderPage(),this._setupEventListeners(),await this._loadInitialStories()}catch(e){console.error("Error in HomePresenter.init:",e),this._view.showError("Error initializing page. Please try refreshing.")}}_setupEventListeners(){try{this._view.setLoadMoreCallback(async()=>{await this._loadMoreStories()}),this._view.setLocationFilterCallback(e=>{this._includeLocation=e,this._page=1,this._hasMoreData=!0,this._loadInitialStories()})}catch(e){console.error("Error setting up event listeners:",e)}}async _loadInitialStories(){if(!this._isLoading){this._isLoading=!0,this._page=1;try{this._view.clearStories(),this._view.showLoading();const e=localStorage.getItem("token");if(!e){this._view.showLoginRequired();return}console.log("Fetching initial stories, page:",this._page,"location:",this._includeLocation?1:0);const t=await v.getAllStories({token:e,page:this._page,location:this._includeLocation?1:0});if(t.error){this._view.showError(t.message||"Gagal memuat cerita");return}if(!t||typeof t!="object"){console.error("Invalid response format:",t),this._view.showError("Format respons server tidak valid");return}const o=t.listStory||[],a=t.size||10;if(console.log("Received stories:",o.length),!Array.isArray(o)){console.error("Stories is not an array:",o),this._view.showError("Format data cerita tidak valid");return}o.length===0?(this._view.showEmptyState(),this._hasMoreData=!1):(await W(o),this._view.renderStories(o),this._hasMoreData=o.length===a,this._view.updateLoadMoreButton(this._hasMoreData))}catch(e){console.error("Error loading initial stories:",e);const t=await Q();t&&t.length>0?(this._view.renderStories(t),this._view.showOfflineMessage()):this._view.showError(e.message||"Gagal memuat cerita")}finally{this._isLoading=!1,this._view.hideLoading()}}}async _loadMoreStories(){if(!(this._isLoading||!this._hasMoreData)){this._isLoading=!0,this._page+=1;try{this._view.showLoadingMore();const e=localStorage.getItem("token");if(!e){this._view.showLoginRequired();return}console.log("Fetching more stories, page:",this._page,"location:",this._includeLocation?1:0);const t=await v.getAllStories({token:e,page:this._page,location:this._includeLocation?1:0});if(t.error){this._view.showError(t.message||"Gagal memuat cerita tambahan");return}if(!t||typeof t!="object"){console.error("Invalid response format:",t),this._view.showError("Format respons server tidak valid");return}const o=t.listStory||[],a=t.size||10;if(console.log("Received more stories:",o.length),!Array.isArray(o)){console.error("Stories is not an array:",o),this._view.showError("Format data cerita tidak valid");return}o.length>0?(await W(o),this._view.appendStories(o),this._hasMoreData=o.length===a):this._hasMoreData=!1,this._view.updateLoadMoreButton(this._hasMoreData)}catch(e){console.error("Error loading more stories:",e),this._view.showError(e.message||"Gagal memuat cerita tambahan")}finally{this._isLoading=!1,this._view.hideLoadingMore()}}}}class Le{constructor(){this._presenter=new Ee({view:this}),this._debouncedScroll=ie(this._handleScroll.bind(this),200)}renderPage(){this._setupInfiniteScroll(),this._setupOfflineListener()}async render(){return`
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
    `}async afterRender(){this._presenter.init()}setLoadMoreCallback(e){const t=document.querySelector("#load-more");t&&t.addEventListener("click",e)}setLocationFilterCallback(e){const t=document.querySelector("#include-location");t&&t.addEventListener("change",o=>{e(o.target.checked)})}_setupInfiniteScroll(){window.addEventListener("scroll",this._debouncedScroll)}_handleScroll(){const e=document.querySelector("#load-more");if(!e||e.style.display==="none"||e.disabled)return;const t=window.scrollY,o=document.documentElement.clientHeight,a=document.documentElement.scrollHeight;o+t>=a-100&&e.click()}_setupOfflineListener(){window.addEventListener("online",()=>{this._presenter.init()})}showLoading(){const e=document.querySelector("app-loader");e&&e.show("Loading stories...")}hideLoading(){const e=document.querySelector("app-loader");e&&e.hide()}showLoadingMore(){const e=document.querySelector("#loading-more");e&&e.classList.remove("hidden")}hideLoadingMore(){const e=document.querySelector("#loading-more");e&&e.classList.add("hidden")}clearStories(){const e=document.querySelector("#stories-list");e&&(e.innerHTML="");const t=document.querySelector("#empty-state");t&&t.classList.add("hidden")}renderStories(e){const t=document.querySelector("#stories-list");if(!t)return;if(!e||!Array.isArray(e)){console.error("Invalid stories data:",e);return}e.filter(a=>a&&typeof a=="object").forEach((a,i)=>{try{const s=document.createElement("app-card");s.story=a,t.appendChild(s),window.matchMedia("(prefers-reduced-motion: no-preference)").matches&&s.animate([{opacity:0,transform:"translateY(20px)"},{opacity:1,transform:"translateY(0)"}],{duration:300,easing:"ease-out",delay:i*50})}catch(s){console.error("Error rendering story card:",s,{story:a})}})}appendStories(e){const t=document.querySelector("#stories-list");if(!t)return;if(!e||!Array.isArray(e)){console.error("Invalid stories data:",e);return}const o=e.filter(a=>a&&typeof a=="object");if(o.length===0){console.warn("No valid stories to append");return}t.childElementCount,o.forEach((a,i)=>{try{const s=document.createElement("app-card");s.story=a,t.appendChild(s),window.matchMedia("(prefers-reduced-motion: no-preference)").matches&&s.animate([{opacity:0,transform:"translateY(20px)"},{opacity:1,transform:"translateY(0)"}],{duration:300,easing:"ease-out",delay:i*50})}catch(s){console.error("Error appending story card:",s,{story:a})}})}updateLoadMoreButton(e){const t=document.querySelector("#load-more");t&&(e?(t.style.display="flex",t.disabled=!1):(t.style.display="none",t.disabled=!0))}showEmptyState(){const e=document.querySelector("#empty-state");e&&e.classList.remove("hidden");const t=document.querySelector("#load-more");t&&(t.style.display="none")}showLoginRequired(){Swal.fire({icon:"warning",title:"Login Required",text:"You need to login to view stories",confirmButtonText:"Login Now",confirmButtonColor:"#4361ee"}).then(e=>{e.isConfirmed&&(window.location.hash="#/login")})}showOfflineMessage(){window.showToast&&window.showToast("Anda sedang offline. Menampilkan data tersimpan.","info")}showError(e){Swal.fire({icon:"error",title:"Error",text:e||"Failed to load stories",confirmButtonColor:"#4361ee"})}}class ke{async render(){return`
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
                Dicoding Story is a platform for sharing programming and technology 
                learning experiences. This app was created as a submission project 
                for Dicoding's "Menjadi Front-End Web Developer Expert" class.
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
              </ul>
            </div>
            
            <div class="about-card" id="about-tech">
              <h2><i class="fas fa-code"></i> Technology Stack</h2>
              <div class="tech-stack">
                <div class="tech-item">
                  <i class="fab fa-html5"></i>
                  <span>HTML5</span>
                </div>
                <div class="tech-item">
                  <i class="fab fa-css3-alt"></i>
                  <span>CSS3</span>
                </div>
                <div class="tech-item">
                  <i class="fab fa-js"></i>
                  <span>JavaScript</span>
                </div>
                <div class="tech-item">
                  <i class="fas fa-map-marked-alt"></i>
                  <span>Leaflet.js</span>
                </div>
                <div class="tech-item">
                  <i class="fas fa-mobile-alt"></i>
                  <span>PWA</span>
                </div>
                <div class="tech-item">
                  <i class="fas fa-server"></i>
                  <span>REST API</span>
                </div>
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
            </div>
          </div>
        </section>
      </main>
      <app-footer></app-footer>
    `}async afterRender(){window.matchMedia("(prefers-reduced-motion: no-preference)").matches&&[document.getElementById("about-app"),document.getElementById("about-features"),document.getElementById("about-tech"),document.getElementById("about-developer")].forEach((t,o)=>{t&&(t.style.opacity="0",t.style.transform="translateY(20px)",t.style.transition="opacity 0.3s ease, transform 0.3s ease",setTimeout(()=>{t.style.opacity="1",t.style.transform="translateY(0)"},o*100+300))})}}class Ce{async render(){return`
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="auth-container">
          <h1 class="auth-title">
            <i class="fas fa-sign-in-alt"></i>
            Login
          </h1>
          
          <form id="login-form" class="auth-form" novalidate>
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
          
          
        </section>
      </main>
      <app-footer></app-footer>
      <app-loader></app-loader>
    `}async afterRender(){this._setupForm(),this._setupInputValidation(),this._checkRememberedUser()}_setupForm(){const e=document.querySelector("#login-form");e&&e.addEventListener("submit",async t=>{if(t.preventDefault(),!this._validateForm())return;const o=e.querySelector("#email").value.trim(),a=e.querySelector("#password").value.trim(),i=e.querySelector("#remember-me").checked,s=document.querySelector("app-loader");s&&s.show("Authenticating...");try{const c=await v.login({email:o,password:a});localStorage.setItem("token",c.loginResult.token),localStorage.setItem("user",JSON.stringify(c.loginResult.user)),i?localStorage.setItem("rememberedEmail",o):localStorage.removeItem("rememberedEmail"),await Swal.fire({icon:"success",title:"Login successful!",showConfirmButton:!1,timer:1500}),window.location.hash="#/"}catch(c){console.error("Login failed:",c),Swal.fire({icon:"error",title:"Login failed",text:c.message||"Invalid email or password",confirmButtonColor:"#4361ee"})}finally{s&&s.hide()}})}_setupInputValidation(){const e=document.querySelector("#email"),t=document.querySelector("#password");e&&e.addEventListener("input",()=>{this._validateEmail()}),t&&t.addEventListener("input",()=>{this._validatePassword()})}_validateForm(){const e=this._validateEmail(),t=this._validatePassword();return e&&t}_validateEmail(){const e=document.querySelector("#email"),t=document.querySelector("#email-error");if(!e||!t)return!1;const o=e.value.trim();return o?Z(o)?(t.textContent="",!0):(t.textContent="Please enter a valid email address",!1):(t.textContent="Email is required",!1)}_validatePassword(){const e=document.querySelector("#password"),t=document.querySelector("#password-error");if(!e||!t)return!1;const o=e.value.trim();return o?o.length<8?(t.textContent="Password must be at least 8 characters",!1):(t.textContent="",!0):(t.textContent="Password is required",!1)}_checkRememberedUser(){const e=localStorage.getItem("rememberedEmail"),t=document.querySelector("#email"),o=document.querySelector("#remember-me");e&&t&&(t.value=e,o&&(o.checked=!0),document.querySelector("#password").focus())}}class Te{async render(){return`
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="auth-container">
          <h1 class="auth-title">
            <i class="fas fa-user-plus"></i>
            Register
          </h1>
          
          <form id="register-form" class="auth-form" novalidate>
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
          
          
        </section>
      </main>
      <app-footer></app-footer>
      <app-loader></app-loader>
    `}async afterRender(){this._setupForm(),this._setupInputValidation()}_setupForm(){const e=document.querySelector("#register-form");e&&e.addEventListener("submit",async t=>{if(t.preventDefault(),!this._validateForm())return;const o=e.querySelector("#name").value.trim(),a=e.querySelector("#email").value.trim(),i=e.querySelector("#password").value.trim(),s=document.querySelector("app-loader");s&&s.show("Creating account...");try{await v.register({name:o,email:a,password:i}),await Swal.fire({icon:"success",title:"Registration successful!",text:"Please login with your new account",confirmButtonColor:"#4361ee"}),window.location.hash="#/login",e.reset()}catch(c){console.error("Registration failed:",c),Swal.fire({icon:"error",title:"Registration failed",text:c.message||"Email may already be registered",confirmButtonColor:"#4361ee"})}finally{s&&s.hide()}})}_setupInputValidation(){const e=document.querySelector("#name"),t=document.querySelector("#email"),o=document.querySelector("#password");e&&e.addEventListener("input",()=>{this._validateName()}),t&&t.addEventListener("input",()=>{this._validateEmail()}),o&&o.addEventListener("input",()=>{this._validatePassword()})}_validateForm(){const e=this._validateName(),t=this._validateEmail(),o=this._validatePassword();return e&&t&&o}_validateName(){const e=document.querySelector("#name"),t=document.querySelector("#name-error");if(!e||!t)return!1;const o=e.value.trim();return o?o.length<3?(t.textContent="Name must be at least 3 characters",!1):(t.textContent="",!0):(t.textContent="Name is required",!1)}_validateEmail(){const e=document.querySelector("#email"),t=document.querySelector("#email-error");if(!e||!t)return!1;const o=e.value.trim();return o?Z(o)?(t.textContent="",!0):(t.textContent="Please enter a valid email address",!1):(t.textContent="Email is required",!1)}_validatePassword(){const e=document.querySelector("#password"),t=document.querySelector("#password-error");if(!e||!t)return!1;const o=e.value.trim();return o?o.length<8?(t.textContent="Password must be at least 8 characters",!1):(t.textContent="",!0):(t.textContent="Password is required",!1)}}class Ie{constructor({view:e,id:t}){this._view=e,this._id=t,this._map=null,this._story=null,this._mapInitialized=!1}async init(){this._view.renderPage(),await this._loadStoryDetail(),this._setupOnlineListener(),this._setupActions()}async _loadStoryDetail(){try{this._view.showLoading();const e=localStorage.getItem("token");if(!e){this._view.showLoginRequired();return}const t=this._getCachedStory();try{const o=await v.getStoryDetail({token:e,id:this._id});if(o.error)throw new Error(o.message||"Gagal memuat cerita");this._story=o.story,this._cacheStory(o.story),this._view.renderStoryDetail(o.story),this._view.hideOfflineMessage(),this._story.lat&&this._story.lon&&this._initMapWithDelay(300)}catch(o){console.error("API error:",o),t?(console.log("Loading from cache instead"),this._story=t,this._view.renderStoryDetail(t),this._view.showOfflineMessage(),t.lat&&t.lon&&!this._mapInitialized&&this._initMapWithDelay(300)):this._view.showError(o.message)}}catch(e){console.error("Unexpected error:",e);const t=this._getCachedStory();t?(this._story=t,this._view.renderStoryDetail(t),this._view.showOfflineMessage(),t.lat&&t.lon&&!this._mapInitialized&&this._initMapWithDelay(300)):this._view.showError("Terjadi kesalahan. Silakan coba lagi.")}finally{this._view.hideLoading()}}_setupOnlineListener(){window.addEventListener("online",()=>{this._story?this._view.hideOfflineMessage():this._loadStoryDetail()}),window.addEventListener("offline",()=>{this._story&&this._view.showOfflineMessage()})}_initMapWithDelay(e=100){if(!window.L){console.error("Leaflet library not available");return}setTimeout(()=>{this._initMap()},e)}_initMap(){if(this._mapInitialized)return;if(!this._story){console.error("Cannot initialize map: story is undefined");return}const e=parseFloat(this._story.lat),t=parseFloat(this._story.lon);if(isNaN(e)||isNaN(t)){console.error("Cannot initialize map: invalid coordinates",{lat:this._story.lat,lon:this._story.lon});return}const o=this._view.getMapContainer();if(!o){console.error("Cannot initialize map: container not found");return}try{console.log("Initializing map with coordinates:",e,t),this._map=L.map(o).setView([e,t],13);const a=this._createBaseMaps();a.Street.addTo(this._map),L.control.layers(a,{},{position:"topright"}).addTo(this._map),this._addStoryMarker(),this._addLocateControl(),this._updateMapSize(),this._mapInitialized=!0,console.log("Map initialization complete")}catch(a){console.error("Error initializing map:",a),this._view.showMapError()}}_createBaseMaps(){const e={};return e.Street=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}),e.Satellite=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",maxZoom:19}),e.Dark=L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',maxZoom:19}),e.Topographic=L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',maxZoom:17}),e}_addStoryMarker(){if(!this._map){console.error("Cannot add marker: map is not initialized");return}if(!this._story){console.error("Cannot add marker: story is undefined");return}try{const e=parseFloat(this._story.lat),t=parseFloat(this._story.lon);if(isNaN(e)||isNaN(t)){console.error("Cannot add marker: invalid coordinates",{lat:this._story.lat,lon:this._story.lon});return}const o=this._story.name||"Untitled Story",a=this._story.description||"",i=`
        <div class="custom-popup">
          <h3>${o}</h3>
          <p>${a.substring(0,100)}${a.length>100?"...":""}</p>
        </div>
      `;L.marker([e,t]).addTo(this._map).bindPopup(i).openPopup(),console.log("Marker added successfully")}catch(e){console.error("Error adding marker:",e)}}_addLocateControl(){this._map&&L.control.locate({position:"topright",strings:{title:"Show my location"},locateOptions:{enableHighAccuracy:!0}}).addTo(this._map)}_updateMapSize(){this._map&&(setTimeout(()=>{this._map.invalidateSize()},300),window.addEventListener("resize",()=>{this._map&&this._map.invalidateSize()}))}_cacheStory(e){try{const t={...e,cachedAt:new Date().toISOString()};localStorage.setItem(`story_${e.id}`,JSON.stringify(t));const o=JSON.parse(localStorage.getItem("cachedStories")||"[]"),a=o.map(s=>s.id===e.id?t:s);o.some(s=>s.id===e.id)||a.push(t);const i=a.slice(0,50);localStorage.setItem("cachedStories",JSON.stringify(i))}catch(t){console.error("Error caching story:",t)}}_getCachedStory(){try{const e=localStorage.getItem(`story_${this._id}`);if(e)try{const o=JSON.parse(e);return!o||typeof o!="object"?(console.error("Invalid cached story format:",o),null):(o.name=o.name||"Unknown User",o.description=o.description||"",o.photoUrl=o.photoUrl||"./images/placeholder.jpg",o.createdAt=o.createdAt||new Date().toISOString(),o)}catch(o){return console.error("Error parsing cached story:",o),localStorage.removeItem(`story_${this._id}`),null}const t=localStorage.getItem("cachedStories");if(!t)return null;try{const o=JSON.parse(t);if(!Array.isArray(o))return console.error("Cached stories is not an array:",o),null;const a=o.find(i=>i&&i.id===this._id);return a?(a.name=a.name||"Unknown User",a.description=a.description||"",a.photoUrl=a.photoUrl||"./images/placeholder.jpg",a.createdAt=a.createdAt||new Date().toISOString(),a):null}catch(o){return console.error("Error parsing cached stories:",o),null}}catch(e){return console.error("Error reading cached story:",e),null}}_setupActions(){navigator.share&&(this._view.showShareButton(),this._view.setShareButtonCallback(()=>this._shareStory())),this._view.setFavoriteButtonCallback(e=>{this._toggleFavorite(e)})}async _shareStory(){if(this._story)try{const e={title:`Cerita dari ${this._story.name}`,text:this._story.description,url:window.location.href};await navigator.share(e),window.showToast&&window.showToast("Cerita berhasil dibagikan!","success")}catch(e){console.error("Error sharing story:",e),e.name!=="AbortError"&&window.showToast&&window.showToast("Gagal membagikan cerita","error")}}_toggleFavorite(e){if(this._story)try{const t=localStorage.getItem("favoriteStories");let o=t?JSON.parse(t):[];e?o.includes(this._story.id)||(o.push(this._story.id),window.showToast&&window.showToast("Ditambahkan ke favorit!","success")):(o=o.filter(a=>a!==this._story.id),window.showToast&&window.showToast("Dihapus dari favorit","info")),localStorage.setItem("favoriteStories",JSON.stringify(o))}catch(t){console.error("Error toggling favorite:",t)}}}class Ae{constructor(){const{id:e}=this._getUrlParams();this._id=e,this._presenter=new Ie({view:this,id:this._id}),this._mapContainer=null}renderPage(){if(!this._id){this.showInvalidIdError();return}}async render(){return`
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
              <i class="fas fa-wifi-slash"></i> You are currently offline. 
              Some features may be limited.
            </div>
        </section>
      </main>
      <app-footer></app-footer>
      <app-loader></app-loader>
    `}async afterRender(){this._presenter.init()}renderStoryDetail(e){const t=document.querySelector("#story-content");if(!e||!t)return;const o=e.name||"Unknown User",a=e.description||"No description provided",i=e.photoUrl||"./images/placeholder.jpg",s=e.createdAt||new Date().toISOString(),c=Y(s,"id-ID",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}),n=this._getUserColor(o),u=`story-title-${e.id}`,h=`story-desc-${e.id}`,m=this._isInFavorites(e.id);t.innerHTML=`
      <article class="story-detail-item" id="story-article" aria-labelledby="${u}">
        <div class="story-image-wrapper">
        <img 
          class="story-detail-image" 
            src="${i}" 
            alt="Photo shared by ${o}" 
          loading="lazy"
            onerror="this.src='./images/placeholder.jpg'"
          >
          <div class="story-image-overlay">
            <div class="story-image-badge" style="background-color: ${n}">
              <i class="fas fa-camera-retro" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        
        <div class="story-detail-content">
          <div class="story-header">
            <div class="story-user">
              <div class="user-avatar" aria-hidden="true" style="background-color: ${n}">
                ${this._getInitials(o)}
              </div>
              <div>
                <h1 class="story-name" id="${u}">${o}</h1>
                <time class="story-date" datetime="${s}">
                  <i class="far fa-calendar-alt" aria-hidden="true"></i> ${c}
                </time>
              </div>
            </div>
            
            <div class="story-actions-top">
              <button id="favorite-button" class="icon-button ${m?"active":""}" aria-label="${m?"Remove from favorites":"Add to favorites"}">
                <i class="fas fa-heart" aria-hidden="true"></i>
              </button>
              
              <button id="share-button" class="icon-button hidden" aria-label="Share this story">
                <i class="fas fa-share-alt" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          
          <div class="story-body">
            <p class="story-description" id="${h}">${a}</p>
          </div>
          
          ${e.lat&&e.lon?`
                <div class="story-location">
                  <h2 class="section-title">
                  <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                  Location
                </h2>
                  <div class="story-map-container">
                    <div class="story-map-large" id="detail-map" tabindex="0" 
                         aria-label="Map showing the location of ${o}'s story"></div>
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
            
           
            
            <a href="#/stories/add" class="action-button" aria-label="Share your own story">
              <i class="fas fa-plus-circle" aria-hidden="true"></i>
              Share Your Story
            </a>
          </div>
        </div>
      </article>
    `,e.lat&&e.lon&&(this._mapContainer=document.getElementById("detail-map")),this._setupFavoriteButton(m)}getMapContainer(){return this._mapContainer}showLoading(){const e=document.querySelector("app-loader");e&&e.show("Loading story...")}hideLoading(){const e=document.querySelector("app-loader");e&&e.hide()}showOfflineMessage(){const e=document.getElementById("offline-notice");e&&e.classList.remove("hidden")}hideOfflineMessage(){const e=document.getElementById("offline-notice");e&&e.classList.add("hidden")}showOfflineNoDataMessage(){Swal.fire({icon:"warning",title:"Offline",text:"This story is not available offline. Please connect to the internet and try again.",confirmButtonColor:"#4361ee"}).then(()=>{window.location.hash="#/"})}showLoginRequired(){Swal.fire({icon:"warning",title:"Login Required",text:"Please login to view story details",confirmButtonText:"Login Now",confirmButtonColor:"#4361ee"}).then(()=>{window.location.hash="#/login"})}showInvalidIdError(){Swal.fire({icon:"error",title:"Invalid Story ID",text:"The story ID is missing or invalid",confirmButtonColor:"#4361ee"}).then(()=>{window.location.hash="#/"})}showError(e){Swal.fire({icon:"error",title:"Error",text:e||"Failed to load story",confirmButtonColor:"#4361ee"}).then(()=>{window.location.hash="#/"})}showTimeoutError(){const e=document.getElementById("offline-notice");e&&(e.innerHTML=`
        <i class="fas fa-exclamation-triangle"></i> 
        Server response is slow. Showing cached data if available.
      `,e.classList.remove("hidden"),e.style.backgroundColor="#f8961e"),Swal.fire({icon:"warning",title:"Connection Issue",text:"The server is taking too long to respond. We'll try to show cached data if available.",confirmButtonColor:"#4361ee",showCancelButton:!0,cancelButtonText:"Back to Home",confirmButtonText:"Continue with Cache"}).then(t=>{t.isConfirmed||(window.location.hash="#/")})}showMapError(){const e=document.querySelector(".story-map-container");e&&(e.innerHTML=`
        <div class="map-error-container">
          <div class="map-error-message">
            <i class="fas fa-map-marked-alt"></i>
            <p>Failed to load map. Please try refreshing the page.</p>
          </div>
        </div>
      `)}_getUrlParams(){const t=window.location.hash.match(/#\/stories\/([^/]+)$/);return{id:t?t[1]:null}}_getInitials(e){return!e||typeof e!="string"?"U":e.split(" ").map(t=>t.charAt(0)).join("").toUpperCase().substring(0,2)}_getUserColor(e){const t=["#4361ee","#3f37c9","#4895ef","#4cc9f0","#f72585","#7209b7","#3a0ca3","#4cc9f0","#f72585","#f8961e"],o=e.split("").reduce((a,i)=>i.charCodeAt(0)+((a<<5)-a),0);return t[Math.abs(o)%t.length]}_isInFavorites(e){try{const t=localStorage.getItem("favoriteStories");if(!t)return!1;const o=JSON.parse(t);return Array.isArray(o)&&o.includes(e)}catch(t){return console.error("Error checking favorites:",t),!1}}_setupFavoriteButton(e){const t=document.getElementById("favorite-button");t&&t.addEventListener("click",()=>{const a=!t.classList.contains("active");a?(t.classList.add("active"),t.setAttribute("aria-label","Remove from favorites")):(t.classList.remove("active"),t.setAttribute("aria-label","Add to favorites")),this._favoriteCallback&&this._favoriteCallback(a)})}setFavoriteButtonCallback(e){this._favoriteCallback=e}showShareButton(){const e=document.getElementById("share-button");e&&e.classList.remove("hidden")}setShareButtonCallback(e){const t=document.getElementById("share-button");t&&t.addEventListener("click",e)}animateRemoval(e){const t=document.getElementById("story-article");if(!t){e&&e();return}t.style.transition="all 0.5s ease-out",t.style.opacity="0",t.style.transform="scale(0.9)",setTimeout(()=>{e&&e()},500)}cancelRemovalAnimation(){const e=document.getElementById("story-article");e&&(e.style.opacity="1",e.style.transform="scale(1)")}}class Pe{constructor({view:e}){this._view=e,this._photoFile=null,this._map=null,this._marker=null,this._cameraStream=null,this._mapInitialized=!1,window.addEventListener("hashchange",()=>{this.stopCamera()}),window.addEventListener("beforeunload",()=>{this.stopCamera()})}init(){this._setupForm(),this._setupPhotoPreview(),this._setupCamera(),this._setupLocationCheckbox(),this._setupInputValidation(),this._setupAutoSaveDraft(),this._checkMediaPermissions()}loadRecentDrafts(){try{const e=localStorage.getItem("recentDrafts");if(!e){this._view.displayRecentDrafts([]);return}const t=JSON.parse(e);this._view.displayRecentDrafts(t)}catch(e){console.error("Error loading recent drafts:",e),this._view.displayRecentDrafts([])}}useDraft(e){try{const t=localStorage.getItem("recentDrafts");if(!t)return;const a=JSON.parse(t).find(i=>i.id===e);if(a){let i=a.fullDescription||a.description;this._view.applyDraftToForm(i)}}catch(t){console.error("Error using draft:",t)}}_checkMediaPermissions(){navigator.permissions&&navigator.permissions.query&&navigator.permissions.query({name:"camera"}).then(e=>{if(console.log("Camera permission status:",e.state),e.state==="denied"){const t=document.querySelector("#camera-button");t&&(t.classList.add("permission-denied"),t.title="Camera permission denied. Please update your browser settings.")}e.onchange=()=>{console.log("Camera permission status changed to:",e.state);const t=document.querySelector("#camera-button");t&&(e.state==="denied"?(t.classList.add("permission-denied"),t.title="Camera permission denied. Please update your browser settings."):(t.classList.remove("permission-denied"),t.title=""))}}).catch(e=>{console.log("Error checking camera permission:",e)})}stopCamera(){if(this._cameraStream){try{this._cameraStream.getTracks().forEach(t=>t.stop())}catch(e){console.error("Error stopping camera tracks:",e)}this._cameraStream=null,this._view&&this._view.resetCameraUI()}}_setupAutoSaveDraft(){let e;const t=document.querySelector("#description");t&&t.addEventListener("input",()=>{clearTimeout(e),e=setTimeout(()=>{this._saveDraft(t.value)},3e4)})}_saveDraft(e){if(!(!e||e.trim().length<5))try{const t=localStorage.getItem("recentDrafts");let o=t?JSON.parse(t):[];const a=e.substring(0,50)+(e.length>50?"...":""),i={id:Date.now().toString(),description:a,fullDescription:e,timestamp:new Date().toISOString()};o.unshift(i),o=o.slice(0,5),localStorage.setItem("recentDrafts",JSON.stringify(o)),window.showToast&&window.showToast("Draft saved automatically","info")}catch(t){console.error("Error saving draft:",t)}}_setupForm(){this._view.setSubmitCallback(async e=>{const t=localStorage.getItem("token");if(!t){await this._view.showLoginRequiredAlert(),window.location.hash="#/login";return}if(!this._validateForm()){this._view.showFormValidationError();return}if(!e.has("description")||!e.get("description").trim()){this._view.showDescriptionError("Description is required"),this._view.showFormValidationError();return}if(!e.has("photo")||!e.get("photo"))if(this._photoFile)e.set("photo",this._photoFile);else{this._view.showPhotoError("Please select or take a photo"),this._view.showFormValidationError();return}this._view.showLoader("Saving your story..."),this._view.showProgressBar();try{await v.addNewStory({token:t,data:e,onProgress:o=>{this._view.updateProgressBar(o)}}),this._view.updateProgressBar(100),setTimeout(()=>{this._view.hideProgressBar()},500),await this._view.showSuccessAlert(),this._view.showConfetti(),this._addToRecents(e.get("description")),setTimeout(()=>{window.location.hash="#/",this._view.resetForm(),this.stopCamera()},1e3)}catch(o){this._view.hideProgressBar(),this._view.showErrorAlert(o.message)}finally{this._view.hideLoader()}})}_setupPhotoPreview(){this._view.setPhotoInputCallback(e=>{if(e){if(e.size>l.MAX_PHOTO_SIZE){this._view.showPhotoError(`File too large. Maximum size is ${C(l.MAX_PHOTO_SIZE)}`);return}if(!["image/jpeg","image/png","image/jpg"].includes(e.type)){this._view.showPhotoError("Only JPEG and PNG images are allowed");return}this._photoFile=e,this._view.clearPhotoError(),this._view.showPhotoPreview(e)}})}_setupCamera(){this._view.setOpenCameraCallback(async()=>{try{if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error("Your browser does not support camera access");this.stopCamera();const e=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:1280},height:{ideal:720}},audio:!1});this._cameraStream=e,this._view.showCameraStream(e),window.addEventListener("beforeunload",()=>{this.stopCamera()},{once:!0})}catch(e){if(console.error("Error accessing camera:",e),e.name==="NotAllowedError")this._view.showCameraError("Camera access denied. Please allow camera access in your browser settings.");else if(e.name==="NotFoundError")this._view.showCameraError("No camera found on your device or camera is in use by another application.");else if(e.name==="NotReadableError")this._view.showCameraError("Could not access camera. Your camera might be in use by another application.");else if(e.name==="OverconstrainedError")try{const t=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1});this._cameraStream=t,this._view.showCameraStream(t)}catch{this._view.showCameraError("Could not access camera with requested settings. Please try a different device.")}else this._view.showCameraError("Could not access camera: "+(e.message||"Unknown error"))}}),this._view.setTakePhotoCallback(()=>{if(!this._cameraStream){console.error("Cannot take photo: Camera stream is not available"),this._view.showCameraError("Camera is not ready. Please try again.");return}try{const e=this._view.capturePhoto();if(!e){console.error("Failed to capture photo: null data URL"),this._view.showCameraError("Failed to capture photo");return}this._view.showCameraFlash();const t="camera-photo-"+new Date().getTime()+".jpg",o=this._dataURLToFile(e,t);if(!o){console.error("Failed to convert data URL to file"),this._view.showCameraError("Failed to process captured photo");return}if(o.size>l.MAX_PHOTO_SIZE){this._view.showPhotoError(`File too large. Maximum size is ${C(l.MAX_PHOTO_SIZE)}`);return}this._photoFile=o,this._view.showPhotoPreview(o),window.showToast&&window.showToast("Photo captured successfully!","success"),setTimeout(()=>{this.stopCamera()},500)}catch(e){console.error("Error taking photo:",e),this._view.showCameraError("Error capturing photo: "+e.message)}}),this._view.setCloseCameraCallback(()=>{this.stopCamera()})}_dataURLToFile(e,t){try{if(!e||typeof e!="string"||!e.startsWith("data:image/"))return console.error("Invalid data URL format"),null;const o=e.split(",");if(o.length!==2)return console.error("Invalid data URL structure"),null;const a=o[0].match(/:(.*?);/);if(!a||a.length<2)return console.error("Could not extract MIME type from data URL"),null;const i=a[1],s=atob(o[1]);let c=s.length;const n=new Uint8Array(c);for(;c--;)n[c]=s.charCodeAt(c);return new File([n],t,{type:i})}catch(o){return console.error("Error converting data URL to file:",o),null}}_setupLocationCheckbox(){this._view.setLocationCheckboxCallback(e=>{e?(this._view.showMapContainer(),this._mapInitialized?this._map&&this._map.invalidateSize():setTimeout(()=>{this._initMap()},300)):this._view.hideMapContainer()})}_setupInputValidation(){this._view.setDescriptionInputCallback(e=>{this._validateDescription(e)})}_validateDescription(e){return e?e.length<10?(this._view.showDescriptionError("Description must be at least 10 characters"),!1):["judi","poker","togel","seks","adult","xxx"].some(a=>e.toLowerCase().includes(a))?(this._view.showDescriptionError("Your story may contain inappropriate content. Please revise."),!1):(this._view.clearDescriptionError(),!0):(this._view.showDescriptionError("Please enter a description"),!1)}_validateForm(){const e=this._validateDescription(this._view.getDescription()),t=this._validatePhoto();return e&&t}_validatePhoto(){if(!this._photoFile){const e=document.querySelector("#photo");if(e&&e.files.length>0)this._photoFile=e.files[0];else{const t=document.querySelector("#photo-preview img");if(!t||t.classList.contains("hidden"))return this._view.showPhotoError("Please select or take a photo"),!1}}return this._photoFile&&this._photoFile.size>l.MAX_PHOTO_SIZE?(this._view.showPhotoError(`File too large. Maximum size is ${C(l.MAX_PHOTO_SIZE)}`),!1):!0}_initMap(){if(!window.L){console.error("Leaflet library not loaded!"),this._view.showMapError("Map library not loaded. Please check your internet connection and reload the page.");return}try{if(!document.getElementById("map")){console.error("Map container element not found");return}if(console.log("Initializing map..."),this._map=L.map("map",{zoomControl:!0,attributionControl:!0}).setView(l.DEFAULT_MAP_CENTER,l.DEFAULT_MAP_ZOOM),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(this._map),setTimeout(()=>{this._map&&(console.log("Invalidating map size"),this._map.invalidateSize())},100),this._mapInitialized=!0,window.L.Control&&window.L.Control.Geocoder){const t=L.Control.Geocoder.nominatim({geocodingQueryParams:{countrycodes:"id",limit:5}});L.Control.geocoder({defaultMarkGeocode:!1,geocoder:t,placeholder:"Search for places...",errorMessage:"Nothing found.",suggestMinLength:3,suggestTimeout:250,queryMinLength:1}).addTo(this._map).on("markgeocode",a=>{const{lat:i,lng:s}=a.geocode.center;this._updateLocation(i,s),this._map.setView([i,s],15)})}else console.warn("Geocoder control not available");window.L.control&&window.L.control.locate?L.control.locate({position:"topright",strings:{title:"Temukan lokasi saya"},locateOptions:{enableHighAccuracy:!0,maxZoom:15},flyTo:!0}).addTo(this._map):console.warn("Locate control not available"),this._map.on("click",t=>{this._updateLocation(t.latlng.lat,t.latlng.lng)}),this._view.setLocateMeCallback(()=>{"geolocation"in navigator?(this._view.showLoader("Finding your location..."),navigator.geolocation.getCurrentPosition(t=>{this._view.hideLoader();const{latitude:o,longitude:a}=t.coords;this._updateLocation(o,a),this._map.setView([o,a],15),window.showToast&&window.showToast("Location found!","success")},t=>{this._view.hideLoader(),console.error("Geolocation error:",t);let o="Could not get your location.";switch(t.code){case t.PERMISSION_DENIED:o="Location access denied. Please check your browser settings.";break;case t.POSITION_UNAVAILABLE:o="Location information is unavailable.";break;case t.TIMEOUT:o="Location request timed out.";break}this._view.showMapError(o)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:0})):this._view.showMapError("Geolocation is not supported by your browser")}),this._view.setSearchLocationCallback(()=>{const t=document.querySelector(".leaflet-control-geocoder");if(t)try{const o=t.querySelector(".leaflet-control-geocoder-icon"),a=t.querySelector("input");o&&o.click(),a&&a.focus()}catch(o){console.error("Error expanding geocoder:",o),this._showLocationSearchPrompt()}else this._showLocationSearchPrompt()}),console.log("Map initialization complete")}catch(e){console.error("Error initializing map:",e),this._view.showMapError("Failed to initialize map: "+e.message)}}_showLocationSearchPrompt(){Swal.fire({title:"Search Location",input:"text",inputPlaceholder:"Enter a place or address",showCancelButton:!0,confirmButtonColor:"#4361ee",cancelButtonColor:"#6c757d",confirmButtonText:"Search",showLoaderOnConfirm:!0,preConfirm:e=>{if(!e){Swal.showValidationMessage("Please enter a location");return}return fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(e)}&limit=5`).then(t=>{if(!t.ok)throw new Error("Network response was not ok");return t.json()}).catch(t=>{Swal.showValidationMessage(`Search failed: ${t.message}`)})},allowOutsideClick:()=>!Swal.isLoading()}).then(e=>{if(e.isConfirmed&&e.value&&e.value.length>0){const t=e.value;if(t.length===1){const o=t[0],a=parseFloat(o.lat),i=parseFloat(o.lon);this._updateLocation(a,i),this._map&&this._map.setView([a,i],15)}else if(t.length>1){const o=t.map(a=>({text:a.display_name,value:a.place_id,lat:parseFloat(a.lat),lon:parseFloat(a.lon)}));Swal.fire({title:"Select Location",input:"radio",inputOptions:o.reduce((a,i,s)=>(a[i.value]=i.text,a),{}),showCancelButton:!0,confirmButtonColor:"#4361ee",confirmButtonText:"Select"}).then(a=>{if(a.isConfirmed){const i=o.find(s=>s.value.toString()===a.value);i&&(this._updateLocation(i.lat,i.lon),this._map&&this._map.setView([i.lat,i.lon],15))}})}else Swal.fire({icon:"info",title:"No Results",text:"No locations found for your search."})}})}_updateLocation(e,t){if(this._view.updateLocationCoordinates(e,t),this._marker?this._marker.setLatLng([e,t]):this._map&&(this._marker=L.marker([e,t],{draggable:!0,autoPan:!0}).addTo(this._map),this._marker.on("dragend",o=>{const i=o.target.getLatLng();this._updateLocation(i.lat,i.lng)})),this._map){this._map.setView([e,t],this._map.getZoom()||15);const o=document.getElementById("location-text");o&&(o.innerHTML=`
          <span class="loading-dots">Getting location name</span>
          <br>Coordinates: ${e.toFixed(6)}, ${t.toFixed(6)}
        `),this._reverseGeocode(e,t)}}_reverseGeocode(e,t){if(window.L&&window.L.Control&&window.L.Control.Geocoder)try{const o=L.Control.Geocoder.nominatim();if(o){o.reverse({lat:e,lng:t},this._map.getZoom(),a=>{if(a&&a.length>0){const i=a[0].name,s=document.getElementById("location-text");s&&i&&(s.innerHTML=`
                  <strong>${i}</strong>
                  <br>Coordinates: ${e.toFixed(6)}, ${t.toFixed(6)}
                `)}});return}}catch(o){console.warn("Leaflet reverse geocoding failed:",o)}try{fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e}&lon=${t}&zoom=18&addressdetails=1`).then(o=>o.json()).then(o=>{if(o&&o.display_name){const a=document.getElementById("location-text");a&&(a.innerHTML=`
                <strong>${o.display_name}</strong>
                <br>Coordinates: ${e.toFixed(6)}, ${t.toFixed(6)}
              `)}}).catch(o=>{console.warn("Nominatim reverse geocoding failed:",o);const a=document.getElementById("location-text");a&&(a.textContent=`Coordinates: ${e.toFixed(6)}, ${t.toFixed(6)}`)})}catch(o){console.warn("External reverse geocoding failed:",o)}}_addToRecents(e){try{const t=localStorage.getItem("recentDrafts");let o=t?JSON.parse(t):[];const a=e.substring(0,50)+(e.length>50?"...":"");o.unshift({description:a,timestamp:new Date().toISOString(),id:Date.now().toString()}),o=o.slice(0,5),localStorage.setItem("recentDrafts",JSON.stringify(o))}catch(t){console.error("Error saving to recents:",t)}}}class Me{constructor(){this._presenter=new Pe({view:this})}async render(){return`
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="container">
          <div class="add-story-container">
            <h1 class="page-title">Share Your Story</h1>
            
            <div class="recent-drafts-container" id="recent-drafts">
              <!-- Recent drafts will be loaded here if available -->
            </div>
            
            <form id="add-story-form" class="story-form">
              <div class="form-group">
                <label for="description" class="form-label">Story Description</label>
                <textarea
                  id="description"
                  class="form-control"
                  placeholder="Share your learning experience..."
                  rows="4"
                  required
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
              
              <!-- Progress bar container -->
              <div class="progress-container hidden" id="progress-container">
                <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
              </div>
              
              <div class="form-actions">
                <a href="#/" class="cancel-button">Cancel</a>
                <button type="submit" class="submit-button">
                  <i class="fas fa-paper-plane"></i> Share Story
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <app-footer></app-footer>
      <app-loader></app-loader>
      
      <!-- Confetti canvas for success animation -->
      <canvas id="confetti-canvas" class="confetti-canvas"></canvas>
    `}async afterRender(){this._presenter.init(),this._presenter.loadRecentDrafts(),this._setupCharCounter()}_setupCharCounter(){const e=document.getElementById("description"),t=document.getElementById("char-count");e&&t&&e.addEventListener("input",()=>{const o=e.value.length;t.textContent=o,o>240?t.classList.add("text-warning"):o>270?(t.classList.remove("text-warning"),t.classList.add("text-danger")):t.classList.remove("text-warning","text-danger")})}displayRecentDrafts(e){const t=document.getElementById("recent-drafts");if(!t)return;if(!e||!Array.isArray(e)||e.length===0){t.classList.add("hidden");return}t.classList.remove("hidden");let o='<h2 class="recent-drafts-title">Recent Drafts</h2><div class="recent-drafts-list">';e.forEach(a=>{const s=new Date(a.timestamp).toLocaleDateString("id-ID",{day:"numeric",month:"short"});o+=`
        <div class="recent-draft-item" data-id="${a.id}">
          <div class="draft-content">
            <p class="draft-text">${a.description}</p>
            <span class="draft-date">${s}</span>
          </div>
          <button class="use-draft-btn" data-id="${a.id}">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      `}),o+="</div>",t.innerHTML=o,document.querySelectorAll(".use-draft-btn").forEach(a=>{a.addEventListener("click",()=>{const i=a.getAttribute("data-id");this._presenter.useDraft(i)})})}applyDraftToForm(e){const t=document.getElementById("description");t&&(t.value=e,t.dispatchEvent(new Event("input")),t.focus(),document.querySelector(".story-form").scrollIntoView({behavior:"smooth"}))}setOpenCameraCallback(e){const t=document.querySelector("#camera-button");t&&t.addEventListener("click",e)}setTakePhotoCallback(e){const t=document.querySelector("#take-photo");t&&t.addEventListener("click",e)}showCameraStream(e){const t=document.querySelector("#camera-container"),o=document.querySelector("#camera-view");if(!t||!o){console.error("Camera container or video element not found");return}try{t.classList.remove("hidden"),o.srcObject=e,o.onloadedmetadata=()=>{o.play().catch(a=>{console.error("Error playing video:",a)})}}catch(a){console.error("Error showing camera stream:",a)}}capturePhoto(){const e=document.querySelector("#camera-view"),t=document.querySelector("#camera-canvas");if(!e||!t)return console.error("Video element or canvas not found"),null;try{return e.videoWidth===0||e.videoHeight===0?(console.error("Video dimensions are zero, cannot capture photo"),null):(t.width=e.videoWidth,t.height=e.videoHeight,t.getContext("2d").drawImage(e,0,0,t.width,t.height),t.toDataURL("image/jpeg",.9))}catch(o){return console.error("Error capturing photo:",o),null}}showCameraFlash(){const e=document.createElement("div");e.className="camera-flash",document.body.appendChild(e),setTimeout(()=>{e.style.opacity="0.8",setTimeout(()=>{e.style.opacity="0",setTimeout(()=>{document.body.removeChild(e)},300)},100)},10)}resetCameraUI(){const e=document.querySelector("#camera-container"),t=document.querySelector("#camera-view");e&&e.classList.add("hidden"),t&&(t.srcObject=null)}showCameraError(e){Swal.fire({icon:"error",title:"Camera Error",text:e,confirmButtonColor:"#4361ee"})}setPhotoInputCallback(e){const t=document.querySelector("#photo");t&&t.addEventListener("change",o=>{e(o.target.files[0])})}showPhotoPreview(e){const t=document.querySelector("#photo-preview");if(!t)return;const o=new FileReader;o.onload=a=>{t.innerHTML=`
        <img 
          src="${a.target.result}" 
          alt="Selected photo preview" 
          style="max-width: 100%; border-radius: 8px; max-height: 300px;"
        >
      `},o.readAsDataURL(e)}showPhotoError(e){const t=document.querySelector("#photo-error");t&&(t.textContent=e,t.style.display="block")}clearPhotoError(){const e=document.querySelector("#photo-error");e&&(e.textContent="",e.style.display="none")}setLocationCheckboxCallback(e){const t=document.querySelector("#location-enabled");t&&t.addEventListener("change",()=>{e(t.checked)})}showMapContainer(){const e=document.querySelector("#map-container");e&&(e.classList.remove("hidden"),setTimeout(()=>{var t;if(window.L&&window.L.map){const o=(t=window.L.map._instances)==null?void 0:t[0];o&&o.invalidateSize()}},100))}hideMapContainer(){const e=document.querySelector("#map-container");e&&e.classList.add("hidden")}setLocateMeCallback(e){const t=document.querySelector("#locate-me");t&&t.addEventListener("click",e)}setSearchLocationCallback(e){const t=document.querySelector("#search-location");t&&t.addEventListener("click",e)}updateLocationCoordinates(e,t){const o=document.querySelector("#lat"),a=document.querySelector("#lon"),i=document.querySelector("#location-text");o&&a&&(o.value=e,a.value=t),i&&(i.textContent=`Coordinates: ${e.toFixed(6)}, ${t.toFixed(6)}`)}showMapError(e){Swal.fire({icon:"error",title:"Map Error",text:e,confirmButtonColor:"#4361ee"})}setSubmitCallback(e){const t=document.querySelector("#add-story-form");if(!t){console.error("Form not found: #add-story-form");return}t.addEventListener("submit",async o=>{o.preventDefault();const a=this.getDescription(),s=document.querySelector("#photo").files[0],c=document.querySelector("#location-enabled").checked,n=document.querySelector("#lat").value,u=document.querySelector("#lon").value,h=new FormData;h.append("description",a),s&&h.append("photo",s),c&&n&&u&&(h.append("lat",n),h.append("lon",u)),e(h)})}getDescription(){const e=document.querySelector("#description");return e?e.value.trim():""}setDescriptionInputCallback(e){const t=document.querySelector("#description");t&&t.addEventListener("input",()=>{const o=t.value.trim();e(o)})}showDescriptionError(e){const t=document.querySelector("#description-error");if(t){t.textContent=e,t.style.display="block";const o=document.querySelector("#description");o&&(o.classList.add("error"),o.setAttribute("aria-invalid","true"))}}clearDescriptionError(){const e=document.querySelector("#description-error");if(e){e.textContent="",e.style.display="none";const t=document.querySelector("#description");t&&(t.classList.remove("error"),t.setAttribute("aria-invalid","false"))}}showLoader(e="Loading..."){const t=document.querySelector("app-loader");t&&t.show(e)}hideLoader(){const e=document.querySelector("app-loader");e&&e.hide()}disableSubmitButton(){const e=document.querySelector("#submit-button");e&&(e.disabled=!0)}resetForm(){const e=document.querySelector("#add-story-form"),t=document.querySelector("#photo-preview"),o=document.querySelector("#map-container"),a=document.querySelector("#location-enabled");e&&e.reset(),t&&(t.innerHTML=`<i class="fas fa-image preview-placeholder"></i>
      <img id="preview-image" class="hidden" alt="Preview of your photo">`),o&&o.classList.add("hidden"),a&&(a.checked=!1);const i=document.getElementById("char-count");i&&(i.textContent="0",i.classList.remove("text-warning","text-danger"))}async showLoginRequiredAlert(){return Swal.fire({icon:"warning",title:"Login Required",text:"You need to login first",confirmButtonText:"OK",confirmButtonColor:"#4361ee"})}async showOfflineAlert(){return Swal.fire({icon:"error",title:"Offline Mode",text:"Adding stories is not available without internet connection.",confirmButtonColor:"#4361ee"})}async showSuccessAlert(){return Swal.fire({icon:"success",title:"Story added successfully!",showConfirmButton:!1,timer:1500})}async showErrorAlert(e){return Swal.fire({icon:"error",title:"Error",text:e||"Failed to add story",confirmButtonColor:"#4361ee"})}showProgressBar(){const e=document.getElementById("progress-container");e&&e.classList.remove("hidden")}hideProgressBar(){const e=document.getElementById("progress-container");e&&e.classList.add("hidden")}updateProgressBar(e){const t=document.getElementById("progress-bar");t&&(t.style.width=`${e}%`)}showFormValidationError(){Swal.fire({icon:"warning",title:"Form Validation Error",text:"Please fix the errors in the form before submitting.",confirmButtonColor:"#4361ee"})}showConfetti(){const e=document.getElementById("confetti-canvas");if(!e)return;e.classList.add("active");const t={target:e,max:150,size:1.5,animate:!0,props:["circle","square","triangle","line"],colors:[[165,104,246],[230,61,135],[0,199,228],[253,214,126]],clock:25,rotate:!0,start_from_edge:!0,respawn:!1};window.confetti.create(e,t)({particleCount:150,spread:160}),setTimeout(()=>{e.classList.remove("active")},3e3)}setCloseCameraCallback(e){const t=document.querySelector("#close-camera");t&&t.addEventListener("click",e)}}class De{async render(){return`
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="container not-found">
          <h1 class="page-title">404 - Halaman Tidak Ditemukan</h1>
          <p>Maaf, halaman yang Anda cari tidak tersedia.</p>
          <a href="#/" class="btn btn-primary">
            <i class="fas fa-home" aria-hidden="true"></i>
            Kembali ke Beranda
          </a>
        </section>
      </main>
      <app-footer></app-footer>
    `}async afterRender(){}}class xe{async render(){return`
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="container saved-stories">
          <h1 class="page-title">
            <i class="fas fa-database" aria-hidden="true"></i>
            Saved Stories
          </h1>
          <div id="saved-stories-list" class="stories-list"></div>
        </section>
      </main>
      <app-footer></app-footer>
    `}async afterRender(){const e=document.getElementById("saved-stories-list"),t=await Q();if(!t||t.length===0){e.innerHTML="<p>No saved stories available.</p>";return}t.forEach(o=>{const a=document.createElement("app-card");a.story=o;const i=document.createElement("button");i.textContent="Delete",i.className="delete-story-button",i.addEventListener("click",async()=>{await Se(o.id),a.remove(),window.showToast("Story deleted from cache","success")}),a.appendChild(i),e.appendChild(a)})}}const P={"#/":Le,"#/about":ke,"#/login":Ce,"#/register":Te,"#/stories/:id":Ae,"#/stories/add":Me,"#/saved":xe,"#/404":De};function ee(r){const t=r.split("?")[0].split("/").filter(o=>o!=="");return{resource:t[0]||null,id:t[1]&&t[1]!=="add"?t[1]:null,isAddPage:t[1]==="add"}}function te(){return location.hash.replace("#","")||"/"}function Be(){const r=te(),{resource:e,id:t,isAddPage:o}=ee(r);let a="#/";return e&&(a=`#/${e}`),o&&(a+="/add"),t&&(a+="/:id"),a}function qe(){return ee(te())}var b,f,_,d,oe,B,q,N,$,O;class Ne{constructor({content:e}){S(this,d);S(this,b,null);S(this,f,null);S(this,_,null);y(this,b,e),document.addEventListener("user-logout",()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),window.showToast("Logout berhasil","success"),window.location.hash="#/login"})}async renderPage(){const e=Be(),{resource:t,id:o,isAddPage:a}=qe();if(p(this,d,oe).call(this),a){const c=new P["#/stories/add"];p(this,d,B).call(this,t,o),p(this,d,q).call(this);try{await document.startViewTransition(async()=>{if(g(this,b).innerHTML=await c.render(),await c.afterRender(),c._presenter&&y(this,f,c._presenter),y(this,_,e),p(this,d,O).call(this),window.matchMedia("(prefers-reduced-motion: no-preference)").matches){const n=document.getElementById("main-content");n&&n.animate([{transform:"translateX(100%)",opacity:0},{transform:"translateX(0)",opacity:1}],{duration:300,easing:"ease-out"})}}).finished}catch(n){console.error("Error rendering Add Story page:",n),p(this,d,$).call(this)}finally{p(this,d,N).call(this)}return}const i=P[e]||P["#/404"],s=new i;p(this,d,B).call(this,t,o),p(this,d,q).call(this);try{await document.startViewTransition(async()=>{if(g(this,b).innerHTML=await s.render(),await s.afterRender(),s._presenter&&y(this,f,s._presenter),y(this,_,e),p(this,d,O).call(this),window.matchMedia("(prefers-reduced-motion: no-preference)").matches){const c=document.getElementById("main-content");c&&c.animate([{transform:"translateX(-50px)",opacity:0},{transform:"translateX(0)",opacity:1}],{duration:300,easing:"ease-out"})}}).finished}catch(c){console.error("Error rendering page:",c),p(this,d,$).call(this)}finally{p(this,d,N).call(this)}}}b=new WeakMap,f=new WeakMap,_=new WeakMap,d=new WeakSet,oe=function(){g(this,_)==="#/stories/add"&&g(this,f)&&typeof g(this,f).stopCamera=="function"&&g(this,f).stopCamera(),y(this,f,null)},B=function(e,t){const o={stories:t?"Story Details":"Add Story",login:"Login",register:"Register",about:"About",default:"Home"},a=o[e]||o.default;document.title=`Dicoding Story | ${a}`},q=function(){const e=document.querySelector("app-loader");e&&e.show()},N=function(){const e=document.querySelector("app-loader");e&&e.hide()},$=function(){g(this,b).innerHTML=`
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
    `},O=function(){try{const e=localStorage.getItem("token"),t=localStorage.getItem("user");if(e&&t&&t!=="undefined")try{const o=JSON.parse(t);window.dispatchEvent(new CustomEvent("user-login-state-changed",{detail:{isLoggedIn:!0,userData:o}}))}catch(o){console.error("Invalid user data in localStorage:",o),localStorage.removeItem("user");const a={name:"User",email:""};localStorage.setItem("user",JSON.stringify(a)),window.dispatchEvent(new CustomEvent("user-login-state-changed",{detail:{isLoggedIn:!0,userData:a}}))}else window.dispatchEvent(new CustomEvent("user-login-state-changed",{detail:{isLoggedIn:!1,userData:null}}))}catch(e){console.error("Error updating sidebar:",e)}};function $e(r){const e="=".repeat((4-r.length%4)%4),t=(r+e).replace(/-/g,"+").replace(/_/g,"/"),o=window.atob(t);return Uint8Array.from([...o].map(a=>a.charCodeAt(0)))}async function Oe(r){try{if(await Notification.requestPermission()!=="granted"){console.log("Push notification permission denied");return}const t=$e(l.VAPID_PUBLIC_KEY),o=await r.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:t});await fetch(`${l.BASE_URL}/subscribe`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}),console.log("User subscribed to push notifications")}catch(e){console.error("Failed to subscribe user:",e)}}function Re(){const r=document.createElement("div");r.className="splash-screen";const e=document.createElement("img");e.src="/images/logo.png",e.alt="Dicoding Story Logo",e.className="splash-logo";const t=document.createElement("div");t.className="splash-title",t.textContent="Dicoding Story";const o=document.createElement("div");o.className="splash-dots";for(let a=0;a<3;a++){const i=document.createElement("div");i.className="splash-dot",o.appendChild(i)}return r.appendChild(e),r.appendChild(t),r.appendChild(o),document.body.appendChild(r),r}function M(r){r.style.opacity="0",setTimeout(()=>{r.style.visibility="hidden",document.body.removeChild(r)},600)}"serviceWorker"in navigator&&(window.addEventListener("beforeinstallprompt",r=>{r.preventDefault();let e=r;const t=document.createElement("button");t.id="install-button",t.textContent="Install App",t.className="install-button",document.body.appendChild(t),t.addEventListener("click",async()=>{t.style.display="none",e.prompt();const{outcome:o}=await e.userChoice;console.log(`User response to the install prompt: ${o}`),e=null})}),window.addEventListener("load",()=>{navigator.serviceWorker.register(l.SERVICE_WORKER_PATH).then(r=>{console.log("ServiceWorker registration successful with scope: ",r.scope),window.showToast&&window.showToast("Aplikasi siap digunakan secara offline","success"),Oe(r)}).catch(r=>{console.error("ServiceWorker registration failed: ",r),window.showToast&&window.showToast("Gagal mendaftarkan service worker","error")})}));const Fe=()=>"startViewTransition"in document&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches;Fe()||(document.startViewTransition=r=>{try{const e=Promise.resolve(r());return{ready:Promise.resolve(),updateCallbackDone:e,finished:e}}catch(e){return console.error("Error in startViewTransition callback:",e),{ready:Promise.reject(e),updateCallbackDone:Promise.reject(e),finished:Promise.reject(e)}}});function Ue(){const r=localStorage.getItem("theme");r?document.documentElement.setAttribute("data-theme",r):window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches&&(document.documentElement.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"))}Ue();async function He(){const r=Re();setTimeout(async()=>{const e=document.querySelector("#app");if(!e){console.error("App element not found"),M(r);return}const t=new Ne({content:e});try{await t.renderPage(),M(r),ze(),Ve(),J()}catch(s){console.error("Error loading initial page:",s),M(r),e.innerHTML=`
        <section class="container">
          <h1 class="page-title">Error</h1>
          <p>Gagal memuat halaman. Silakan coba lagi.</p>
          <a href="#/" class="back-link">
            <i class="fas fa-home"></i>
            Kembali ke Beranda
          </a>
        </section>
      `,window.showToast&&window.showToast("Gagal memuat halaman, silakan coba lagi","error")}window.addEventListener("hashchange",async()=>{try{const s=document.createElement("div");s.className="loading-spinner",s.innerHTML=`
          <div class="spinner-container">
            <div class="spinner-pulse"></div>
            <div class="spinner"></div>
          </div>
          <div class="spinner-text">Loading...</div>
        `,document.body.appendChild(s),await t.renderPage(),J(),document.body.removeChild(s)}catch(s){console.error("Error loading page:",s),window.showToast&&window.showToast("Gagal memuat halaman","error")}});const o=()=>{const s=document.querySelector(".skip-link");s&&s.addEventListener("click",function(c){c.preventDefault();const n=document.querySelector("#main-content");n&&(s.blur(),n.focus(),n.scrollIntoView({behavior:"smooth"}))})};o(),window.addEventListener("hashchange",()=>{setTimeout(o,100)});let a;const i=document.createElement("div");i.id="install-container",i.classList.add("install-prompt"),i.innerHTML=`
      <div class="install-content">
        <img src="/images/icon-192x192.png" alt="App icon" width="48" height="48">
        <div class="install-text">
          <h3>Install Dicoding Story</h3>
          <p>Install aplikasi ini untuk pengalaman offline yang lebih baik!</p>
        </div>
        <div class="install-actions">
          <button id="install-button" class="primary-button">Install</button>
          <button id="dismiss-button" class="secondary-button">Nanti</button>
        </div>
      </div>
    `,document.body.appendChild(i),window.addEventListener("beforeinstallprompt",s=>{s.preventDefault(),a=s,setTimeout(()=>{i.classList.add("show")},3e3),document.getElementById("install-button").addEventListener("click",()=>{i.classList.remove("show"),a.prompt(),a.userChoice.then(c=>{c.outcome==="accepted"?(console.log("User accepted the install prompt"),window.showToast&&window.showToast("Aplikasi sedang diinstall!","success")):console.log("User dismissed the install prompt"),a=null})}),document.getElementById("dismiss-button").addEventListener("click",()=>{i.classList.remove("show")})}),window.showToast&&setTimeout(()=>{window.showToast("Selamat datang di Dicoding Story!","info")},1e3)},1800)}function ze(){const r=document.querySelector("header");if(!r)return;const e=()=>{window.scrollY>30?r.classList.add("scrolled"):r.classList.remove("scrolled")};e(),window.addEventListener("scroll",e)}function Ve(){const r=localStorage.getItem("theme");r&&document.documentElement.setAttribute("data-theme",r);const e=document.querySelector(".nav-list");if(e&&!document.getElementById("theme-toggle-item")){const t=document.createElement("li");t.id="theme-toggle-item";const o=r||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");t.innerHTML=`
        <button id="theme-toggle" aria-label="Toggle dark/light mode">
          <i class="fas ${o==="dark"?"fa-sun":"fa-moon"}" aria-hidden="true"></i>
          <span>${o==="dark"?"Light Mode":"Dark Mode"}</span>
        </button>
      `;const a=e.children[1];a?e.insertBefore(t,a.nextSibling):e.appendChild(t);const i=document.getElementById("theme-toggle");i&&i.addEventListener("click",je)}}function je(){const e=(document.documentElement.getAttribute("data-theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"))==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",e),localStorage.setItem("theme",e);const t=document.getElementById("theme-toggle");if(t){const o=t.querySelector("i"),a=t.querySelector("span");o&&(o.className=`fas ${e==="dark"?"fa-sun":"fa-moon"}`),a&&(a.textContent=e==="dark"?"Light Mode":"Dark Mode")}window.showToast&&window.showToast(`Switched to ${e==="dark"?"dark":"light"} mode`,"info")}function J(){const r=()=>{document.querySelectorAll(".story-item, .page-title, .story-form, .auth-container").forEach(o=>{const a=o.getBoundingClientRect();if(a.top<=(window.innerHeight||document.documentElement.clientHeight)*.85&&a.bottom>=0)if(o.classList.add("visible"),o.classList.contains("story-item")){o.classList.add("animate__animated","animate__fadeInUp");const s=Array.from(o.parentNode.children).indexOf(o);o.style.animationDelay=`${s*.1}s`}else o.classList.contains("page-title")?o.classList.add("animate__animated","animate__fadeInDown"):o.classList.add("animate__animated","animate__fadeIn")})};setTimeout(r,100);let e;window.addEventListener("scroll",()=>{clearTimeout(e),e=setTimeout(r,20)})}document.addEventListener("DOMContentLoaded",He);
//# sourceMappingURL=main-5lWsfGni.js.map
