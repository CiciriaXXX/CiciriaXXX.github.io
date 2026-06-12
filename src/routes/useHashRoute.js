import { useEffect, useMemo, useRef, useState } from 'react';
import { normalizePath } from './routeConfig';
import { scrollAnimationDelay, scrollToAnchor } from './scrollToAnchor';

const homeSectionIds = ['home', 'tech-art', 'games', '2d-art'];

// Reads the current hash route and normalizes it before React state sees it.
const readPath = () => normalizePath(window.location.hash.slice(1));

// Updates the URL without triggering the browser's default jump-to-anchor behavior.
const updateHashPath = (path) => {
  const nextUrl = `${window.location.pathname}${window.location.search}${path}`;
  window.history.pushState(null, '', nextUrl);
};

// Small hash router used by this static portfolio instead of a full routing library.
export function useHashRoute() {
  const [path, setPath] = useState(readPath);
  const pendingHashUpdate = useRef(null);
  const pathRef = useRef(path);

  useEffect(() => {
    pathRef.current = path;
  }, [path]);

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

  useEffect(() => {
    let animationFrameId = 0;

    const getActiveHomeSection = () => {
      const threshold = window.innerHeight * 0.5;
      let activeId = 'home';

      for (const id of homeSectionIds) {
        const element = document.getElementById(id);
        if (!element) return null;
        if (element.getBoundingClientRect().top <= threshold) {
          activeId = id;
        }
      }

      return `#${activeId}`;
    };

    const updateActiveSection = () => {
      animationFrameId = 0;
      if (pendingHashUpdate.current) return;
      const nextPath = getActiveHomeSection();
      if (!nextPath || pathRef.current === nextPath) return;
      pathRef.current = nextPath;
      setPath(nextPath);
    };

    const handleScroll = () => {
      if (animationFrameId) return;
      animationFrameId = window.requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
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
