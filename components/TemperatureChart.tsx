'use client';

import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { fmtHour } from '@/lib/weatherUtils';

interface HourlyPoint {
  time: string;
  temperature_2m: number;
  precipitation_probability: number;
  precipitation: number;
}

interface Props {
  data: HourlyPoint[];
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl p-3 text-sm shadow-xl">
      <p className="text-slate-400 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}{p.name === 'Temperatura' ? '°C' : '%'}</strong>
        </p>
      ))}
    </div>
  );
}

export default function TemperatureChart({ data }: Props) {
  const temps = data.map(d => d.temperature_2m);
  const minT = Math.floor(Math.min(...temps)) - 2;
  const maxT = Math.ceil(Math.max(...temps)) + 2;

  const chartData = data.map(d => ({
    ora: fmtHour(d.time),
    Temperatura: Math.round(d.temperature_2m * 10) / 10,
    'Prob. pioggia': d.precipitation_probability,
  }));

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
      <h2 className="text-slate-300 text-sm uppercase tracking-widest mb-6">Prossime 48 ore</h2>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 10, left: -10 }}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
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
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ color: '#94a3b8', fontSize: 12, paddingTop: 16 }}
          />
          <Bar
            yAxisId="rain"
            dataKey="Prob. pioggia"
            fill="#3b82f6"
            opacity={0.25}
            radius={[2, 2, 0, 0]}
          />
          <Area
            yAxisId="temp"
            type="monotone"
            dataKey="Temperatura"
            stroke="#f97316"
            strokeWidth={2.5}
            fill="url(#tempGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#f97316', strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
