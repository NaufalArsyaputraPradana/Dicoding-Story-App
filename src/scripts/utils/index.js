export function showFormattedDate(date, locale = 'id-ID', options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  try {
    return new Date(date).toLocaleDateString(locale, defaultOptions);
  } catch (error) {
    console.error('Error formatting date:', error);
    return date || 'Unknown date';
  }
}

export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
}

export function debounce(func, wait = 300, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export async function sleep(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function getInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function isOnline() {
  return true;
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getRandomColor() {
  const colors = [
    '#4361ee',
    '#3f37c9',
    '#4895ef',
    '#4cc9f0',
    '#f72585',
    '#b5179e',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function animateElement(element, animation, duration = 300) {
  return new Promise((resolve) => {
    const animationClass = `animate-${animation}`;
    element.classList.add(animationClass);

    setTimeout(() => {
      element.classList.remove(animationClass);
      resolve();
    }, duration);
  });
}
