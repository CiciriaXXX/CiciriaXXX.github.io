import { useLayoutEffect, useState } from 'react';
import { ArtworkGallery } from '../components/art/ArtworkGallery';
import { ArtworkLightbox } from '../components/art/ArtworkLightbox';
import { HeroSection } from '../components/home/HeroSection';
import { PortfolioSection } from '../components/home/PortfolioSection';
import { artworks } from '../data/artworks';
import { sectionsById } from '../data/projects';
import { scrollToAnchor, scrollToElementId } from '../routes/scrollToAnchor';
import { styles } from '../styles/portfolioStyles';

const homeAnchors = ['tech-art', 'games', '2d-art'];

// Home page composes the hero, project sections, 2D gallery, and artwork preview overlay.
export function HomePage({ personalInfo, onNavigate }) {
  const [previewArtwork, setPreviewArtwork] = useState(null);

  // Re-run positioning after the home page has mounted and section nodes exist.
  useLayoutEffect(() => {
    const anchor = window.location.hash.slice(1).split('?')[0];
    if (anchor.startsWith('project-')) {
      scrollToElementId(anchor);
      return;
    }

    if (homeAnchors.includes(anchor)) scrollToAnchor(anchor);
  }, []);

  return (
    <div>
      <HeroSection personalInfo={personalInfo} />

      <div className={styles.home.content}>
        <PortfolioSection
          id="tech-art"
          eyebrow="Shaders / Tools / Rendering"
          title="Tech Art"
          items={sectionsById['tech-art'].projects}
          onOpen={(project) => onNavigate(`/tech-art/${project.slug}`)}
        />

        <PortfolioSection
          id="games"
          eyebrow="Playable Work"
          title="Game Projects"
          items={sectionsById.game.projects}
          onOpen={(project) => onNavigate(`/games/${project.slug}`)}
        />

        <ArtworkGallery artworks={artworks} onPreview={setPreviewArtwork} />
      </div>

      {previewArtwork ? (
        <ArtworkLightbox artwork={previewArtwork} onClose={() => setPreviewArtwork(null)} />
      ) : null}
    </div>
  );
}
