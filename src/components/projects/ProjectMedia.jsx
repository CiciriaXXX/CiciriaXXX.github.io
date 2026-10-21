import { useEffect, useRef, useState } from 'react';
import './projectMedia.css';

const base = '/cycle-of-darkness';
const simple = (label, draft, final = draft) => ({ label, segments: [{ label, draft, final }] });
const attack = (label, draftPrep, finalPrep, action) => ({ label, segments: [
  { label: 'Wind-up / Anticipation', draft: draftPrep, final: finalPrep },
  { label: 'Attack', draft: action, final: action },
] });
const creatures = [
  { id: 'elite', name: 'Elite Fishman', width: 100, height: 100, allWidth: 100, scale: 2, actions: [
    attack('Horizontal Slash', 'anticipation_attack_horizontal.gif', 'attack_horizontal_anticipation.png', 'attack_horizontal.gif'),
    attack('Leaping Slash', 'anticipation_attack_vertical_corrected.gif', 'attack_vertical_anticipation.gif', 'attack_vertical.gif'),
    simple('Idle', 'idle.gif'), simple('Walk', 'move.gif'), simple('Run / Sprint', 'sprint.gif', 'run.gif'), simple('Death', 'dead.gif'),
  ] },
  { id: 'giant', name: 'Giant Fishman', width: 180, height: 84, allWidth: 200, scale: 2, actions: [
    ...[1, 2, 3].map((n) => attack(`Punch ${n}`, `anticipation_attack_${n}.gif`, `anticipation_attack_${n}.gif`, `attack_${n}.gif`)),
    simple('Idle', 'idle.gif'), simple('Walk', 'move.gif'), simple('Death', 'dead.gif'),
  ] },
];

// Full animation sizing stays at 1.5; comparisons request 2.25 (another 1.5x).
// Bound the rendered width to the stage content box and retain the source aspect ratio.
function PixelSprite({ src, alt, width, height, maxScale = 1, displayScale = 1.5, featured = false }) {
  const stage = useRef(null);
  const [scale, setScale] = useState(displayScale);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const availableWidth = entry.contentRect.width;
      const previousScale = Math.max(1, Math.min(maxScale, Math.floor((availableWidth - 24) / width)));
      setScale(Math.min(previousScale * displayScale, availableWidth / width));
    });
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, [width, maxScale, displayScale]);
  return (
    <div ref={stage} className={`pixel-stage ${featured ? 'pixel-stage-featured' : ''}`}>
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async"
        style={{ width: width * scale, height: 'auto', maxWidth: '100%' }} className="pixel-sprite" />
    </div>
  );
}

