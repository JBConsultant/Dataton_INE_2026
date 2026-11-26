import React, { useState } from 'react';
import { Sliders, Users, Sparkles, BookOpenCheck } from 'lucide-react';
import { CrucePrevalencia } from '../types/dashboard';

interface PolicySimulatorProps {
  registroActual: CrucePrevalencia;
  totalNacionalDiscSevera: number; // 642,454
  tasaAnalfabetismoConDisc: number; // 41.52%
  tasaAnalfabetismoSinDisc: number; // 13.81%
  poblacion15MasDiscSevera: number; // 592,316
}

export const PolicySimulator: React.FC<PolicySimulatorProps> = ({
  registroActual,
  totalNacionalDiscSevera,
  tasaAnalfabetismoConDisc,
  tasaAnalfabetismoSinDisc,
  poblacion15MasDiscSevera,
}) => {
  const [metaReduccionPct, setMetaReduccionPct] = useState<number>(25);

  // Si el filtro actual es publicable, usamos el grupo seleccionado; de lo contrario, el total nacional
  const esSegmentoEspecifico =
    (registroActual.filtro_edad !== 'TODOS' ||
      registroActual.filtro_sexo !== 'TODOS') &&
    registroActual.discapacidad_severa.publicable;

  const universoPersonasActivas = esSegmentoEspecifico
    ? registroActual.personas_con_disc_severa_est
    : totalNacionalDiscSevera;

  // Personas estimadas sin acceso a lectoescritura/inclusión en el universo activo
  const totalConBrecha = Math.round(
    universoPersonasActivas * (tasaAnalfabetismoConDisc / 100)
  );

  // Personas que lograrían aprender a leer/escribir o incluirse al cerrar la brecha en X%
  const personasBeneficiadas = Math.round(
    totalConBrecha * (metaReduccionPct / 100)
  );

  const personasPendientes = Math.max(0, totalConBrecha - personasBeneficiadas);

  // Porcentaje proyectado de analfabetismo tras cerrar la brecha en metaReduccionPct%
  const nuevaTasaAnalfabetismo =
    tasaAnalfabetismoConDisc * (1 - metaReduccionPct / 100);

  // En el universo específico de 15+ años (592,316 personas)
  const beneficiarios15MasNacional = Math.round(
    poblacion15MasDiscSevera *
      (tasaAnalfabetismoConDisc / 100) *
      (metaReduccionPct / 100)
  );

  return (
    <section
      aria-label="Simulador Visual de Impacto: ¿Qué pasa si cerramos la brecha?"
      className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm"
    >
      {/* Encabezado limpio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#0F2C59] text-white shrink-0 mt-0.5">
            <Sliders className="w-5 h-5 text-[#00A8E8]" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#00A8E8]">
              Gráfico 4 • Simulador Visual de Impacto
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0F2C59]">
              ¿Qué pasa si cerramos la brecha de alfabetización e inclusión?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Mueve el control para descubrir cuántas personas con dificultades severas transformarían su vida diaria.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-[#00A8E8]/10 text-[#0F2C59] border border-[#00A8E8]/25 self-start sm:self-center shrink-0">
          <Sparkles className="w-4 h-4 text-[#00A8E8]" />
          {esSegmentoEspecifico
            ? `Calculando sobre el filtro activo (${universoPersonasActivas.toLocaleString('es-GT')} personas)`
            : `Calculando a Nivel Nacional (${totalNacionalDiscSevera.toLocaleString('es-GT')} personas)`}
        </span>
      </div>

      <div className="space-y-6">
        {/* Control Slider Sencillo (10% a 50%) */}
        <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200/90">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <label
              htmlFor="impact-slider"
              className="text-sm font-extrabold text-[#0F2C59]"
            >
              Meta ciudadana: Reducir la brecha actual en un{' '}
              <span className="text-[#00A8E8] underline">
                {metaReduccionPct}%
              </span>
            </label>

            <div className="flex items-center gap-1.5">
              {[10, 20, 30, 40, 50].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMetaReduccionPct(preset)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    metaReduccionPct === preset
                      ? 'bg-[#0F2C59] text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-[#00A8E8]'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-extrabold text-slate-400">10%</span>
            <input
              id="impact-slider"
              type="range"
              min={10}
              max={50}
              step={1}
              value={metaReduccionPct}
              onChange={(e) => setMetaReduccionPct(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00A8E8]"
            />
            <span className="text-xs font-extrabold text-slate-400">50%</span>
            <span className="min-w-[4.5rem] text-center px-3 py-1.5 rounded-xl bg-[#00A8E8] text-white font-black text-base shadow-2xs">
              {metaReduccionPct}%
            </span>
          </div>
        </div>

        {/* Barra Apilada Visual de Impacto (Antes vs. Nuevas Personas Incluidas) */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold">
            <span className="text-slate-600">
              Proporción de personas que superarían la barrera de analfabetismo ({totalConBrecha.toLocaleString('es-GT')} personas afectadas):
            </span>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-[#00A8E8]">
                <span className="w-3 h-3 rounded-sm bg-[#00A8E8] inline-block" />
                Nuevas personas incluidas ({metaReduccionPct}%)
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#F97316]">
                <span className="w-3 h-3 rounded-sm bg-[#F97316] inline-block" />
                Brecha por atender ({100 - metaReduccionPct}%)
              </span>
            </div>
          </div>

          {/* Barra Apilada (Stacked Bar) */}
          <div className="w-full h-9 bg-slate-100 rounded-xl overflow-hidden flex p-1 gap-1 border border-slate-200/80">
            <div
              className="h-full bg-[#00A8E8] rounded-lg flex items-center justify-center text-white text-xs font-extrabold transition-all duration-300 overflow-hidden whitespace-nowrap px-2"
              style={{ width: `${metaReduccionPct}%` }}
              title={`${personasBeneficiadas.toLocaleString('es-GT')} personas incluidas`}
            >
              +{personasBeneficiadas.toLocaleString('es-GT')} incluidas
            </div>
            <div
              className="h-full bg-[#F97316]/85 rounded-lg flex items-center justify-center text-white text-xs font-bold transition-all duration-300 overflow-hidden whitespace-nowrap px-2"
              style={{ width: `${100 - metaReduccionPct}%` }}
              title={`${personasPendientes.toLocaleString('es-GT')} personas aún por atender`}
            >
              {personasPendientes.toLocaleString('es-GT')} pendientes
            </div>
          </div>
        </div>

        {/* Resumen Ciudadano en 2 Tarjetas Simples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border-2 border-[#00A8E8]/40 bg-[#00A8E8]/5 flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#00A8E8] text-white shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#00A8E8]">
                Impacto Humano Directo
              </span>
              <div className="text-3xl font-black text-[#0F2C59] leading-tight">
                {personasBeneficiadas.toLocaleString('es-GT')} personas
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Mejorarían su acceso a lectura, escritura y autonomía en este grupo ({beneficiarios15MasNacional.toLocaleString('es-GT')} jóvenes y adultos de 15+ años a nivel nacional).
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-[#F8FAFC] flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#0F2C59] text-white shrink-0">
              <BookOpenCheck className="w-6 h-6 text-[#00A8E8]" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Reducción del Analfabetismo
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#0F2C59]">
                  {nuevaTasaAnalfabetismo.toFixed(1)}%
                </span>
                <span className="text-sm text-slate-400 line-through font-bold">
                  antes {tasaAnalfabetismoConDisc.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Nos acercaríamos al promedio de la población sin dificultades severas ({tasaAnalfabetismoSinDisc.toFixed(1)}%).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
