import { ProjectPreviewCard } from '../projects/ProjectPreviewCard';
import { styles } from '../../styles/portfolioStyles';
import { SectionHeader } from './SectionHeader';

export function PortfolioSection({ id, eyebrow, title, items, onOpen }) {
  return (
    <section id={id} className={styles.section.root}>
      <SectionHeader eyebrow={eyebrow} title={title} />
      <div>
        {items.map((project, index) => (
          <ProjectPreviewCard key={project.slug} project={{ ...project, index }} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}
