// Top navigation metadata shared by the nav component and route helpers.
export const navRoutes = [
  { id: 'home', path: '#home', label: 'Home' },
  { id: 'tech-art', path: '#tech-art', label: 'Tech Art' },
  { id: 'game', path: '#games', label: 'Game Projects' },
  { id: '2d-art', path: '#2d-art', label: '2D Art' },
];

// Keeps hash anchors and detail routes in one canonical format.
export const normalizePath = (path) => {
  if (!path || path === '#') return '/';
  const cleanPath = path.replace(/^#/, '').split('?')[0];
  if (['home', 'tech-art', 'games', '2d-art'].includes(cleanPath)) return `#${cleanPath}`;
  return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
};

// Maps the current route to the navigation item that should appear active.
export const getActiveRouteId = (path) => {
  if (path === '#home') return 'home';
  if (path === '#games' || path.startsWith('/games')) return 'game';
  if (path === '#tech-art' || path.startsWith('/tech-art') || path.startsWith('/graphics')) return 'tech-art';
  if (path === '#2d-art' || path.startsWith('/2d-art') || path.startsWith('/art')) return '2d-art';
  return 'home';
};
