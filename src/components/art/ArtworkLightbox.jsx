import { useEffect } from 'react';
import { X } from 'lucide-react';
import { styles } from '../../styles/portfolioStyles';

export function ArtworkLightbox({ artwork, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.lightbox.overlay}>
      <button
        type="button"
        onClick={onClose}
        className={styles.lightbox.closeButton}
        aria-label="Close preview"
      >
        <X size={28} />
      </button>
      <figure className={styles.lightbox.figure}>
        <img src={artwork.src} alt={artwork.title} className={styles.lightbox.image} />
        <figcaption className={styles.lightbox.caption}>
          <p className={styles.lightbox.year}>{artwork.year}</p>
          <h3 className={styles.lightbox.title}>{artwork.title}</h3>
        </figcaption>
      </figure>
    </div>
  );
}
