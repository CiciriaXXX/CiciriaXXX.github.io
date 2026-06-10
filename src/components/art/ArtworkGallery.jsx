import { styles } from '../../styles/portfolioStyles';
import { SectionHeader } from '../home/SectionHeader';

function fitFrameToImage(event) {
  const { naturalWidth, naturalHeight, parentElement } = event.currentTarget;
  if (!naturalWidth || !naturalHeight || !parentElement) return;
  parentElement.style.aspectRatio = `${naturalWidth} / ${naturalHeight}`;
}

// 2D art grid; thumbnails crop to fill their preview frame and open the lightbox.
export function ArtworkGallery({ artworks, onPreview }) {
  return (
    <section id="2d-art" className={styles.artwork.section}>
      <SectionHeader eyebrow="Illustration / Fan Work / Sketches" title="2D Art" />
      <div className={styles.artwork.grid}>
        {artworks.map((artwork) => (
          <article key={artwork.id} className={styles.artwork.card}>
            <button
              type="button"
              onClick={() => onPreview(artwork)}
              className={styles.artwork.previewButton}
              aria-label={`Preview ${artwork.title}`}
            >
              <img src={artwork.src} alt={artwork.title} onLoad={fitFrameToImage} className={styles.artwork.thumbnail} />
            </button>
            <p className={styles.artwork.year}>{artwork.year}</p>
            <button type="button" onClick={() => onPreview(artwork)} className={styles.artwork.titleButton}>
              <h3 className={styles.artwork.title}>{artwork.title}</h3>
            </button>
            <p className={styles.artwork.description}>{artwork.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
