import { cx } from './classNames';

// CSS variable aliases for components that need direct access to theme colors.
export const palette = {
  hero: 'var(--color-hero)',
  accent: 'var(--color-accent)',
  ink: 'var(--color-ink)',
  paper: 'var(--color-paper)',
};

// Shared page width and padding rules for home and detail layouts.
export const layout = {
  container: 'mx-auto max-w-[1400px] px-4 md:px-6 xl:px-8',
  detailContainer: 'mx-auto max-w-[1400px] px-4 pb-24 pt-36 md:px-6 xl:px-8',
};

// Central Tailwind class map keeps JSX components focused on structure and content.
export const styles = {
  app: {
    root: 'min-h-screen bg-transparent text-[var(--color-ink)] selection:bg-[var(--color-accent)] selection:text-[var(--color-paper)]',
  },

  nav: {
    header: 'site-nav fixed left-0 right-0 top-0 z-40 bg-[linear-gradient(180deg,#303059_0%,#05051A_100%)]',
    inner: cx(layout.container, 'flex items-center justify-between gap-6 py-6'),
    brandButton: 'text-left',
    brandName: 'block font-display text-3xl font-normal leading-none text-[var(--color-accent)] transition hover:text-[var(--color-accent-hover)] md:text-4xl',
    brandTitle: 'hidden text-xs font-semibold text-[var(--color-ink)] sm:block',
    links: 'flex flex-wrap justify-end gap-x-8 gap-y-2 text-lg font-semibold md:text-xl',
    link: (isActive) => cx(
      'text-lg transition md:text-xl',
      isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-ink)] hover:text-[var(--color-accent-hover)]',
    ),
  },

  home: {
    content: cx(layout.container, 'space-y-24 py-24'),
  },

  hero: {
    imageLayers: [
      'left-0 top-0 z-[1]',
      'left-[9%] top-[7%] z-[2]',
      'left-[18%] top-[14%] z-[3]',
    ],
    section: 'scroll-mt-28 bg-transparent',
    inner: cx(
      layout.container,
      'grid min-h-[760px] items-center gap-12 pb-24 pt-40 md:grid-cols-[0.92fr_1.08fr] xl:gap-20',
    ),
    imageStage: 'relative mx-auto h-[500px] w-full max-w-[540px] xl:h-[580px]',
    imageFrame: (layerClass) => cx('absolute aspect-[4/5] w-[78%] overflow-hidden bg-[var(--color-paper)]', layerClass),
    image: 'h-full w-full object-cover',
    copy: 'relative px-0 py-0 text-center md:text-left',
    title: 'relative font-display text-6xl font-normal leading-none text-[var(--color-accent)] md:text-8xl',
    subtitle: 'mt-1 text-xl font-black uppercase text-[var(--color-ink)]',
    body: 'mt-12 space-y-5 text-lg leading-relaxed text-[var(--color-ink)]',
    bodySmall: 'text-base',
    accentText: 'font-black text-[var(--color-accent)]',
    strong: 'font-black',
    links: 'mt-8 flex flex-wrap justify-center gap-4 md:justify-start',
    iconLink:
      'inline-flex h-10 w-10 items-center justify-center text-[var(--color-paper)] transition hover:-translate-y-0.5 hover:text-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-white/70',
  },

  section: {
    root: 'scroll-mt-28 space-y-12',
    header: 'space-y-3',
    eyebrow: 'text-xs font-black uppercase text-[var(--color-ink)]',
    title:
      'border-b-2 border-[var(--color-accent)] pb-2 font-display text-5xl font-normal leading-none text-[var(--color-accent)] md:text-7xl',
  },

  projectCard: {
    article: (isReversed) => cx(
      'grid gap-10 py-16 md:items-center md:gap-16 xl:gap-20',
      isReversed
        ? 'md:grid-cols-[0.85fr_1.15fr] xl:grid-cols-[0.78fr_1.22fr]'
        : 'md:grid-cols-[1.15fr_0.85fr] xl:grid-cols-[1.22fr_0.78fr]',
    ),
    mediaButton: (isReversed) => cx(
      'group flex aspect-video items-center justify-center overflow-hidden bg-transparent text-left',
      isReversed && 'md:order-2',
    ),
    mediaImage: 'h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]',
    content: (isReversed) => cx('space-y-7', isReversed && 'md:order-1 md:text-right'),
    titleButton: (isReversed) => cx('block text-left', isReversed && 'md:ml-auto md:text-right'),
    title:
      'border-b-2 border-[var(--color-accent)] pb-1 font-display text-5xl font-normal leading-none text-[var(--color-accent)] transition hover:text-[var(--color-accent-hover)] md:text-6xl',
    body: 'space-y-4',
    role: 'text-2xl font-black uppercase text-[var(--color-accent)]',
    category: 'text-lg font-black text-[var(--color-ink)]',
    description: 'text-lg leading-relaxed text-[var(--color-ink)]',
    techList: (isReversed) => cx(
      'flex flex-wrap gap-x-12 gap-y-3 text-base font-black text-[var(--color-ink)]',
      isReversed && 'md:justify-end',
    ),
  },

  artwork: {
    section: 'scroll-mt-28 space-y-10',
    grid: 'grid gap-8 md:grid-cols-3',
    card: 'group',
    previewButton:
      'mb-4 flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-transparent text-left',
    thumbnail: 'h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]',
    year: 'text-xs font-black uppercase text-[var(--color-ink)]',
    titleButton: 'mt-1 block text-left',
    title: 'font-display text-3xl font-normal text-[var(--color-accent)] transition hover:text-[var(--color-accent-hover)]',
    description: 'mt-2 text-sm leading-relaxed text-[var(--color-ink)]',
  },

  lightbox: {
    overlay: 'fixed inset-0 z-50 flex items-center justify-center bg-black/[0.72] p-5 backdrop-blur-sm',
    closeButton: 'absolute right-5 top-5 text-[var(--color-paper)] transition hover:text-[var(--color-accent-hover)]',
    figure: 'flex h-full w-full items-center justify-center',
    image: 'max-h-screen max-w-screen object-contain',
    caption: 'hidden',
    year: 'text-xs font-black uppercase text-[var(--color-paper)]',
    title: 'mt-1 font-display text-2xl font-normal text-[var(--color-accent)]',
  },

  detail: {
    root: 'space-y-10',
    backButton:
      'inline-flex items-center gap-2 text-sm font-black text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]',
    header: 'grid gap-8 border-b-2 border-[var(--color-accent)] py-10 md:grid-cols-[0.9fr_1.1fr]',
    category: 'text-sm font-black uppercase text-[var(--color-ink)]',
    title: 'mt-3 font-display text-5xl font-normal leading-none text-[var(--color-accent)] md:text-7xl',
    intro: 'space-y-5 md:pt-8',
    description: 'text-xl leading-relaxed text-[var(--color-ink)]',
    role: 'font-black uppercase text-[var(--color-accent)]',
    externalLink:
      'inline-flex items-center gap-2 border border-[var(--color-accent)] bg-white/10 px-8 py-3 text-sm font-black uppercase text-[var(--color-accent)] transition hover:border-[var(--color-accent-hover)] hover:text-[var(--color-accent-hover)]',
    mediaFrame: 'flex items-center justify-center overflow-hidden bg-transparent',
    mediaImage: 'max-h-[70vh] w-full object-contain',
    skills: 'grid gap-8 border-t-2 border-[var(--color-accent)] pt-10 md:grid-cols-[0.35fr_0.65fr]',
    skillsTitle: 'font-display text-2xl font-normal text-[var(--color-ink)]',
    skillList: 'flex flex-wrap gap-x-10 gap-y-3 text-base font-black text-[var(--color-ink)]',
  },

  projectPage: {
    container: layout.detailContainer,
    notFound: 'space-y-5',
    notFoundTitle: 'text-4xl font-black uppercase text-[var(--color-accent)]',
    notFoundButton: 'font-black text-[var(--color-ink)] hover:text-[var(--color-accent-hover)]',
  },
};
