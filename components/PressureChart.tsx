'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { fmtHour } from '@/lib/weatherUtils';

interface HourlyPoint {
  time: string;
  surface_pressure: number;
}

interface Props {
  data: HourlyPoint[];
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl p-3 text-sm shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="text-violet-300 font-semibold">{payload[0].value.toFixed(1)} hPa</p>
    </div>
  );
}

export default function PressureChart({ data }: Props) {
  const pressures = data.map(d => d.surface_pressure);
  const minP = Math.floor(Math.min(...pressures)) - 2;
  const maxP = Math.ceil(Math.max(...pressures)) + 2;

  const chartData = data.map(d => ({
    ora: fmtHour(d.time),
    Pressione: +d.surface_pressure.toFixed(1),
  }));

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-slate-300 text-sm uppercase tracking-widest">Pressione atmosferica</h2>
        <span className="text-xs text-slate-500">Prossime 48 ore · hPa</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 10, left: -10 }}>
          <defs>
            <linearGradient id="pressGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#a78bfa" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="ora"
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={5}
            angle={-45}
            textAnchor="end"
            height={48}
          />
          <YAxis
            domain={[minP, maxP]}
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}`}
          />
          <ReferenceLine y={1013} stroke="rgba(167,139,250,0.2)" strokeDasharray="4 4" />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="Pressione"
            stroke="#a78bfa"
            strokeWidth={2.5}
            fill="url(#pressGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#a78bfa', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-600 mt-2 text-right">
        — — linea di riferimento a 1013 hPa (pressione standard)
      </p>
    </div>
  );
}
