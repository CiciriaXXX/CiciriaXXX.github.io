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

export function StudyContent({ section }) {
  return (
    <div className="space-y-6 text-base leading-8 text-white/80 md:text-lg" lang="en">
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
      {section.blocks.map((block, index) => {
        if (block.type === 'heading') return <h4 key={index} className="!mt-10 border-t border-white/10 pt-5 text-2xl font-bold leading-snug text-[var(--color-accent)] md:text-[28px]">{block.text}</h4>;
        if (block.type === 'image') return (
          <a key={index} href={block.src} target="_blank" rel="noopener noreferrer" className="block" title="Open full-size diagram">
            <img src={block.src} alt={block.alt} width={block.width} height={block.height} loading="lazy" decoding="async" className="mx-auto h-auto max-h-[65vh] max-w-full rounded-md object-contain" />
          </a>
        );
        if (block.type === 'reference') return <p key={index} className="text-sm leading-7"><a href={block.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] underline decoration-white/30 underline-offset-4 hover:decoration-current">{block.label} ↗</a></p>;
        return <p key={index}><InlineText text={block.text} /></p>;
      })}
    </div>
  );
}
