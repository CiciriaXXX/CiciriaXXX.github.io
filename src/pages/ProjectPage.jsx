import { ProjectDetailView } from '../components/projects/ProjectDetailView';
import { styles } from '../styles/portfolioStyles';

// Route-level wrapper for project detail pages, including the not-found fallback.
export function ProjectPage({ project, fallbackPath, onNavigate }) {
  if (!project) {
    return (
      <div className={`${styles.projectPage.container} ${styles.projectPage.notFound}`}>
        <h1 className={styles.projectPage.notFoundTitle}>Project not found</h1>
        <button type="button" onClick={() => onNavigate(fallbackPath)} className={styles.projectPage.notFoundButton}>
          Back to projects
        </button>
      </div>
    );
  }

  const handleBack = () => {
    onNavigate(`#project-${project.slug}`);
  };

  return (
    <div className={styles.projectPage.container}>
      <ProjectDetailView project={project} onBack={handleBack} />
    </div>
  );
}
