'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Props {
  updatedAt: string;
}

export default function AutoRefresh({ updatedAt }: Props) {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);

  const refresh = async () => {
    setSpinning(true);
    router.refresh();
    setTimeout(() => setSpinning(false), 1500);
  };

  // Auto-refresh ogni 15 minuti
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 15 * 60 * 1000);
    return () => clearInterval(id);
  }, [router]);

  return (
    <div className="flex items-center gap-2 text-slate-400 text-sm">
      <span>Aggiornato alle {updatedAt}</span>
      <button
        onClick={refresh}
        title="Aggiorna ora"
        className="p-1 rounded-full hover:bg-white/10 transition-colors"
      >
        <span className={spinning ? 'inline-block animate-spin' : ''}>⟳</span>
      </button>
    </div>
  );
}
