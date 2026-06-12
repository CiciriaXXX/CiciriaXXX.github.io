import { styles } from '../../styles/portfolioStyles';
import mainDividerUrl from '../../assets/main-divider.svg';

// Shared section title pattern used to keep portfolio sections visually consistent.
export function SectionHeader({ title }) {
  return (
    <header className={styles.section.header}>
      <h2 className={styles.section.title}>{title}</h2>
      <img
        aria-hidden="true"
        className={styles.section.divider}
        src={mainDividerUrl}
        alt=""
        draggable="false"
      />
    </header>
  );
}