function AnimationComparison({ creature }) {
  const [selected, setSelected] = useState(0);
  const action = creature.actions[selected];
  const displayScale = 2.25;
  // Reserve space for the widest action plus stage padding before using two columns.
  const frameMinWidth = (creature.id === 'giant' ? 200 : creature.width) * displayScale + 24;
  return (
    <div className="space-y-5">
      <h5 className="text-xl font-bold text-[var(--color-accent)]">{creature.name} · Sketches & Final Animation</h5>
      <div className="media-options" aria-label={`${creature.name} action selection`}>
        {creature.actions.map((item, index) => (
          <button type="button" key={item.label} onClick={() => setSelected(index)} aria-pressed={index === selected} className="media-option">{item.label}</button>
        ))}
      </div>
      <div className="space-y-5">
        {action.segments.map((segment) => (
          <div key={segment.label}>
            <p className="mb-2 text-sm text-white/65">{action.label} · {segment.label}</p>
            <div className="animation-pair" style={{ '--animation-frame-min-width': `${frameMinWidth}px` }}>
              {['draft', 'final'].filter((phase) => segment[phase]).map((phase) => {
                const width = creature.id === 'giant' && segment[phase] === 'dead.gif' && phase === 'final' ? 200 : creature.width;
                return (
                  <figure key={phase} className="min-w-0">
                    <PixelSprite src={`${base}/animations/${creature.id}/${phase}/${segment[phase]}`} alt={`${creature.name} · ${action.label} · ${segment.label} · ${phase === 'draft' ? 'Animation Sketch' : 'Final Animation'}`} width={width} height={creature.height} displayScale={displayScale} />
                    <figcaption className="mt-2 text-center text-sm text-white/65">{phase === 'draft' ? 'Animation Sketch' : 'Final Animation'}{segment[phase]?.endsWith('.png') && ' · Single-frame wind-up pose'}</figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnimationGallery({ comparisons = false }) {
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/65">{comparisons ? 'Animation Sketches & Final Pixel Animation' : 'Complete Action Sets · Source Animations'}</p>
      </div>
      {!comparisons && <div className="complete-animations">
        {creatures.map((creature) => (
          <figure key={creature.id}>
            <PixelSprite src={`${base}/animations/${creature.id}/final/all.gif`} alt={`${creature.name} complete source animation set`} width={creature.allWidth} height={creature.height} maxScale={creature.scale} featured />
            <figcaption className="mt-2 text-center text-sm text-white/60">{creature.name}</figcaption>
          </figure>
        ))}
      </div>}
      {comparisons && creatures.map((creature) => <AnimationComparison key={creature.id} creature={creature} />)}
    </div>
  );
}

function AnnotatedDiagrams({ items }) {
  return (
    <div className={`technical-figures ${items.every((item) => item.id.endsWith('-config')) ? 'technical-panels' : ''}`}>
      {items.map((item) => <figure key={item.id}>
        <a href={`${base}/annotations/${item.id}.svg`} target="_blank" rel="noopener noreferrer" aria-label={`${item.title}: open full-size image`}>
          <img src={`${base}/annotations/${item.id}.svg`} alt={`${item.title}: English annotations`} loading="lazy" className={`annotated-image ${item.id === 'jellyfish-fsm' ? 'annotated-image-half' : ''}`} />
        </a>
        <figcaption className="mt-3 text-sm leading-7 text-white/65">{item.title}. {item.caption}</figcaption>
      </figure>)}
    </div>
  );
}

function PixelIcons() {
  const icons = [['armor', 'Ice Armor'], ['belt', 'Ice Belt'], ['crown', 'Ice Crown'], ['legendsword', 'Ice Longsword'], ['nacklace', 'Ice Necklace'], ['shoe', 'Ice Boots']];
  return <div className="pixel-icons">{icons.map(([file, label]) => <figure key={file}>
    <img src={`${base}/icons/icon_item_ice_${file}.png`} width="96" height="96" alt={`${label} icon, drawn by Shichun Xu`} loading="lazy" className="pixel-sprite mx-auto" />
    <figcaption className="mt-3 text-center text-sm text-white/65">{label}</figcaption>
  </figure>)}</div>;
}

function MovementComparison() {
  return <div className="movement-comparison">
    <div><h5>Chase · Continuous Adjustment</h5><p>Read the player position continuously → adjust X/Z distances separately → finish when both axes are within range.</p><p>Back away when too close. Used by the two elite enemies.</p></div>
    <div><h5>Flee · Fixed Destination</h5><p>Calculate the retreat destination on entry → move → finish at the arrival threshold.</p><p>The destination stays fixed. Used by jellyfish, bladefish, and slimes.</p></div>
  </div>;
}

const interactables = [
  { id: 'attack-crystal', label: 'Attack Crystal', action: 'Approach Animation', width: 57, height: 82, scale: 2 },
  { id: 'attack-speed-crystal', label: 'Attack-Speed Crystal', action: 'Approach Animation', width: 57, height: 92, scale: 2 },
  { id: 'shield-crystal', label: 'Shield Crystal', action: 'Approach Animation', width: 67, height: 83, scale: 2 },
  { id: 'bomb-flower', label: 'Bomb Flower', action: 'Destruction Warning Animation', width: 133, height: 134, scale: 1 },
  { id: 'spawner-box', label: 'Box', action: 'Idle Animation', width: 68, height: 59, scale: 2 },
];

function InteractionAnimations() {
  return <div className="interaction-animations">
    <div className="interaction-animation-grid">
      {interactables.map((item) => <figure key={item.id}>
        <div className="interaction-animation-stage">
          <img src={base + '/interactions/' + item.id + '.png'}
            alt={item.label + ' · ' + item.action} width={item.width} height={item.height}
            loading="lazy" decoding="async" className="interaction-sprite"
            style={{ width: item.width * item.scale }} />
        </div>
        <figcaption className="mt-3 text-center text-sm leading-6 text-white/70">{item.label}<span className="block text-xs text-white/45">{item.action}</span></figcaption>
      </figure>)}
    </div>
    <p className="mt-4 text-sm leading-7 text-white/60">Animations by the team's artist, shown here to identify the interactable objects.</p>
  </div>;
}

function RoomGallery({ items }) {
  const [selected, setSelected] = useState(0);
  const room = items[selected];
  const label = 'Room ' + String(room.number).padStart(2, '0');
  const src = base + '/rooms/room-' + String(room.number).padStart(2, '0') + '.png';
  return <div className="room-gallery">
    <div className="media-options" role="group" aria-label="Select a room design example">
      {items.map((item, index) => <button key={item.number} type="button" className="media-option" aria-pressed={index === selected} aria-controls="room-study" onClick={() => setSelected(index)}>Room {String(item.number).padStart(2, '0')}</button>)}
    </div>
    <figure id="room-study" className="mt-6" aria-labelledby="room-study-title">
      <figcaption className="mb-4" aria-live="polite">
        <h5 id="room-study-title" className="text-xl font-bold text-[var(--color-accent)]">{label}</h5>
      </figcaption>
      <a className="room-map" href={src} target="_blank" rel="noopener noreferrer" aria-label={label + ': open full-size original'}>
        <img key={src} src={src} alt={label + ' layout; see notes below.'} loading="lazy" />
        {room.points.map((point, index) => <span key={index} className="room-pin" aria-hidden="true" style={{ left: point.x + '%', top: point.y + '%' }}>{index + 1}</span>)}
      </a>
      {room.text ? <p className="mt-4 text-sm leading-7 text-white/75">{room.text}</p> : <ol className="room-notes">
        {room.points.map((point, index) => <li key={index}><span aria-hidden="true">{index + 1}</span><p>{point.text}</p></li>)}
      </ol>}
    </figure>
  </div>;
}

function ReleaseChart({ context, title, series, source, accessed, note }) {
  const ceiling = 1600;
  const ticks = [0, 400, 800, 1200, ceiling];
  const description = `Bar chart: years on the horizontal axis and number of game releases on the vertical axis, starting at zero. ${series.map(({ year, count }) => `${year}: ${count} releases`).join('; ')}.`;
  return <figure className="release-chart">
    <figcaption className="mb-5 text-base font-bold text-[var(--color-accent)]"><span className="mb-2 block text-xs font-normal text-white/55">{context}</span>{title}</figcaption>
    <div role="img" aria-label={description}>
      <p className="release-chart-unit" aria-hidden="true">Game releases</p>
      <div className="release-chart-area" aria-hidden="true">
        <div className="release-chart-axis">
          {ticks.map((tick) => <span key={tick} style={{ bottom: `${tick / ceiling * 100}%` }}>{tick.toLocaleString('en-US')}</span>)}
        </div>
        <div className="release-chart-plot">
          {ticks.map((tick) => <div key={tick} className={`release-chart-gridline ${tick === 0 ? 'release-chart-baseline' : ''}`} style={{ bottom: `${tick / ceiling * 100}%` }} />)}
          <div className="release-chart-columns">
            {series.map(({ year, count }) => <div key={year} className="release-chart-column">
              <div className="release-chart-bar" style={{ height: `${count / ceiling * 100}%` }}>
                <span className="release-chart-value">{count.toLocaleString('en-US')}</span>
              </div>
              <span className="release-chart-year">{year}</span>
            </div>)}
          </div>
        </div>
      </div>
      <p className="release-chart-x-label" aria-hidden="true">Year</p>
    </div>
    <p className="mt-4 text-sm leading-7 text-white/65">{note}</p>
    <p className="mt-2 text-xs leading-6 text-white/55"><a href={source} target="_blank" rel="noopener noreferrer" className="media-link">Source: SteamDB · Action Roguelike</a> · Accessed: {accessed}</p>
  </figure>;
}

export function PendingMedia({ title, text }) {
  return <aside className="pending-media"><p className="font-bold text-[var(--color-accent)]">{title}</p><p className="mt-2 text-sm leading-7 text-white/60">{text}</p></aside>;
}

export function ProjectMedia({ block }) {
  switch (block.type) {
    case 'interaction-animations': return <InteractionAnimations />;
    case 'animation-gallery': return <AnimationGallery />;
    case 'animation-comparisons': return <AnimationGallery comparisons />;
    case 'annotated-diagrams': return <AnnotatedDiagrams items={block.items} />;
    case 'pixel-icons': return <PixelIcons />;
    case 'release-chart': return <ReleaseChart {...block} />;
    case 'movement-comparison': return <MovementComparison />;
    case 'room-gallery': return <RoomGallery items={block.items} />;
    case 'pending-media': return <PendingMedia title={block.title} text={block.text} />;
    case 'process-steps': return <ol className="process-steps">{block.items.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>)}</ol>;
    default: return null;
  }
}
