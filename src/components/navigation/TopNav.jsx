import { navRoutes } from '../../routes/routeConfig';
import { styles } from '../../styles/portfolioStyles';

export function TopNav({ personalInfo, activeRouteId, onNavigate }) {
  return (
    <header className={styles.nav.header}>
      <nav className={styles.nav.inner}>
        <button type="button" onClick={() => onNavigate('#home')} className={styles.nav.brandButton} aria-label="Open home">
          <span className={styles.nav.brandName}>
            {personalInfo.name}
          </span>
          <span className={styles.nav.brandTitle}>{personalInfo.title}</span>
        </button>

        <div className={styles.nav.links}>
          {navRoutes.map(({ id, path, label }) => (
            <button
              type="button"
              key={id}
              onClick={() => onNavigate(path)}
              className={styles.nav.link(activeRouteId === id)}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
