'use client';

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { HistoricalData } from '@/lib/historical';

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl p-3 text-sm shadow-xl">
      <p className="text-slate-400 mb-2 capitalize">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}:{' '}
          <strong>
            {p.value}
            {p.name === 'Pioggia' ? ' mm' : '°C'}
          </strong>
        </p>
      ))}
    </div>
  );
}

interface Props {
  data: HistoricalData;
}

export default function HistoricalChart({ data }: Props) {
  const chartData = data.daily.time.map((t, i) => ({
    giorno: new Date(t).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' }),
    Max: Math.round(data.daily.temperature_2m_max[i]),
    Min: Math.round(data.daily.temperature_2m_min[i]),
    Pioggia: +(data.daily.precipitation_sum[i] ?? 0).toFixed(1),
  }));

  const allTemps = chartData.flatMap(d => [d.Max, d.Min]);
  const minT = Math.floor(Math.min(...allTemps)) - 2;
  const maxT = Math.ceil(Math.max(...allTemps)) + 2;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
      <h2 className="text-slate-300 text-sm uppercase tracking-widest mb-6">Ultimi 7 giorni</h2>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="giorno"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="temp"
            domain={[minT, maxT]}
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}°`}
          />
          <YAxis
            yAxisId="rain"
            orientation="right"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}mm`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12, paddingTop: 16 }} />
          <Bar yAxisId="rain" dataKey="Pioggia" fill="#3b82f6" opacity={0.3} radius={[3, 3, 0, 0]} />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="Max"
            stroke="#f97316"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="Min"
            stroke="#60a5fa"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#60a5fa', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
