import React from 'react';
import {
  BookOpen,
  GraduationCap,
  AlertCircle,
  ArrowUpRight,
  Scale,
} from 'lucide-react';
import { BrechaInclusion } from '../types/dashboard';
import { CVBadge } from './CVBadge';

interface InclusionGapsProps {
  brechas: BrechaInclusion[];
}

// Convierte un porcentaje en una frase ciudadana amigable ("4 de cada 10", "1 de cada 7", etc.)
function textoProporcionCiudadana(porcentaje: number): string {
  if (porcentaje >= 25) {
    const deCadaDiez = Math.round(porcentaje / 10);
    return `${deCadaDiez} de cada 10 personas`;
  }
  const unoDeCada = Math.max(1, Math.round(100 / porcentaje));
  return `1 de cada ${unoDeCada} personas`;
}

export const InclusionGaps: React.FC<InclusionGapsProps> = ({ brechas }) => {
  return (
    <section
      aria-label="Brechas de Inclusión en la Vida Diaria"
      className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm"
    >
      {/* Encabezado limpio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#0F2C59] text-white shrink-0 mt-0.5">
            <Scale className="w-5 h-5 text-[#F97316]" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#F97316]">
              Gráfico 3 • Desigualdad de Oportunidades
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0F2C59]">
              Brechas de Inclusión en la Vida Diaria (Jóvenes y Adultos 15+ años)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Comparación directa de oportunidades educativas entre personas con y sin dificultades funcionales severas.
            </p>
          </div>
        </div>
      </div>

      {/* Tarjetas de Barras Agrupadas Comparativas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {brechas.map((brecha) => {
          const conDisc = brecha.con_discapacidad_severa;
          const sinDisc = brecha.sin_discapacidad_severa;
          const esAnalfabetismo = brecha.id === 'analfabetismo';
          const diferenciaPP = conDisc.valor - sinDisc.valor;
          const razonRiesgo =
            sinDisc.valor > 0 ? Math.round(conDisc.valor / sinDisc.valor) : 1;

          // Escala visual máxima de 50% para que 41.52% y 13.81% contrasten con total claridad
          const maxEscala = 50;

          return (
            <div
              key={brecha.id}
              className="rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between bg-[#F8FAFC]/60"
            >
              <div>
                {/* Título del Indicador */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        esAnalfabetismo
                          ? 'bg-[#F97316]/15 text-[#F97316]'
                          : 'bg-[#0F2C59]/10 text-[#0F2C59]'
                      }`}
                    >
                      {esAnalfabetismo ? (
                        <BookOpen className="w-5 h-5" />
                      ) : (
                        <GraduationCap className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-[#0F2C59]">
                        {esAnalfabetismo
                          ? 'Personas que no saben leer ni escribir'
                          : 'Asistencia actual a un centro educativo'}
                      </h4>
                      <span className="text-xs text-slate-500">
                        Población de 15 años o más en Guatemala
                      </span>
                    </div>
                  </div>
                </div>

                {/* Barras Agrupadas Comparativas */}
                <div className="space-y-4">
                  {/* Barra 1: Con dificultades severas */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#F97316]">
                        Con dificultades severas
                      </span>
                      <CVBadge
                        cv={conDisc.cv}
                        estado={conDisc.estado_cv}
                        compact
                      />
                    </div>

                    {conDisc.publicable ? (
                      <>
                        <div className="flex items-baseline justify-between gap-2 my-1">
                          <span className="text-3xl font-black text-[#0F2C59]">
                            {conDisc.valor.toFixed(2)}%
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-[#F97316]/15 text-[#F97316] font-extrabold text-xs">
                            {textoProporcionCiudadana(conDisc.valor)}
                          </span>
                        </div>
                        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                          <div
                            className="h-full bg-[#F97316] rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                100,
                                (conDisc.valor / maxEscala) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      /* Guardrail Silencioso y Amigable si publicable === false (CV > 20%) */
                      <div
                        role="alert"
                        className="mt-2 p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 flex items-start gap-2.5"
                      >
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-900 leading-relaxed">
                          Por rigor estadístico del INE (CV &gt; 20%), este cruce específico no tiene muestra suficiente para mostrarse con precisión.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Barra 2: Sin dificultades severas */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#00A8E8]">
                        Sin dificultades severas
                      </span>
                      <CVBadge
                        cv={sinDisc.cv}
                        estado={sinDisc.estado_cv}
                        compact
                      />
                    </div>

                    {sinDisc.publicable ? (
                      <>
                        <div className="flex items-baseline justify-between gap-2 my-1">
                          <span className="text-3xl font-black text-[#00A8E8]">
                            {sinDisc.valor.toFixed(2)}%
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-[#00A8E8]/10 text-[#0F2C59] font-extrabold text-xs">
                            {textoProporcionCiudadana(sinDisc.valor)}
                          </span>
                        </div>
                        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                          <div
                            className="h-full bg-[#00A8E8] rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                100,
                                (sinDisc.valor / maxEscala) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-amber-800 font-semibold">
                        Muestra insuficiente (CV &gt; 20%)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pie de lectura ciudadana */}
              <div className="mt-5 pt-3.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                {conDisc.publicable && sinDisc.publicable ? (
                  <>
                    <span className="font-semibold text-slate-600 flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4 text-[#F97316]" />
                      Diferencia:{' '}
                      <strong className="text-[#0F2C59]">
                        +{diferenciaPP.toFixed(1)} puntos porcentuales
                      </strong>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#F97316] text-white font-extrabold">
                      {razonRiesgo} veces más frecuente
                    </span>
                  </>
                ) : (
                  <span className="text-slate-500 font-medium">
                    En población sin dificultades severas, asisten actualmente{' '}
                    <strong className="text-[#0F2C59]">
                      1 de cada 7 personas (14.28%)
                    </strong>
                    .
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
