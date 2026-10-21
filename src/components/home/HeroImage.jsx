import { styles } from '../../styles/portfolioStyles';

// Layered hero artwork treatment on the left side of the home page.
export function HeroImage() {
  return (
    <div className={styles.hero.imageStage}>
      {styles.hero.imageLayers.map((layerClass, index) => (
        <div
          key={layerClass}
          className={styles.hero.imageFrame(layerClass)}
        >
          <img src="/cecilia-portrait-cool-v3.png" alt={index === styles.hero.imageLayers.length - 1 ? 'Portrait of Cecilia Xu' : ''} className={styles.hero.image} />
        </div>
      ))}
    </div>
  );
}
