import { getActiveRoute } from '../routes/url-parser';
import CONFIG from '../config';

const ACCESS_TOKEN_KEY = CONFIG.ACCESS_TOKEN_KEY;
const USER_KEY = 'user';
const unauthenticatedRoutesOnly = ['/login', '/register'];

// Ambil token akses dari localStorage
export function getAccessToken() {
  try {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!accessToken || accessToken === 'null' || accessToken === 'undefined')
      return null;
    return accessToken;
  } catch (error) {
    console.error('getAccessToken: error:', error);
    return null;
  }
}

// Simpan token akses ke localStorage
export function putAccessToken(token) {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('putAccessToken: error:', error);
    return false;
  }
}

// Hapus token akses dari localStorage
export function removeAccessToken() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('removeAccessToken: error:', error);
    return false;
  }
}

// Ambil data user dari localStorage
export function getUser() {
  try {
    const user = localStorage.getItem(USER_KEY);
    if (!user || user === 'null' || user === 'undefined') return null;
    return JSON.parse(user);
  } catch (error) {
    console.error('getUser: error:', error);
    return null;
  }
}

// Simpan data user ke localStorage
export function putUser(user) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('putUser: error:', error);
    return false;
  }
}

// Hapus data user dari localStorage
export function removeUser() {
  try {
    localStorage.removeItem(USER_KEY);
    return true;
  } catch (error) {
    console.error('removeUser: error:', error);
    return false;
  }
}

// Cek jika route hanya untuk user yang sudah login
export function checkAuthenticatedRoute(page) {
  const isLogin = !!getAccessToken();
  if (!isLogin) {
    location.hash = '/login';
    window.showToast?.('Silakan login terlebih dahulu', 'warning');
    return null;
  }
  return page;
}

// Logout user (hapus token & user)
export function getLogout() {
  removeAccessToken();
  removeUser();
  window.showToast?.('Logout berhasil', 'success');
  location.hash = '/login';
}

// Helper: cek status login
export function isLoggedIn() {
  return !!getAccessToken();
}
