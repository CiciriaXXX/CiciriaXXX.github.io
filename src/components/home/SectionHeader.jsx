import { styles } from '../../styles/portfolioStyles';

export function SectionHeader({ eyebrow, title }) {
  return (
    <header className={styles.section.header}>
      <p className={styles.section.eyebrow}>{eyebrow}</p>
      <h2 className={styles.section.title}>{title}</h2>
    </header>
  );
}
