const anchorIds = new Set(['home', 'tech-art', 'games', '2d-art']);
const navOffset = 112;
const scrollDuration = 520;

let activeAnimation = null;

const easeOutCubic = (progress) => 1 - (1 - progress) ** 3;

const getTargetY = (element) => (
  Math.max(0, element.getBoundingClientRect().top + window.scrollY - navOffset)
);

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

export function scrollToAnchor(anchor, behavior = 'smooth') {
  if (!anchorIds.has(anchor)) return;

  const element = document.getElementById(anchor);
  if (!element) {
    window.requestAnimationFrame(() => scrollToAnchor(anchor, behavior));
    return;
  }

  const targetY = getTargetY(element);

  if (behavior === 'smooth') {
    animateScroll(targetY);
    return;
  }

  window.scrollTo(0, targetY);
  window.setTimeout(() => window.scrollTo(0, getTargetY(element)), 350);
  window.setTimeout(() => window.scrollTo(0, getTargetY(element)), 900);
}

export const scrollAnimationDelay = scrollDuration;
