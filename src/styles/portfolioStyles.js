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
  container: 'mx-auto max-w-[1560px] px-3 md:px-4 xl:px-4',
  detailContainer: 'mx-auto max-w-[1560px] px-3 pb-24 pt-36 md:px-4 xl:px-4',
};

// Central Tailwind class map keeps JSX components focused on structure and content.
export const styles = {
  app: {
    root: 'min-h-screen bg-transparent text-[var(--color-ink)] selection:bg-[var(--color-accent)] selection:text-[var(--color-paper)]',
  },

  nav: {
    header: 'site-nav fixed left-0 right-0 top-0 z-40 border-b border-white/15 bg-[#05051A]/45 backdrop-blur-xl',
    inner: 'mx-auto flex max-w-[1560px] flex-col items-start gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-3 md:px-4',
    brandButton: 'text-left',
    brandName: 'block font-display text-2xl font-normal leading-none text-[var(--color-accent)] transition hover:text-[var(--color-accent-hover)] sm:text-3xl md:text-4xl',
    brandTitle: 'hidden text-xs font-semibold text-[var(--color-ink)] sm:block',
    links: 'flex w-full flex-nowrap justify-start gap-1.5 overflow-x-auto pb-1 text-[13px] font-semibold [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-auto sm:flex-wrap sm:justify-end sm:gap-2 sm:overflow-visible sm:pb-0 sm:text-lg md:text-xl',
    link: (isActive) => cx(
      'shrink-0 rounded-full border px-2.5 py-1 text-[13px] transition duration-200 sm:px-4 sm:py-1.5 sm:text-lg md:text-xl',
      'hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-[var(--color-accent-hover)]',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
      isActive
        ? 'border-white/25 bg-white/[0.16] text-[var(--color-accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_26px_rgba(0,0,0,0.22)]'
        : 'border-transparent text-[var(--color-ink)]',
    ),
  },

  home: {
    content: cx(layout.container, 'space-y-24 py-24'),
  },

  hero: {
    imageLayers: [
      'left-0 top-0 z-[1] brightness-[0.42]',
      'left-[9%] top-[7%] z-[2] brightness-[0.68]',
      'left-[18%] top-[14%] z-[3] brightness-100',
    ],
    section: 'scroll-mt-28 bg-transparent',
    inner: cx(
      layout.container,
      'grid min-h-[760px] items-center gap-12 pb-24 pt-36 sm:pt-40 md:grid-cols-[0.92fr_1.08fr] xl:gap-20',
    ),
    imageStage: 'relative mx-auto h-[500px] w-full max-w-[540px] xl:h-[580px]',
    imageFrame: (layerClass) => cx('absolute aspect-[4/5] w-[78%] overflow-hidden rounded-md bg-[var(--color-paper)]', layerClass),
    image: 'h-full w-full object-cover',
    copy: 'relative px-0 py-0 text-center md:text-left',
    title:
      'relative font-display text-6xl font-normal leading-none text-[var(--color-accent)] [text-shadow:0_0_14px_rgba(255,240,189,0.62),0_0_32px_rgba(255,240,189,0.28)] md:text-8xl',
    subtitle: 'mt-1 text-xl font-black uppercase text-[var(--color-ink)]',
    body: 'mt-12 space-y-5 text-lg leading-relaxed text-[var(--color-ink)]',
    bodySmall: 'text-base',
    accentText: 'font-black text-[var(--color-accent)]',
    strong: 'font-black text-[var(--color-accent)]',
    links: 'mt-8 flex flex-wrap justify-center gap-4 md:justify-start',
    iconLink:
      'inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[var(--color-paper)] shadow-[0_10px_26px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15 hover:text-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-white/70',
  },

  section: {
    root: 'scroll-mt-28 space-y-12',
    header: 'space-y-4',
    eyebrow: 'text-xs font-black uppercase text-[var(--color-ink)]',
    title:
      'font-display text-5xl font-normal leading-none text-[var(--color-accent)] [text-shadow:0_0_12px_rgba(255,240,189,0.58),0_0_28px_rgba(255,240,189,0.24)] md:text-7xl',
    divider:
      'block h-9 w-full select-none object-fill drop-shadow-[0_0_10px_rgba(255,240,189,0.7)] [filter:drop-shadow(0_0_10px_rgba(255,240,189,0.7))_drop-shadow(0_0_24px_rgba(255,240,189,0.32))]',
  },

  projectCard: {
    article: (isReversed) => cx(
      'grid gap-10 py-16 md:items-center md:gap-16 xl:gap-20',
      isReversed
        ? 'md:grid-cols-[0.85fr_1.15fr] xl:grid-cols-[0.78fr_1.22fr]'
        : 'md:grid-cols-[1.15fr_0.85fr] xl:grid-cols-[1.22fr_0.78fr]',
    ),
    mediaButton: (isReversed) => cx(
      'group flex aspect-video w-full items-center justify-center overflow-hidden rounded-md bg-white/[0.055] text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]',
      isReversed && 'md:order-2',
    ),
    mediaImage: 'h-full w-full rounded-md object-contain transition duration-500 group-hover:scale-[1.03]',
    content: (isReversed) => cx('space-y-7', isReversed && 'md:order-1 md:text-right'),
    titleButton: (isReversed) => cx('block text-left', isReversed && 'md:ml-auto md:text-right'),
    title:
      'font-display text-5xl font-normal leading-none text-[var(--color-accent)] [text-shadow:0_0_11px_rgba(255,240,189,0.5),0_0_24px_rgba(255,240,189,0.2)] transition hover:text-[var(--color-accent-hover)] md:text-6xl',
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
      'mb-4 flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-md bg-white/[0.055] text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]',
    thumbnail: 'h-full w-full rounded-md object-contain transition duration-500 group-hover:scale-[1.03]',
    year: 'text-xs font-black uppercase text-[var(--color-ink)]',
    titleButton: 'mt-1 block text-left',
    title: 'font-display text-3xl font-normal text-[var(--color-accent)] [text-shadow:0_0_9px_rgba(255,240,189,0.44),0_0_18px_rgba(255,240,189,0.18)] transition hover:text-[var(--color-accent-hover)]',
    description: 'mt-2 text-sm leading-relaxed text-[var(--color-ink)]',
  },

  lightbox: {
    overlay: 'fixed inset-0 z-50 flex items-center justify-center bg-black/[0.72] p-5 backdrop-blur-sm',
    closeButton: 'absolute right-5 top-5 text-[var(--color-paper)] transition hover:text-[var(--color-accent-hover)]',
    figure: 'flex h-full w-full items-center justify-center',
    image: 'max-h-screen max-w-screen object-contain',
    caption: 'hidden',
    year: 'text-xs font-black uppercase text-[var(--color-paper)]',
    title: 'mt-1 font-display text-2xl font-normal text-[var(--color-accent)] [text-shadow:0_0_9px_rgba(255,240,189,0.44),0_0_18px_rgba(255,240,189,0.18)]',
  },

  detail: {
    root: 'space-y-10',
    backButton:
      'inline-flex items-center gap-2 text-sm font-black text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]',
    header: 'grid gap-8 border-b-2 border-[var(--color-accent)] py-10 md:grid-cols-[0.9fr_1.1fr]',
    category: 'text-sm font-black uppercase text-[var(--color-ink)]',
    title:
      'mt-3 font-display text-5xl font-normal leading-none text-[var(--color-accent)] [text-shadow:0_0_12px_rgba(255,240,189,0.58),0_0_28px_rgba(255,240,189,0.24)] md:text-7xl',
    intro: 'space-y-5 md:pt-8',
    description: 'text-xl leading-relaxed text-[var(--color-ink)]',
    role: 'font-black uppercase text-[var(--color-accent)]',
    externalLink:
      'inline-flex items-center gap-2 border border-[var(--color-accent)] bg-white/10 px-8 py-3 text-sm font-black uppercase text-[var(--color-accent)] transition hover:border-[var(--color-accent-hover)] hover:text-[var(--color-accent-hover)]',
    mediaFrame:
      'flex items-center justify-center overflow-hidden rounded-md bg-white/[0.055] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]',
    mediaImage: 'max-h-[70vh] w-full rounded-md object-contain',
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
