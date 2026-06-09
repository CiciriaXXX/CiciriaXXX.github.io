import { getActiveRouteId } from '../../routes/routeConfig';
import { styles } from '../../styles/portfolioStyles';
import { TopNav } from '../navigation/TopNav';

export function AppShell({ children, path, personalInfo, onNavigate }) {
  const activeRouteId = getActiveRouteId(path);

  return (
    <div className={styles.app.root}>
      <TopNav personalInfo={personalInfo} activeRouteId={activeRouteId} onNavigate={onNavigate} />
      <main>{children}</main>
    </div>
  );
}
