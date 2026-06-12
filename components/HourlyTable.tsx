'use client';

import { useState } from 'react';
import { fmtDay } from '@/lib/weatherUtils';

interface HourlyPoint {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  dew_point_2m: number;
  relative_humidity_2m: number;
  precipitation_probability: number;
  precipitation: number;
  wind_speed_10m: number;
  cloud_cover: number;
  uv_index: number;
}

interface Props {
  data: HourlyPoint[];
}

function groupByDay(data: HourlyPoint[]): [string, HourlyPoint[]][] {
  const map = new Map<string, HourlyPoint[]>();
  for (const h of data) {
    const day = h.time.split('T')[0];
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(h);
  }
  return Array.from(map.entries());
}

export default function HourlyTable({ data }: Props) {
  const groups = groupByDay(data);
  const [open, setOpen] = useState<string | null>(groups[0]?.[0] ?? null);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
      <h2 className="text-slate-300 text-sm uppercase tracking-widest mb-4">Dettaglio orario</h2>

      <div className="space-y-2">
        {groups.map(([day, hours]) => (
          <div key={day}>
            <button
              onClick={() => setOpen(open === day ? null : day)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-white font-medium capitalize">{fmtDay(day)}</span>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>
                  {Math.round(Math.min(...hours.map(h => h.temperature_2m)))}° /
                  {' '}{Math.round(Math.max(...hours.map(h => h.temperature_2m)))}°
                </span>
                <span className="text-slate-500">{open === day ? '▲' : '▼'}</span>
              </div>
            </button>

            {open === day && (
              <div className="mt-1 rounded-xl overflow-x-auto border border-white/5">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-4 py-2.5 text-left">Ora</th>
                      <th className="px-3 py-2.5 text-right">Temp</th>
                      <th className="px-3 py-2.5 text-right">Perc.</th>
                      <th className="px-3 py-2.5 text-right">P.Rug.</th>
                      <th className="px-3 py-2.5 text-right">Umid.</th>
                      <th className="px-3 py-2.5 text-right">Vento</th>
                      <th className="px-3 py-2.5 text-right">Nuv.</th>
                      <th className="px-3 py-2.5 text-right">UV</th>
                      <th className="px-3 py-2.5 text-right">Pioggia</th>
                      <th className="px-3 py-2.5 text-right">Prob.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hours.map((h, i) => {
                      const ora = new Date(h.time).toLocaleTimeString('it-IT', {
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      const highRain = h.precipitation_probability > 50;
                      return (
                        <tr
                          key={h.time}
                          className={`border-t border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                        >
                          <td className="px-4 py-2 text-slate-300 tabular-nums">{ora}</td>
                          <td className="px-3 py-2 text-right text-white font-medium tabular-nums">
                            {Math.round(h.temperature_2m)}°
                          </td>
                          <td className="px-3 py-2 text-right text-slate-400 tabular-nums">
                            {Math.round(h.apparent_temperature)}°
                          </td>
                          <td className="px-3 py-2 text-right text-cyan-400/70 tabular-nums">
                            {Math.round(h.dew_point_2m)}°
                          </td>
                          <td className="px-3 py-2 text-right text-slate-300 tabular-nums">
                            {h.relative_humidity_2m}%
                          </td>
                          <td className="px-3 py-2 text-right text-slate-300 tabular-nums">
                            {Math.round(h.wind_speed_10m)} km/h
                          </td>
                          <td className="px-3 py-2 text-right text-slate-400 tabular-nums">
                            {h.cloud_cover}%
                          </td>
                          <td className="px-3 py-2 text-right text-yellow-400/80 tabular-nums">
                            {h.uv_index.toFixed(1)}
                          </td>
                          <td className="px-3 py-2 text-right text-slate-300 tabular-nums">
                            {h.precipitation > 0 ? `${h.precipitation.toFixed(1)} mm` : '—'}
                          </td>
                          <td className={`px-3 py-2 text-right tabular-nums ${highRain ? 'text-blue-400' : 'text-slate-500'}`}>
                            {h.precipitation_probability}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
