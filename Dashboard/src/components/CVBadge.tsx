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
        className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold ${
          compact ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
        }`}
        title={`Dato confiable según estándar INE (CV = ${cvText} ≤ 15%)`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Dato confiable • INE</span>
      </span>
    );
  }

  if (estado === 'PRECAUCION') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-semibold ${
          compact ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
        }`}
        title={`Precaución muestral INE (15% < CV = ${cvText} ≤ 20%)`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>Precaución muestral</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 text-amber-900 border border-amber-300 font-semibold ${
        compact ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      }`}
      title={`Muestra insuficiente según regla INE (CV = ${cvText} > 20%)`}
    >
      <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
      <span>Muestra limitada • INE</span>
    </span>
  );
};
