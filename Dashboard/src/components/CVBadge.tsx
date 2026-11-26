import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { EstadoCV } from '../types/dashboard';

interface CVBadgeProps {
  cv: number | null;
  estado: EstadoCV;
  compact?: boolean;
}

export const CVBadge: React.FC<CVBadgeProps> = ({ cv, estado, compact = false }) => {
  const cvText = cv !== null ? `${cv.toFixed(2)}%` : 'N/A';

  if (estado === 'CONFIABLE') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold ${
          compact ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs'
        }`}
        title="Estimación estadísticamente confiable según estándar INE (CV ≤ 15%)"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>CV = {cvText}</span>
        {!compact && <span className="text-emerald-700 font-normal">(Confiable)</span>}
      </span>
    );
  }

  if (estado === 'PRECAUCION') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-semibold ${
          compact ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs'
        }`}
        title="Precaución estadística INE: 15% < CV ≤ 20%. Usar con cautela."
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>CV = {cvText}</span>
        {!compact && <span className="text-amber-700 font-normal">(Precaución 15–20%)</span>}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-semibold ${
        compact ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs'
      }`}
      title="Dato reservado por precisión estadística (CV > 20%)"
    >
      <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
      <span>CV = {cvText} (&gt; 20%)</span>
      {!compact && <span className="text-rose-700 font-normal">(Reservado INE)</span>}
    </span>
  );
};
