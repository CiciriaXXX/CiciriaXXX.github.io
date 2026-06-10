import { Gamepad2, Github, Linkedin } from 'lucide-react';
import { styles } from '../../styles/portfolioStyles';
import { HeroImage } from './HeroImage';

// Opening section with author identity, short bio, and icon-only social links.
export function HeroSection({ personalInfo }) {
  return (
    <section id="home" className={styles.hero.section}>
      <div className={styles.hero.inner}>
        <HeroImage />
        <div className={styles.hero.copy}>
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
            <a className={styles.hero.iconLink} href={personalInfo.links.itch} aria-label="Open Itch.io">
              <Gamepad2 size={22} />
            </a>
            <a className={styles.hero.iconLink} href={personalInfo.links.github} aria-label="Open GitHub">
              <Github size={22} />
            </a>
            <a className={styles.hero.iconLink} href={personalInfo.links.linkedin} aria-label="Open LinkedIn">
              <Linkedin size={22} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
