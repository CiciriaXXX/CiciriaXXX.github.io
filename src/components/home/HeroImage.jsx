import { styles } from '../../styles/portfolioStyles';

// Layered hero artwork treatment on the left side of the home page.
export function HeroImage() {
  return (
    <div className={styles.hero.imageStage}>
      {styles.hero.imageLayers.map((layerClass) => (
        <div
          key={layerClass}
          className={styles.hero.imageFrame(layerClass)}
        >
          <img src="/rose.png" alt="" className={styles.hero.image} />
        </div>
      ))}
    </div>
  );
}
