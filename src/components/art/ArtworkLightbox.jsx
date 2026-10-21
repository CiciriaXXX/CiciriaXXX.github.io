import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

export function ArtworkLightbox({ artwork, onClose }) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef(null);
  const count = artwork.images.length;
  const current = artwork.images[index];
  const move = (direction) => setIndex((value) => (value + direction + count) % count);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('artwork-lightbox-open');
    dialogRef.current.querySelector('button').focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        setIndex((value) => (value + (event.key === 'ArrowRight' ? 1 : -1) + count) % count);
      }
      if (event.key === 'Tab') {
        const targets = dialogRef.current.querySelectorAll('button, [tabindex="0"]');
        const first = targets[0];
        const last = targets[targets.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove('artwork-lightbox-open');
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [count, onClose]);

  const buttonClass = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]';
  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={`${artwork.title} gallery`} className="fixed inset-0 z-[100] flex h-[100dvh] flex-col bg-[#101416] text-white">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/15 px-5 py-3">
        <p className="font-display text-xl text-[var(--color-accent)]">{artwork.title}</p>
        <button type="button" onClick={onClose} className={buttonClass} aria-label="Close gallery"><X size={24} /></button>
      </header>
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,0.6fr)] md:grid-cols-[minmax(0,1fr)_320px] md:grid-rows-1 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-h-0 min-w-0 items-center justify-center p-3 md:p-6">
          <img key={current.src} src={current.src} alt={current.title} className="h-full w-full object-contain" />
        </div>
        <section aria-label="Artwork details" tabIndex={0} className="min-h-0 overflow-y-auto border-t border-white/15 p-5 md:border-l md:border-t-0 md:p-7">
          <p className="text-sm text-white/60">{artwork.year ?? current.year}</p>
          <h2 className="mt-2 font-display text-2xl text-[var(--color-accent)]">{current.title}</h2>
          <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-white/80">{artwork.description ?? current.description}</p>
        </section>
      </div>
      <footer className="flex shrink-0 items-center justify-center gap-6 border-t border-white/15 px-5 py-3">
        <button type="button" onClick={() => move(-1)} className={buttonClass} aria-label="Previous image"><ArrowLeft size={22} /></button>
        <p aria-live="polite" aria-atomic="true" className="min-w-16 text-center text-sm">{index + 1} / {count}</p>
        <button type="button" onClick={() => move(1)} className={buttonClass} aria-label="Next image"><ArrowRight size={22} /></button>
      </footer>
    </div>
  );
}
