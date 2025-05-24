function extractPathnameSegments(path) {
  // Remove query parameters if any
  const cleanPath = path.split('?')[0];
  const splitUrl = cleanPath.split('/').filter((segment) => segment !== '');

  return {
    resource: splitUrl[0] || null,
    id: splitUrl[1] && splitUrl[1] !== 'add' ? splitUrl[1] : null,
    isAddPage: splitUrl[1] === 'add',
  };
}

export function getActivePathname() {
  return location.hash.replace('#', '') || '/';
}

export function getActiveRoute() {
  const pathname = getActivePathname();
  const { resource, id, isAddPage } = extractPathnameSegments(pathname);

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
  const query = location.hash.split('?')[1];
  if (!query) return {};

  return query.split('&').reduce((params, param) => {
    const [key, value] = param.split('=');
    params[key] = decodeURIComponent(value);
    return params;
  }, {});
}
