import { getActiveRouteId } from '../../routes/routeConfig';
import { styles } from '../../styles/portfolioStyles';
import { GlslBackground } from './GlslBackground';
import { TopNav } from '../navigation/TopNav';

// Shared page frame: renders the persistent navigation and keeps route content layered consistently.
export function AppShell({ children, path, personalInfo, onNavigate }) {
  const activeRouteId = getActiveRouteId(path);

  return (
    <div className={styles.app.root}>
      <GlslBackground />
      <TopNav personalInfo={personalInfo} activeRouteId={activeRouteId} onNavigate={onNavigate} />
      <main className="relative z-10">{children}</main>
    </div>
  );
}
