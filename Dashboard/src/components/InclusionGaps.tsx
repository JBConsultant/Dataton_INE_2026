import React from 'react';
import { BookOpen, GraduationCap, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { BrechaInclusion } from '../types/dashboard';
import { CVBadge } from './CVBadge';

interface InclusionGapsProps {
  brechas: BrechaInclusion[];
}

export const InclusionGaps: React.FC<InclusionGapsProps> = ({ brechas }) => {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#0F2C59] text-white">
            <BookOpen className="w-4 h-4 text-[#00A8E8]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F2C59] uppercase tracking-wide">
              Comparativa de Brechas de Inclusión Educativa (Población ≥ 15 años)
            </h3>
            <p className="text-xs text-slate-500">
              Cálculo directo en <code className="font-mono text-[#0F2C59]">ENAPROM_PERSONAS-3.xlsx</code> sin cruce entre encuestas independientes
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
          Subpoblación ≥ 15 años (n = 818 con disc. severa | n = 14,611 sin disc. severa)
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {brechas.map((brecha) => {
          const conDisc = brecha.con_discapacidad_severa;
          const sinDisc = brecha.sin_discapacidad_severa;
          const esAnalfabetismo = brecha.id === 'analfabetismo';
          const diferenciaPP = conDisc.valor - sinDisc.valor;
          const razonRiesgo = sinDisc.valor > 0 ? (conDisc.valor / sinDisc.valor).toFixed(2) : 'N/A';

          return (
            <div
              key={brecha.id}
              className="rounded-xl border border-slate-200 p-5 flex flex-col justify-between bg-slate-50/40"
            >
              <div>
                {/* Header de la Tarjeta de Brecha */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-[#0F2C59]/10 text-[#0F2C59]">
                      {esAnalfabetismo ? (
                        <BookOpen className="w-4 h-4" />
                      ) : (
                        <GraduationCap className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0F2C59]">{brecha.indicador}</h4>
                      <span className="text-[11px] font-mono text-slate-500">
                        Boleta ENAPROM: {brecha.variable_boleta}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grupo 1: Con Dificultad Funcional Severa */}
                <div className="mb-4 p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F2C59]">
                      Con Dificultad Funcional Severa
                    </span>
                    <CVBadge cv={conDisc.cv} estado={conDisc.estado_cv} compact />
                  </div>

                  {conDisc.publicable ? (
                    <>
                      <div className="flex items-baseline justify-between my-1">
                        <span className="text-3xl font-extrabold text-[#0F2C59]">
                          {conDisc.valor.toFixed(2)}%
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          SE = ±{conDisc.se.toFixed(2)}% | n = {conDisc.n_muestral}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-[#0F2C59] rounded-full"
                          style={{ width: `${Math.min(100, conDisc.valor)}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    /* GUARDRAIL OBLIGATORIO: Asistencia Educativa con_discapacidad_severa (CV = 20.24% > 20%) */
                    <div
                      role="alert"
                      className="mt-2 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-950"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-rose-800 mb-1">
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>CV = {conDisc.cv?.toFixed(2)}% (&gt; 20%): Dato Reservado por Precisión Estadística</span>
                      </div>
                      <p className="text-xs text-rose-900 leading-relaxed">
                        De acuerdo con la regla oficial del INE, el porcentaje puntual se oculta porque su Coeficiente de Variación (<strong>20.24%</strong>) excede el límite estricto del 20.0% en personas ≥ 15 años con dificultad severa (
                        <span className="font-mono">n = {conDisc.n_muestral}</span>,{' '}
                        <span className="font-mono">SE = ±{conDisc.se.toFixed(2)}%</span>).
                      </p>
                    </div>
                  )}
                </div>

                {/* Grupo 2: Sin Dificultad Funcional Severa */}
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Sin Dificultad Funcional Severa
                    </span>
                    <CVBadge cv={sinDisc.cv} estado={sinDisc.estado_cv} compact />
                  </div>

                  {sinDisc.publicable ? (
                    <>
                      <div className="flex items-baseline justify-between my-1">
                        <span className="text-3xl font-extrabold text-[#00A8E8]">
                          {sinDisc.valor.toFixed(2)}%
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          SE = ±{sinDisc.se.toFixed(2)}% | n = {sinDisc.n_muestral.toLocaleString('es-GT')}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-[#00A8E8] rounded-full"
                          style={{ width: `${Math.min(100, sinDisc.valor)}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-rose-700 font-semibold">
                      Dato reservado (CV &gt; 20%)
                    </div>
                  )}
                </div>
              </div>

              {/* Resumen de la Brecha */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                {conDisc.publicable && sinDisc.publicable ? (
                  <>
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4 text-[#0F2C59]" />
                      Brecha absoluta:{' '}
                      <strong className="text-[#0F2C59]">+{diferenciaPP.toFixed(2)} puntos porcentuales</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#0F2C59] text-white font-bold">
                      {razonRiesgo}x mayor prevalencia
                    </span>
                  </>
                ) : (
                  <span className="text-rose-800 font-semibold">
                    Comparación bloqueada por guardrail estadístico INE (CV = {conDisc.cv?.toFixed(2)}% &gt; 20%)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
