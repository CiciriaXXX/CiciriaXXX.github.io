import { AppShell } from './components/layout/AppShell';
import { personalInfo } from './data/personal';
import { projectsBySlug } from './data/projects';
import { HomePage } from './pages/HomePage';
import { ProjectPage } from './pages/ProjectPage';
import { useHashRoute } from './routes/useHashRoute';

function getProjectRoute(path) {
  const [, sectionPath, slug] = path.split('/');
  if (!slug || !['games', 'tech-art', 'graphics'].includes(sectionPath)) return null;

  return {
    project: projectsBySlug[slug],
    fallbackPath: sectionPath === 'games' ? '#games' : '#tech-art',
  };
}

function RouterView({ path, navigate }) {
  const projectRoute = getProjectRoute(path);

  if (projectRoute) {
    return (
      <ProjectPage
        project={projectRoute.project}
        fallbackPath={projectRoute.fallbackPath}
        onNavigate={navigate}
      />
    );
  }

  return <HomePage personalInfo={personalInfo} onNavigate={navigate} />;
}

export default function App() {
  const { path, navigate } = useHashRoute();

  return (
    <AppShell path={path} personalInfo={personalInfo} onNavigate={navigate}>
      <RouterView path={path} navigate={navigate} />
    </AppShell>
  );
}
