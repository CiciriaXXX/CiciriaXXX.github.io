import { ProjectMedia } from './ProjectMedia';
import { EscapeDiagram } from './EscapeDiagrams';
import './technicalStudy.css';

const mediaTypes = new Set(['animation-gallery', 'interaction-animations', 'animation-comparisons', 'annotated-diagrams', 'pixel-icons', 'movement-comparison', 'room-gallery', 'pending-media', 'process-steps', 'release-chart']);

// The imported note is structured data, never executable HTML.
function InlineText({ text }) {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g).map((part, index) => {
    if (part.startsWith('`')) return <code key={index} className="rounded bg-black/25 px-1.5 py-0.5 text-[0.88em] text-[#e5d6ff] [overflow-wrap:anywhere]">{part.slice(1, -1)}</code>;
    if (part.startsWith('**')) return <strong key={index} className="font-semibold text-[var(--color-accent)]">{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] underline underline-offset-4">{link[1]}</a>;
    return part;
  });
}

function StudyMedia({ block }) {
  if (block.type === 'video') return (
    <figure className="study-figure study-video space-y-3">
      <video src={block.src} poster={block.poster} controls playsInline preload="none" aria-label={block.alt} className="block h-auto w-full rounded-md bg-black/30">
        Your browser does not support video playback. <a href={block.src}>Open video</a>
      </video>
      {block.caption && <figcaption className="text-sm leading-6 text-white/60">{block.caption}</figcaption>}
    </figure>
  );
  return (
    <figure className={`study-figure space-y-3 ${block.naturalSize ? 'study-figure-source' : ''}`} style={block.naturalSize ? { width: block.width, maxWidth: '100%' } : undefined}>
      <a href={block.fullSrc ?? block.src} target="_blank" rel="noopener noreferrer" className="block rounded-md focus-visible:outline focus-visible:outline-offset-4" aria-label={`Open full-size image: ${block.alt}`}>
        <img src={block.src} srcSet={block.srcSet} sizes={block.sizes} alt={block.alt} width={block.width} height={block.height} loading="lazy" decoding="async" className="block h-auto w-full rounded-md" />
      </a>
      {block.caption && <figcaption className="text-sm leading-6 text-white/60">{block.caption}</figcaption>}
    </figure>
  );
}

export function StudyContent({ section }) {
  const PanelHeading = `h${section.contentHeadingLevel ?? 4}`;
  return (
    <div className="study-content text-white/80" lang={section.lang ?? 'en'}>
      {section.embed && (
        <iframe
          src={section.embed}
          title="CS457-Project7A-Shichun Xu"
          loading="lazy"
          className="aspect-video w-full rounded-md border-0 bg-black/30"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          sandbox="allow-downloads allow-forms allow-same-origin allow-scripts allow-top-navigation allow-pointer-lock allow-popups allow-modals allow-orientation-lock allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
          allowFullScreen
        />
      )}
      {section.video && (
        <video controls playsInline preload="none" poster={section.poster} className="max-h-[70vh] w-full rounded-md bg-black/30" aria-label={`${section.title}: demonstration`}>
          <source src={section.video} type="video/mp4" />
          Your browser does not support video playback. <a href={section.video}>Open video</a>
        </video>
      )}
      {section.blocks?.map((block, index) => {
        if (block.type === 'escape-diagram') return <EscapeDiagram key={index} block={block} />;
        if (block.type === 'technical-intro') return (
          <div key={index} className="technical-intro">
            <StudyMedia block={block.media} />
            <StudyContent section={{ blocks: block.blocks, lang: section.lang, layout: 'compact' }} />
          </div>
        );
        if (block.type === 'technical-panel') return (
          <section key={block.id} className="technical-panel" aria-labelledby={block.id}>
            <PanelHeading id={block.id} tabIndex={-1}>{block.title}</PanelHeading>
            <div className={block.media.length ? 'technical-panel-body' : 'technical-panel-text'}>
              {block.media.length > 0 && <div className={`technical-panel-media${block.mediaLayout ? ` technical-panel-media-${block.mediaLayout}` : ''}`}>{block.media.map((item) => <StudyMedia key={item.src} block={item} />)}</div>}
              <StudyContent section={{ blocks: block.blocks, lang: section.lang, layout: 'compact' }} />
            </div>
            {block.detail && <StudyContent section={{ blocks: [block.detail], lang: section.lang, layout: 'compact' }} />}
          </section>
        );
        if (block.type === 'code') return <figure key={index} className="source-excerpt"><figcaption>{block.caption} <span>{block.language ?? 'C#'}</span></figcaption><pre><code>{block.code.split(/(\/\/[^\n]*|\b(?:var|float|if|else|return|true|false|private|public|override|void)\b|\b\d+(?:\.\d+)?f?\b)/g).map((token, i) => <span key={i} className={token.startsWith('//') ? 'code-comment' : /^(var|float|if|else|return|true|false|private|public|override|void)$/.test(token) ? 'code-keyword' : /^\d/.test(token) ? 'code-number' : undefined}>{token}</span>)}</code></pre></figure>;
        if (block.type === 'details') return (
          <details key={index} className="rounded-md border border-white/15 bg-black/10 p-4 md:p-5">
            <summary className="cursor-pointer text-base font-semibold leading-7 text-[var(--color-accent)] focus-visible:outline focus-visible:outline-offset-4">{block.title}</summary>
            <div className="mt-6 min-w-0"><StudyContent section={{ blocks: block.blocks, lang: section.lang, layout: section.layout }} /></div>
          </details>
        );
        if (block.type === 'figure-gallery') return (
          <div key={index} className={`technical-panel-media${block.layout ? ` technical-panel-media-${block.layout}` : ''}`}>
            {block.media.map((item) => <StudyMedia key={item.src} block={item} />)}
          </div>
        );
        if (block.type === 'figure' || block.type === 'video') return <StudyMedia key={index} block={block} />;
        if (block.type === 'note') return <p key={index} role="note" className="study-note"><InlineText text={block.text} /></p>;
        if (mediaTypes.has(block.type)) return <ProjectMedia key={index} block={block} />;
        if (block.type === 'list') return (
          <ul key={index} className="study-list list-disc marker:text-[var(--color-accent)]">
            {block.items.map((item, itemIndex) => <li key={itemIndex} className="pl-1"><InlineText text={item} /></li>)}
          </ul>
        );
        if (block.type === 'heading') return <PanelHeading key={index} id={block.id} tabIndex={block.id ? -1 : undefined} className="study-heading">{block.text}</PanelHeading>;
        if (block.type === 'image') return (
          <a key={index} href={block.src} target="_blank" rel="noopener noreferrer" className="mx-auto block w-4/5" title="Open full-size diagram">
            <img src={block.src} alt={block.alt} width={block.width} height={block.height} loading="lazy" decoding="async" className="block h-auto w-full rounded-md" />
          </a>
        );
        if (block.type === 'reference') return <p key={index} className="text-sm leading-7"><a href={block.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] underline decoration-white/30 underline-offset-4 hover:decoration-current">{block.label} ↗</a></p>;
        return <p key={index}><InlineText text={block.text} /></p>;
      })}
    </div>
  );
}
