/**
 * Utility for parsing and extracting route information from the current URL hash.
 * Mendukung parsing resource, id, add, dan query params.
 */

function extractPathnameSegments(path) {
  // Remove query parameters if any
  const cleanPath = path.split('?')[0];
  const splitUrl = cleanPath.split('/').filter(Boolean);

  // Mendukung rute dinamis seperti #/stories/123/edit
  return {
    resource: splitUrl[0] || null,
    id: splitUrl[1] && splitUrl[1] !== 'add' ? splitUrl[1] : null,
    isAddPage: splitUrl[1] === 'add',
    extra: splitUrl.slice(2), // improvisasi: untuk segment lebih dari 2
  };
}

export function getActivePathname() {
  // Mendukung hash dan fallback ke '/'
  return location.hash.replace('#', '') || '/';
}

export function getActiveRoute() {
  // Mendukung rute dinamis dan add
  const { resource, id, isAddPage } =
    extractPathnameSegments(getActivePathname());
  let route = '#/';
  if (resource) route = `#/${resource}`;
  if (isAddPage) route += '/add';
  if (id) route += '/:id';
  return route;
}

export function parseActivePathname() {
  return extractPathnameSegments(getActivePathname());
}

export function getQueryParams() {
  // Mendukung query string pada hash, misal #/stories/123?foo=bar
  const hash = location.hash || '';
  const query = hash.includes('?') ? hash.split('?')[1] : '';
  if (!query) return {};
  return query.split('&').reduce((params, param) => {
    const [key, value] = param.split('=');
    params[key] = decodeURIComponent(value || '');
    return params;
  }, {});
}

/**
 * IMPROVISASI: Helper untuk mendapatkan parameter dinamis dari hash
 * Misal: #/stories/123/edit => getDynamicParams(['stories', ':id', 'edit'])
 */
export function getDynamicParams(pattern) {
  const path = getActivePathname().split('?')[0];
  const pathSegments = path.split('/').filter(Boolean);
  const params = {};
  pattern.forEach((segment, idx) => {
    if (segment.startsWith(':')) {
      params[segment.slice(1)] = pathSegments[idx] || null;
    }
  });
  return params;
}
