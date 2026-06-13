// Anchors that participate in the home page's smooth scrolling navigation.
const anchorIds = new Set(['home', 'tech-art', 'games', '2d-art']);
const navOffset = 112;
const scrollDuration = 520;

let activeAnimation = null;

// Easing keeps anchor jumps feeling softer than the browser default.
const easeOutCubic = (progress) => 1 - (1 - progress) ** 3;

const getTargetY = (element) => (
  Math.max(0, element.getBoundingClientRect().top + window.scrollY - navOffset)
);

const isKnownAnchor = (anchor) => anchorIds.has(anchor) || anchor.startsWith('project-');

// Manual scroll animation so hash updates and fixed-nav offsets stay predictable.
const animateScroll = (targetY) => {
  if (activeAnimation) window.clearTimeout(activeAnimation);

  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = window.performance.now();

  const step = () => {
    const elapsed = window.performance.now() - startTime;
    const progress = Math.min(elapsed / scrollDuration, 1);
    window.scrollTo(0, startY + distance * easeOutCubic(progress));

    if (progress < 1) {
      activeAnimation = window.setTimeout(step, 16);
      return;
    }

    activeAnimation = null;
  };

  activeAnimation = window.setTimeout(step, 0);
};

// Scrolls to a known home section while accounting for the fixed navigation bar.
export function scrollToAnchor(anchor, behavior = 'smooth') {
  if (!isKnownAnchor(anchor)) return;

  const element = document.getElementById(anchor);
  if (!element) {
    window.requestAnimationFrame(() => scrollToAnchor(anchor, behavior));
    return;
  }

  const targetY = getTargetY(element);

  if (anchor.startsWith('project-') && behavior === 'smooth') {
    window.setTimeout(() => {
      const settledElement = document.getElementById(anchor);
      if (settledElement) animateScroll(getTargetY(settledElement));
    }, 260);
    return;
  }

  if (behavior === 'smooth') {
    animateScroll(targetY);
    return;
  }

  window.scrollTo(0, targetY);
  window.setTimeout(() => window.scrollTo(0, getTargetY(element)), 350);
  window.setTimeout(() => window.scrollTo(0, getTargetY(element)), 900);
}

export function scrollToElementId(elementId, behavior = 'smooth') {
  const element = document.getElementById(elementId);
  if (!element) return false;

  const targetY = getTargetY(element);
  if (behavior === 'smooth') {
    animateScroll(targetY);
    return true;
  }

  window.scrollTo(0, targetY);
  return true;
}

export const scrollAnimationDelay = scrollDuration;
