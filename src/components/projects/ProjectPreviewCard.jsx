import { styles } from '../../styles/portfolioStyles';
import { useFallbackProjectImage } from './imageFallback';

export function ProjectPreviewCard({ project, onOpen }) {
  const isReversed = project.index % 2 === 1;

  return (
    <article className={styles.projectCard.article(isReversed)}>
      <button
        type="button"
        onClick={() => onOpen(project)}
        className={styles.projectCard.mediaButton(isReversed)}
        aria-label={`Open ${project.title}`}
      >
        <img
          src={project.image}
          alt={project.title}
          onError={useFallbackProjectImage}
          className={styles.projectCard.mediaImage}
        />
      </button>

      <div className={styles.projectCard.content(isReversed)}>
        <div>
          <button type="button" onClick={() => onOpen(project)} className={styles.projectCard.titleButton(isReversed)}>
            <h3 className={styles.projectCard.title}>
              {project.title}
            </h3>
          </button>
        </div>

        <div className={styles.projectCard.body}>
          <p className={styles.projectCard.role}>{project.details}</p>
          <p className={styles.projectCard.category}>{project.category}</p>
          <p className={styles.projectCard.description}>{project.description}</p>
        </div>

        <div className={styles.projectCard.techList(isReversed)}>
          {project.tech.map((tech) => (
            <span key={tech}>
              {tech} +
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
