import { useState } from 'react';
import { styles } from '../../styles/portfolioStyles';
import { useFallbackProjectImage } from './imageFallback';

function fitFrameToImage(event) {
  const { naturalWidth, naturalHeight, parentElement } = event.currentTarget;
  if (!naturalWidth || !naturalHeight || !parentElement) return;
  parentElement.style.aspectRatio = `${naturalWidth} / ${naturalHeight}`;
}

// Large alternating preview row used on the home page project sections.
export function ProjectPreviewCard({ project, onOpen }) {
  const [previewing, setPreviewing] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const stopPreview = () => {
    setPreviewing(false);
    setPreviewReady(false);
  };
  const startPreview = () => {
    if (project.previewVideo && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      setPreviewing(true);
    }
  };
  const isReversed = project.index % 2 === 1;
  const handleOpen = () => {
    onOpen(project);
  };

  return (
    <article id={`project-${project.slug}`} className={styles.projectCard.article(isReversed)}>
      <button
        type="button"
        onClick={handleOpen}
        onPointerEnter={(event) => { if (event.pointerType === 'mouse') startPreview(); }}
        onPointerLeave={stopPreview}
        onFocus={startPreview}
        onBlur={stopPreview}
        className={styles.projectCard.mediaButton(isReversed)}
        aria-label={`Open ${project.title}`}
      >
        <img
          src={project.image}
          alt={project.title}
          onLoad={fitFrameToImage}
          onError={useFallbackProjectImage}
          className={styles.projectCard.mediaImage}
        />
        {previewing && (
          <video
            src={project.previewVideo}
            autoPlay
            muted
            loop
            playsInline
            onPlaying={() => setPreviewReady(true)}
            onError={stopPreview}
            className={`pointer-events-none absolute inset-0 h-full w-full object-contain bg-black transition-opacity ${previewReady ? 'opacity-100' : 'opacity-0'}`}
            tabIndex={-1}
            aria-hidden="true"
          />
        )}
      </button>

      <div className={styles.projectCard.content(isReversed)}>
        <div>
          <button type="button" onClick={handleOpen} className={styles.projectCard.titleButton(isReversed)}>
            <h3 className={styles.projectCard.title}>
              {project.title}
            </h3>
          </button>
        </div>

        <div className={styles.projectCard.body}>
          <p className={styles.projectCard.role}>{project.details}</p>
          <p className={styles.projectCard.category}>{project.category}</p>
          <p className={styles.projectCard.description}>{project.description}</p>
        </div>

      </div>
    </article>
  );
}
