'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { LOCATIONS, HEAT_STATIONS } from '@/lib/locations';

const MAX_RESULTS = 60;

interface Props {
  currentSlug: string | null;
}

function Pill({ slug, label, currentSlug, onSelect }: {
  slug: string;
  label: string;
  currentSlug: string | null;
  onSelect: () => void;
}) {
  const href = slug === 'roma' ? '/' : `/?loc=${slug}`;
  const active = slug === currentSlug;
  return (
    <Link
      href={href}
      onClick={onSelect}
      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-blue-500/25 border border-blue-400/40 text-blue-300'
          : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
}

export default function LocationSelector({ currentSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const currentLoc = useMemo(
    () => LOCATIONS.find(l => l.slug === currentSlug),
    [currentSlug]
  );

  const query = search.toLowerCase().trim();
  const results = useMemo(() => {
    if (!query) return null;
    const out = [];
    for (const l of LOCATIONS) {
      if (l.name.toLowerCase().includes(query)) {
        out.push(l);
        if (out.length >= MAX_RESULTS + 1) break;
      }
    }
    return out;
  }, [query]);

  // Senza ricerca mostro i capoluoghi come scorciatoie.
  const capoluoghi = useMemo(
    () => [...HEAT_STATIONS].sort((a, b) => a.name.localeCompare(b.name, 'it')),
    []
  );

  function close() {
    setSearch('');
    setOpen(false);
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-white/5 transition-colors"
      >
        <span className="text-slate-500 text-xs">Cambia località</span>
        <span className="flex items-center gap-2">
          {currentLoc && (
            <span className="text-blue-300 text-xs font-medium">
              {currentLoc.name} ({currentLoc.sigla})
            </span>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          >
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
          <input
            autoFocus
            type="text"
            placeholder="Cerca un comune italiano…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-400/40 transition-colors"
          />

          {results ? (
            <div className="flex flex-wrap gap-1.5">
              {results.length === 0 ? (
                <p className="text-slate-500 text-xs py-1">Nessun risultato per &ldquo;{search}&rdquo;</p>
              ) : (
                <>
                  {results.slice(0, MAX_RESULTS).map(loc => (
                    <Pill
                      key={loc.slug}
                      slug={loc.slug}
                      label={`${loc.name} (${loc.sigla})`}
                      currentSlug={currentSlug}
                      onSelect={close}
                    />
                  ))}
                  {results.length > MAX_RESULTS && (
                    <span className="text-slate-500 text-xs py-1 self-center">
                      …affina la ricerca
                    </span>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="text-slate-500 text-[11px]">Capoluoghi</p>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {capoluoghi.map(loc => (
                  <Pill
                    key={loc.slug}
                    slug={loc.slug}
                    label={loc.name}
                    currentSlug={currentSlug}
                    onSelect={close}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
