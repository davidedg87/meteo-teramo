'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LOCATIONS } from '@/lib/locations';

const ZONE_META: Record<string, { label: string; icon: string }> = {
  costa:    { label: 'Costa',    icon: '🌊' },
  collina:  { label: 'Collina',  icon: '⛰️' },
  montagna: { label: 'Montagna', icon: '🏔️' },
};

interface Props {
  currentSlug: string | null;
}

function Pill({ slug, name, currentSlug, onSelect }: {
  slug: string;
  name: string;
  currentSlug: string | null;
  onSelect: () => void;
}) {
  const href = slug === 'teramo' ? '/' : `/?loc=${slug}`;
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
      {name}
    </Link>
  );
}

export default function LocationSelector({ currentSlug }: Props) {
  const [search, setSearch] = useState('');
  const zones = ['costa', 'collina', 'montagna'] as const;

  const query = search.toLowerCase().trim();
  const filtered = query
    ? LOCATIONS.filter(l => l.name.toLowerCase().includes(query))
    : null;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 space-y-3">
      <input
        type="text"
        placeholder="Cerca una località della provincia…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-400/40 transition-colors"
      />

      {filtered ? (
        <div className="flex flex-wrap gap-1.5">
          {filtered.length === 0 ? (
            <p className="text-slate-500 text-xs py-1">Nessun risultato per &ldquo;{search}&rdquo;</p>
          ) : (
            filtered.map(loc => (
              <Pill
                key={loc.slug}
                slug={loc.slug}
                name={loc.name}
                currentSlug={currentSlug}
                onSelect={() => setSearch('')}
              />
            ))
          )}
        </div>
      ) : (
        zones.map(zone => {
          const meta = ZONE_META[zone];
          const locs = LOCATIONS.filter(l => l.zone === zone);
          return (
            <div key={zone} className="flex items-start gap-3">
              <span className="text-slate-500 text-xs pt-1.5 w-20 shrink-0">
                {meta.icon} {meta.label}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {locs.map(loc => (
                  <Pill
                    key={loc.slug}
                    slug={loc.slug}
                    name={loc.name}
                    currentSlug={currentSlug}
                    onSelect={() => setSearch('')}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
