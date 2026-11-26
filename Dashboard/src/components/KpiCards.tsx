import React from 'react';
import { Home, Users, Info } from 'lucide-react';
import { DashboardData, CrucePrevalencia } from '../types/dashboard';
import { CVBadge } from './CVBadge';

interface KpiCardsProps {
  kpisHogar: DashboardData['kpis_hogar'];
  kpiPoblacional: CrucePrevalencia;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpisHogar, kpiPoblacional }) => {
  const hogarSev = kpisHogar.discapacidad_severa;
  const hogarAlg = kpisHogar.alguna_dificultad;
  const pobSev = kpiPoblacional.discapacidad_severa;
  const pobAlg = kpiPoblacional.alguna_dificultad;

  return (
    <section aria-label="Indicadores Principales (KPIs)" className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* KPI 1: Indicador Principal de Hogar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="h-1.5 bg-[#0F2C59]" />
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-lg bg-[#0F2C59]/10 text-[#0F2C59]">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0F2C59]">
                    Indicador Oficial de Hogar (NO_HOGAR)
                  </span>
                  <h2 className="text-sm font-semibold text-slate-700">
                    Hogares con Dificultad Funcional Severa
                  </h2>
                </div>
              </div>
              <CVBadge cv={hogarSev.cv} estado={hogarSev.estado_cv} />
            </div>

            <div className="my-3 flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl font-extrabold text-[#0F2C59] tracking-tight">
                {hogarSev.valor.toFixed(2)}%
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#00A8E8]/15 text-[#0F2C59] font-bold text-sm border border-[#00A8E8]/30">
                {hogarSev.ratio_texto}
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Equivale a{' '}
              <strong className="text-slate-900 font-bold">
                {hogarSev.hogares_con_condicion_est.toLocaleString('es-GT')} hogares
              </strong>{' '}
              de un universo nacional de{' '}
              <span className="font-medium text-slate-800">
                {hogarSev.poblacion_expandida.toLocaleString('es-GT')} hogares
              </span>{' '}
              que integran al menos una persona (≥ 4 años) con dificultad severa o total.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#00A8E8]" />
              Alguna dificultad en el hogar:{' '}
              <strong className="text-slate-700">{hogarAlg.valor.toFixed(2)}%</strong> ({hogarAlg.ratio_texto})
            </span>
            <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
              n = {hogarSev.n_muestral.toLocaleString('es-GT')} hogares | SE = ±{hogarSev.se.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* KPI 2: Indicador Poblacional Nacional (>= 4 años) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="h-1.5 bg-[#00A8E8]" />
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-lg bg-[#00A8E8]/15 text-[#0F2C59]">
                  <Users className="w-5 h-5 text-[#00A8E8]" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00A8E8]">
                    Indicador Poblacional (Washington Group)
                  </span>
                  <h2 className="text-sm font-semibold text-slate-700">
                    Prevalencia Nacional (Población ≥ 4 años)
                  </h2>
                </div>
              </div>
              <CVBadge cv={pobSev.cv} estado={pobSev.estado_cv} />
            </div>

            <div className="my-3 flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl font-extrabold text-[#00A8E8] tracking-tight">
                {pobSev.valor.toFixed(2)}%
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-[#0F2C59] font-bold text-sm border border-slate-200">
                {kpiPoblacional.personas_con_disc_severa_est.toLocaleString('es-GT')} personas ≥ 4 años
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Población con dificultad funcional severa (códigos 3 o 4 en al menos 1 de los 6 dominios WG) sobre un universo expandido de{' '}
              <strong className="text-slate-800">
                {pobSev.poblacion_expandida.toLocaleString('es-GT')} personas ≥ 4 años
              </strong>.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#00A8E8]" />
              Con alguna dificultad (códigos 2–4):{' '}
              <strong className="text-slate-700">
                {pobAlg ? `${pobAlg.valor.toFixed(2)}%` : 'N/A'}
              </strong>
            </span>
            <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
              n = {pobSev.n_muestral.toLocaleString('es-GT')} personas | SE = ±{pobSev.se.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
