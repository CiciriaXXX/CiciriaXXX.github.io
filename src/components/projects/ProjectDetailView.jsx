import { ArrowLeft, ExternalLink } from 'lucide-react';
import { styles } from '../../styles/portfolioStyles';
import { useFallbackProjectImage } from './imageFallback';
import { PendingMedia } from './ProjectMedia';
import { HierarchicalBreakdown } from './HierarchicalBreakdown';

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
  const chinese = project.lang === 'zh-CN';
  return (
    <article data-project={project.slug ?? project.id} lang={project.lang ?? 'en'} className={`${styles.detail.root} ${chinese ? 'project-chinese' : ''}`}>
      <button type="button" onClick={onBack} className={styles.detail.backButton}>
        <ArrowLeft size={16} /> {chinese ? '返回项目' : 'Back to projects'}
      </button>
      <header className="border-b-2 border-[var(--color-accent)] pb-10">
        <p className={styles.detail.category}>{project.category}</p>
        <h1 className={styles.detail.title}>{project.title}</h1>
      </header>
      <section aria-labelledby="overview-heading" className="space-y-8">
        <h2 id="overview-heading" className="project-article-heading">{chinese ? '项目概览' : 'Overview'}</h2>
        <div className={`grid items-start gap-10 ${descriptionBesideMetadata ? 'md:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)]' : 'lg:grid-cols-[0.85fr_1.15fr]'}`}>
          <div className="min-w-0 space-y-8">
            {!descriptionBesideMetadata && <p className={styles.detail.description}>{project.description}</p>}
            <dl className="space-y-5 text-base leading-relaxed">
              {project.completed && <div><dt className="overview-label">{chinese ? '参与时间' : project.breakdown ? 'Period' : 'Completed'}</dt><dd>{project.completed}</dd></div>}
              <div><dt className="overview-label">{project.toolsLabel ?? 'Software'}</dt><dd>{project.tech.join(' / ')}</dd></div>
              <div>
                <dt className="overview-label">{chinese ? '个人职责' : project.team ? 'Team & Contributions' : 'Project / Role'}</dt>
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
              {project.metadata?.map(({ label, value }) => <div key={label}><dt className="overview-label">{label}</dt><dd>{value}</dd></div>)}
            </dl>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.detail.externalLink}>
                {project.linkLabel ?? (project.link.includes('.itch.io/') ? 'Play on itch.io' : 'Open external page')} <ExternalLink size={20} />
              </a>
            )}
            {project.overviewNote && <PendingMedia {...project.overviewNote} />}
          </div>
          <div className="min-w-0 space-y-4">
            {descriptionBesideMetadata ? (
              <p className={styles.detail.description}>{project.description}</p>
            ) : project.walkthroughVideo ? (
              <div className="space-y-3">
                <h3 className="overview-label">Walkthrough</h3>
                <video
                  src={project.walkthroughVideo}
                  poster={project.walkthroughPoster}
                  controls
                  playsInline
                  preload="none"
                  aria-label={`${project.title} walkthrough`}
                  className="aspect-video w-full rounded-md bg-black"
                />
              </div>
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
              <figure>
                <div className={styles.detail.mediaFrame}>
                  <img src={project.overviewImage ?? project.image} alt={project.overviewImageAlt ?? project.title} onError={useFallbackProjectImage} className={styles.detail.mediaImage} />
                </div>
                {project.mediaCredit && <figcaption className="mt-3 text-sm leading-relaxed text-white/60">{project.mediaCredit}</figcaption>}
              </figure>
            )}
          </div>
        </div>
        {project.disclosure && <p className="border-l-2 border-[var(--color-accent)] bg-white/5 px-5 py-4 text-sm leading-7 text-white/75">{project.disclosure}</p>}
      </section>
      <section aria-labelledby="breakdown-heading" className="border-t-2 border-[var(--color-accent)] pt-10">
        <h2 id="breakdown-heading" className="project-article-heading mb-8">{project.breakdownTitle ?? 'Breakdown'}</h2>
        <HierarchicalBreakdown project={project} sections={sections} jumpToSection={jumpToSection} />
      </section>
    </article>
  );
}
