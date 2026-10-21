import { styles } from '../../styles/portfolioStyles';
import { SectionHeader } from '../home/SectionHeader';

export function ArtworkGallery({ artworks, onPreview }) {
  return (
    <section id="2d-art" className={styles.artwork.section}>
      <SectionHeader eyebrow="Illustration / Graphic Design / Character Design" title="2D Art" />
      <div className={styles.artwork.grid}>
        {artworks.map((artwork) => (
          <article key={artwork.id} className={styles.artwork.card}>
            <button type="button" onClick={() => onPreview(artwork)}
              className="mb-4 block aspect-square w-full overflow-hidden rounded-md bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
              aria-label={`Open ${artwork.title} gallery`}>
              <img src={artwork.cover} alt="" loading="lazy" className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]" />
            </button>
            <button type="button" onClick={() => onPreview(artwork)} className={styles.artwork.titleButton}>
              <h3 className={styles.artwork.title}>{artwork.title}</h3>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
