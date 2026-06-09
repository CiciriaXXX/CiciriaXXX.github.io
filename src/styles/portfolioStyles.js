import { cx } from './classNames';

export const palette = {
  hero: 'var(--color-hero)',
  accent: 'var(--color-accent)',
  ink: 'var(--color-ink)',
  paper: 'var(--color-paper)',
};

export const layout = {
  container: 'mx-auto max-w-[1400px] px-4 md:px-6 xl:px-8',
  detailContainer: 'mx-auto max-w-[1400px] px-4 pb-24 pt-36 md:px-6 xl:px-8',
};

export const styles = {
  app: {
    root: 'min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)] selection:bg-[var(--color-accent)] selection:text-[var(--color-paper)]',
  },

  nav: {
    header: 'fixed left-0 right-0 top-0 z-40 bg-[var(--color-hero)]',
    inner: cx(layout.container, 'flex items-center justify-between gap-6 py-8'),
    brandButton: 'text-left',
    brandName: 'block text-base font-black uppercase text-[var(--color-accent)]',
    brandTitle: 'hidden text-xs font-semibold text-[var(--color-ink)] sm:block',
    links: 'flex flex-wrap justify-end gap-x-8 gap-y-2 text-sm font-semibold',
    link: (isActive) => cx(
      'transition',
      isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-ink)] hover:text-[var(--color-accent)]',
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
    section: 'scroll-mt-28 bg-[var(--color-hero)]',
    inner: cx(
      layout.container,
      'grid min-h-[760px] items-center gap-12 pb-24 pt-40 md:grid-cols-[0.92fr_1.08fr] xl:gap-20',
    ),
    imageStage: 'relative mx-auto h-[500px] w-full max-w-[540px] xl:h-[580px]',
    imageFrame: (layerClass) => cx('absolute aspect-[4/5] w-[78%] overflow-hidden bg-[var(--color-paper)]', layerClass),
    image: 'h-full w-full object-cover',
    copy: 'relative text-center md:text-left',
    ghostName:
      'pointer-events-none absolute -top-12 left-1/2 hidden -translate-x-1/2 text-8xl font-black uppercase leading-none text-[var(--color-paper)] md:block',
    title: 'relative text-6xl font-black uppercase leading-none text-[var(--color-accent)] md:text-8xl',
    subtitle: 'mt-1 text-xl font-black uppercase text-[var(--color-ink)]',
    body: 'mt-12 space-y-5 text-lg leading-relaxed text-[var(--color-ink)]',
    bodySmall: 'text-base',
    accentText: 'font-black text-[var(--color-accent)]',
    strong: 'font-black',
    links: 'mt-8 flex flex-wrap justify-center gap-4 md:justify-start',
    primaryLink:
      'bg-[var(--color-accent)] px-12 py-4 text-sm font-black uppercase text-[var(--color-paper)] transition hover:bg-[var(--color-ink)]',
    secondaryLink:
      'inline-flex items-center gap-1 py-4 text-sm font-black text-[var(--color-ink)] hover:text-[var(--color-accent)]',
  },

  section: {
    root: 'scroll-mt-28 space-y-12',
    header: 'space-y-3',
    eyebrow: 'text-xs font-black uppercase text-[var(--color-ink)]',
    title:
      'border-b-2 border-[var(--color-accent)] pb-2 text-5xl font-black uppercase leading-none text-[var(--color-accent)] md:text-7xl',
  },

  projectCard: {
    article: (isReversed) => cx(
      'grid gap-10 py-16 md:items-center md:gap-16 xl:gap-20',
      isReversed
        ? 'md:grid-cols-[0.85fr_1.15fr] xl:grid-cols-[0.78fr_1.22fr]'
        : 'md:grid-cols-[1.15fr_0.85fr] xl:grid-cols-[1.22fr_0.78fr]',
    ),
    mediaButton: (isReversed) => cx(
      'group aspect-video overflow-hidden bg-[var(--color-hero)] text-left',
      isReversed && 'md:order-2',
    ),
    mediaImage: 'h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]',
    content: (isReversed) => cx('space-y-7', isReversed && 'md:order-1 md:text-right'),
    titleButton: (isReversed) => cx('block text-left', isReversed && 'md:ml-auto md:text-right'),
    title:
      'border-b-2 border-[var(--color-accent)] pb-1 text-5xl font-black uppercase leading-none text-[var(--color-accent)] transition hover:text-[var(--color-ink)] md:text-6xl',
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
      'mb-4 flex w-full items-center justify-center overflow-hidden bg-[var(--color-hero)] text-left',
    thumbnail: 'max-h-[420px] w-full object-contain transition duration-500 group-hover:scale-[1.03]',
    year: 'text-xs font-black uppercase text-[var(--color-ink)]',
    titleButton: 'mt-1 block text-left',
    title: 'text-3xl font-black uppercase text-[var(--color-accent)] transition hover:text-[var(--color-ink)]',
    description: 'mt-2 text-sm leading-relaxed text-[var(--color-ink)]',
  },

  lightbox: {
    overlay: 'fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)] p-5',
    closeButton: 'absolute right-5 top-5 text-[var(--color-paper)] transition hover:text-[var(--color-accent)]',
    figure: 'flex max-h-full max-w-6xl flex-col items-center gap-4',
    image: 'max-h-[82vh] max-w-full object-contain',
    caption: 'text-center',
    year: 'text-xs font-black uppercase text-[var(--color-paper)]',
    title: 'mt-1 text-2xl font-black uppercase text-[var(--color-accent)]',
  },

  detail: {
    root: 'space-y-10',
    backButton:
      'inline-flex items-center gap-2 text-sm font-black text-[var(--color-accent)] hover:text-[var(--color-ink)]',
    header: 'grid gap-8 border-b-2 border-[var(--color-accent)] py-10 md:grid-cols-[0.9fr_1.1fr]',
    category: 'text-sm font-black uppercase text-[var(--color-ink)]',
    title: 'mt-3 text-5xl font-black uppercase leading-none text-[var(--color-accent)] md:text-7xl',
    intro: 'space-y-5 md:pt-8',
    description: 'text-xl leading-relaxed text-[var(--color-ink)]',
    role: 'font-black uppercase text-[var(--color-accent)]',
    externalLink:
      'inline-flex items-center gap-2 bg-[var(--color-accent)] px-8 py-3 text-sm font-black uppercase text-[var(--color-paper)] hover:bg-[var(--color-ink)]',
    mediaFrame: 'overflow-hidden bg-[var(--color-hero)]',
    mediaImage: 'max-h-[70vh] w-full object-cover',
    skills: 'grid gap-8 border-t-2 border-[var(--color-accent)] pt-10 md:grid-cols-[0.35fr_0.65fr]',
    skillsTitle: 'text-2xl font-black uppercase text-[var(--color-ink)]',
    skillList: 'flex flex-wrap gap-x-10 gap-y-3 text-base font-black text-[var(--color-ink)]',
  },

  projectPage: {
    container: layout.detailContainer,
    notFound: 'space-y-5',
    notFoundTitle: 'text-4xl font-black uppercase text-[var(--color-accent)]',
    notFoundButton: 'font-black text-[var(--color-ink)] hover:text-[var(--color-accent)]',
  },
};
