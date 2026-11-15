import { StudyContent } from './StudyContent';
import './hierarchicalBreakdown.css';

function Contents({ sections, project, jumpToSection, depth = 0 }) {
  return (
    <ol className={depth ? 'breakdown-tree-children' : 'breakdown-tree-roots'}>
      {sections.map((section) => (
        <li key={section.id}>
          <a href={`#${project.sectionPath}/${project.slug}`} onClick={(event) => jumpToSection(event, `${project.slug}-${section.id}`)}>{section.title}</a>
          {depth < 2 && !section.hideSubsectionsInContents && section.blocks?.some((block) => ['heading', 'technical-panel'].includes(block.type) && block.id) && (
            <ol className="breakdown-tree-children breakdown-block-links">
              {section.blocks.filter((block) => ['heading', 'technical-panel'].includes(block.type) && block.id).map((block) => (
                <li key={block.id}>
                  <a href={`#${project.sectionPath}/${project.slug}`} onClick={(event) => jumpToSection(event, block.id)}>{(block.title ?? block.text).replace(/^\d+ \/ /, '')}</a>
                </li>
              ))}
            </ol>
          )}
          {depth < 2 && !section.hideSubsectionsInContents && section.children && <Contents sections={section.children} project={project} jumpToSection={jumpToSection} depth={depth + 1} />}
        </li>
      ))}
    </ol>
  );
}

function Topic({ section, project, depth = 0 }) {
  const Heading = `h${Math.min(depth + 3, 6)}`;
  const id = `${project.slug}-${section.id}`;
  return (
    <section className={`breakdown-topic breakdown-depth-${depth}`} aria-labelledby={id}>
      <Heading id={id} tabIndex={-1}>{section.title}</Heading>
      {(section.blocks || section.video || section.embed) && <StudyContent section={{ ...section, contentHeadingLevel: section.contentHeadingLevel ?? Math.min(depth + 4, 6) }} />}
      {section.text && <p className="breakdown-summary">{section.text}</p>}
      {section.children?.map((child) => <Topic key={child.id} section={child} project={project} depth={depth + 1} />)}
    </section>
  );
}

export function HierarchicalBreakdown({ project, sections = project.breakdown, jumpToSection }) {
  return (
    <div className="project-breakdown grid items-start gap-10 md:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
      <nav aria-label="Breakdown contents" className="breakdown-tree rounded-md border border-white/15 bg-white/5 p-5 md:sticky md:top-28 md:max-h-[calc(100dvh-9rem)] md:overflow-y-auto">
        <p className="overview-label mb-4">Contents</p>
        <Contents sections={sections} project={project} jumpToSection={jumpToSection} />
      </nav>
      <div className="min-w-0">
        {sections.map((section) => <Topic key={section.id} section={section} project={project} />)}
      </div>
    </div>
  );
}
