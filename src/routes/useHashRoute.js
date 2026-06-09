import { useEffect, useMemo, useRef, useState } from 'react';
import { normalizePath } from './routeConfig';
import { scrollAnimationDelay, scrollToAnchor } from './scrollToAnchor';

const readPath = () => normalizePath(window.location.hash.slice(1));

const updateHashPath = (path) => {
  const nextUrl = `${window.location.pathname}${window.location.search}${path}`;
  window.history.pushState(null, '', nextUrl);
};

export function useHashRoute() {
  const [path, setPath] = useState(readPath);
  const pendingHashUpdate = useRef(null);

  useEffect(() => {
    const handleHashChange = () => {
      const nextPath = readPath();
      if (pendingHashUpdate.current) {
        window.clearTimeout(pendingHashUpdate.current);
        pendingHashUpdate.current = null;
      }
      setPath(nextPath);
      if (nextPath.startsWith('#')) {
        scrollToAnchor(nextPath.slice(1));
        return;
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  return useMemo(
    () => ({
      path,
      navigate: (nextPath) => {
        const normalizedPath = normalizePath(nextPath) === '/' ? '#home' : normalizePath(nextPath);
        if (normalizedPath === path) {
          if (normalizedPath.startsWith('#')) {
            scrollToAnchor(normalizedPath.slice(1));
            return;
          }
          window.scrollTo(0, 0);
          return;
        }
        if (normalizedPath.startsWith('#')) {
          if (pendingHashUpdate.current) window.clearTimeout(pendingHashUpdate.current);
          setPath(normalizedPath);
          window.requestAnimationFrame(() => {
            scrollToAnchor(normalizedPath.slice(1));
            pendingHashUpdate.current = window.setTimeout(() => {
              updateHashPath(normalizedPath);
              pendingHashUpdate.current = null;
            }, scrollAnimationDelay);
          });
          return;
        }
        window.location.hash = normalizedPath;
      },
    }),
    [path],
  );
}
