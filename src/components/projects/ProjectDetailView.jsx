import { ArrowLeft, ExternalLink } from 'lucide-react';
import { styles } from '../../styles/portfolioStyles';
import { useFallbackProjectImage } from './imageFallback';
import { StudyContent } from './StudyContent';

const placeholderSections = [
  { id: 'concept', title: 'Concept & Goals', text: 'The project’s starting point, inspirations, and design goals will be explored here.' },
  { id: 'process', title: 'Design & Development', text: 'Development notes, iterations, and behind-the-scenes images will be added here.' },
  { id: 'reflection', title: 'Challenges & Reflection', text: 'Key challenges, solutions, and lessons learned will be shared here.' },
];

function jumpToSection(event, id) {
  // Keep the project hash route intact while navigating within this article.
  event.preventDefault();
  const target = document.getElementById(id);
  if (!target) return;
  target.focus({ preventScroll: true });
  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY - 112,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  });
}

export function ProjectDetailView({ project, onBack }) {
  const sections = project.breakdown ?? placeholderSections;
  const descriptionBesideMetadata = project.overviewLayout === 'metadata-description';
  return (
    <article className={styles.detail.root}>
      <button type="button" onClick={onBack} className={styles.detail.backButton}>
        <ArrowLeft size={16} /> Back to projects
      </button>
      <header className="border-b-2 border-[var(--color-accent)] pb-10">
        <p className={styles.detail.category}>{project.category}</p>
        <h1 className={styles.detail.title}>{project.title}</h1>
      </header>
      <section aria-labelledby="overview-heading" className="space-y-8">
        <h2 id="overview-heading" className="font-display text-4xl text-[var(--color-accent)]">Overview</h2>
        <div className={`grid items-start gap-10 ${descriptionBesideMetadata ? 'md:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)]' : 'lg:grid-cols-[0.85fr_1.15fr]'}`}>
          <div className="min-w-0 space-y-8">
            {!descriptionBesideMetadata && <p className={styles.detail.description}>{project.description}</p>}
            <dl className="space-y-5 text-base leading-relaxed">
              {project.completed && <div><dt className="overview-label">{project.breakdown ? 'Period' : 'Completed'}</dt><dd>{project.completed}</dd></div>}
              <div><dt className="overview-label">Software</dt><dd>{project.tech.join(' / ')}</dd></div>
              <div>
                <dt className="overview-label">{project.team ? 'Team & Contributions' : 'Project / Role'}</dt>
                <dd>
                  {project.team ? (
                    <ul className="space-y-3">
                      {project.team.map((member) => (
                        <li key={member.name} className={member.owner ? 'font-bold text-[var(--color-accent)]' : ''}>
                          {member.name} — {member.role}
                        </li>
                      ))}
                    </ul>
                  ) : project.solo ? 'Solo project — Shichun Xu' : project.details}
                </dd>
              </div>
              {project.jam && <div><dt className="overview-label">Game Jam</dt><dd>{project.jam}</dd></div>}
            </dl>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.detail.externalLink}>
                {project.link.includes('.itch.io/') ? 'Play on itch.io' : 'Open external page'} <ExternalLink size={20} />
              </a>
            )}
          </div>
          <div className="min-w-0 space-y-4">
            {descriptionBesideMetadata ? (
              <p className={styles.detail.description}>{project.description}</p>
            ) : project.videoId ? (
              <>
                <h3 className="overview-label">Walkthrough</h3>
                <iframe
                  key={project.videoId}
                  title={`${project.title} walkthrough`}
                  src={`https://www.youtube-nocookie.com/embed/${project.videoId}?rel=0`}
                  className="aspect-video w-full rounded-md border-0 bg-black/25"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <a href={`https://www.youtube.com/watch?v=${project.videoId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)] underline underline-offset-4">
                  Watch on YouTube <ExternalLink size={14} />
                </a>
              </>
            ) : (
              <div className={styles.detail.mediaFrame}>
                <img src={project.image} alt={project.title} onError={useFallbackProjectImage} className={styles.detail.mediaImage} />
              </div>
            )}
          </div>
        </div>
      </section>
      <section aria-labelledby={project.hideBreakdownHeading ? undefined : 'breakdown-heading'} aria-label={project.hideBreakdownHeading ? 'Rendering studies' : undefined} className="border-t-2 border-[var(--color-accent)] pt-10">
        {!project.hideBreakdownHeading && <h2 id="breakdown-heading" className="mb-8 font-display text-4xl text-[var(--color-accent)]">Breakdown</h2>}
        <div className="grid items-start gap-10 md:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Breakdown contents" className="rounded-md border border-white/15 bg-white/5 p-5 md:sticky md:top-28 md:max-h-[calc(100dvh-9rem)] md:overflow-y-auto">
            <p className="overview-label mb-4">Contents</p>
            <ol className="space-y-4">
              {sections.map((section, index) => {
                const id = `${project.slug}-${section.id}`;
                return (
                  <li key={section.id}>
                    <a href={`#/${project.sectionId === 'game' ? 'games' : 'tech-art'}/${project.slug}`} onClick={(event) => jumpToSection(event, id)} className="block text-sm leading-relaxed text-[var(--color-accent)] hover:underline focus-visible:underline">
                      <span className="mr-2 opacity-50">{String(index + 1).padStart(2, '0')}</span>{section.title}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
          <div className="min-w-0 space-y-10">
            {sections.map((section, index) => (
              <section key={section.id} id={`${project.slug}-${section.id}`} tabIndex={-1} className="min-h-[320px] scroll-mt-28 rounded-md border border-white/15 bg-white/[0.035] p-6 focus-visible:outline focus-visible:outline-[var(--color-accent)] md:p-10">
                <p className="overview-label mb-4">{String(index + 1).padStart(2, '0')}{!project.breakdown && ' / Coming soon'}</p>
                <h3 className={`mb-6 font-display leading-tight text-[var(--color-accent)] ${section.blocks ? 'text-4xl md:text-5xl' : 'text-3xl'}`}>{section.title}</h3>
                {section.blocks ? <StudyContent section={section} /> : <p className="max-w-2xl text-lg leading-relaxed text-white/75">{section.text}</p>}
              </section>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
