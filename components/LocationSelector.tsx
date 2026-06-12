import Link from 'next/link';
import { LOCATIONS } from '@/lib/locations';

const ZONE_META: Record<string, { label: string; icon: string }> = {
  costa:    { label: 'Costa',    icon: '🌊' },
  collina:  { label: 'Collina',  icon: '⛰️' },
  montagna: { label: 'Montagna', icon: '🏔️' },
};

interface Props {
  currentSlug: string;
}

export default function LocationSelector({ currentSlug }: Props) {
  const zones = ['costa', 'collina', 'montagna'] as const;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 space-y-3">
      {zones.map(zone => {
        const meta = ZONE_META[zone];
        const locs = LOCATIONS.filter(l => l.zone === zone);
        return (
          <div key={zone} className="flex items-start gap-3">
            <span className="text-slate-500 text-xs pt-1.5 w-20 shrink-0">
              {meta.icon} {meta.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {locs.map(loc => {
                const href = loc.slug === 'teramo' ? '/' : `/?loc=${loc.slug}`;
                const active = loc.slug === currentSlug;
                return (
                  <Link
                    key={loc.slug}
                    href={href}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      active
                        ? 'bg-blue-500/25 border border-blue-400/40 text-blue-300'
                        : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {loc.name}
                    {loc.elevation >= 500 && (
                      <span className="ml-1 text-slate-500 font-normal">{loc.elevation}m</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
