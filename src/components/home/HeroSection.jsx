import { ExternalLink } from 'lucide-react';
import { styles } from '../../styles/portfolioStyles';
import { HeroImage } from './HeroImage';

export function HeroSection({ personalInfo }) {
  return (
    <section id="home" className={styles.hero.section}>
      <div className={styles.hero.inner}>
        <HeroImage />
        <div className={styles.hero.copy}>
          <p className={styles.hero.ghostName}>{personalInfo.name}</p>
          <h1 className={styles.hero.title}>{personalInfo.name}</h1>
          <p className={styles.hero.subtitle}>Shichun Xu</p>
          <div className={styles.hero.body}>
            <p>
              <span className={styles.hero.accentText}>Tech Artist and Game Developer</span>{' '}
              making small games, rendering experiments, and character-driven visual work.
            </p>
            <p className={styles.hero.bodySmall}>
              Also work across <span className={styles.hero.strong}>programming</span>,{' '}
              <span className={styles.hero.strong}>gameplay design</span>, and{' '}
              <span className={styles.hero.strong}>2D art</span>.
            </p>
          </div>
          <div className={styles.hero.links}>
            <a className={styles.hero.primaryLink} href={personalInfo.links.itch}>
              Itch.io
            </a>
            <a className={styles.hero.secondaryLink} href={personalInfo.links.github}>
              GitHub <ExternalLink size={14} />
            </a>
            <a className={styles.hero.secondaryLink} href={personalInfo.links.linkedin}>
              LinkedIn <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
