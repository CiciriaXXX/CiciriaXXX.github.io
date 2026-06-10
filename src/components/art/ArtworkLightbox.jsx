import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { styles } from '../../styles/portfolioStyles';
import { cx } from '../../styles/classNames';

// Full-screen artwork viewer; hides site navigation and shows only the selected image.
export function ArtworkLightbox({ artwork, onClose }) {
  const [imageFitClass, setImageFitClass] = useState('h-screen');

  useEffect(() => {
    document.body.classList.add('artwork-lightbox-open');

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('artwork-lightbox-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
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
        <img
          src={artwork.src}
          alt={artwork.title}
          className={cx(styles.lightbox.image, imageFitClass)}
          onLoad={(event) => {
            // Fill either viewport width or height while preserving the complete artwork.
            const image = event.currentTarget;
            const imageRatio = image.naturalWidth / image.naturalHeight;
            const viewportRatio = window.innerWidth / window.innerHeight;
            setImageFitClass(imageRatio >= viewportRatio ? 'w-screen' : 'h-screen');
          }}
        />
        <figcaption className={styles.lightbox.caption}>
          <p className={styles.lightbox.year}>{artwork.year}</p>
          <h3 className={styles.lightbox.title}>{artwork.title}</h3>
        </figcaption>
      </figure>
    </div>
  );
}
