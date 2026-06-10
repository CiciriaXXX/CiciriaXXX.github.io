import { ArrowLeft, ExternalLink } from 'lucide-react';
import { styles } from '../../styles/portfolioStyles';
import { useFallbackProjectImage } from './imageFallback';

// Full project detail layout with overview, media, skills, and optional external link.
export function ProjectDetailView({ project, onBack }) {
  return (
    <article className={styles.detail.root}>
      <button type="button" onClick={onBack} className={styles.detail.backButton}>
        <ArrowLeft size={16} /> Back to projects
      </button>

      <header className={styles.detail.header}>
        <div>
          <p className={styles.detail.category}>{project.category}</p>
          <h1 className={styles.detail.title}>
            {project.title}
          </h1>
        </div>
        <div className={styles.detail.intro}>
          <p className={styles.detail.description}>{project.description}</p>
          <p className={styles.detail.role}>{project.details}</p>
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.detail.externalLink}
            >
              Open external page <ExternalLink size={16} />
            </a>
          ) : null}
        </div>
      </header>

      <div className={styles.detail.mediaFrame}>
        <img
          src={project.image}
          alt={project.title}
          onError={useFallbackProjectImage}
          className={styles.detail.mediaImage}
        />
      </div>

      <section className={styles.detail.skills}>
        <h2 className={styles.detail.skillsTitle}>Tools / Skills</h2>
        <div className={styles.detail.skillList}>
          {project.tech.map((tech) => (
            <span key={tech}>
              {tech} +
            </span>
          ))}
        </div>
      </section>
    </article>
  );
}
