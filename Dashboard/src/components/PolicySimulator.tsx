import React, { useState } from 'react';
import { Sliders, Award, Users, TrendingDown, Sparkles } from 'lucide-react';

interface PolicySimulatorProps {
  totalPersonasDiscSevera: number; // 642,454
  tasaAnalfabetismoConDisc: number; // 41.52%
  tasaAnalfabetismoSinDisc: number; // 13.81%
  poblacion15MasDiscSevera: number; // 592,316
}

export const PolicySimulator: React.FC<PolicySimulatorProps> = ({
  totalPersonasDiscSevera,
  tasaAnalfabetismoConDisc,
  tasaAnalfabetismoSinDisc,
  poblacion15MasDiscSevera,
}) => {
  const [metaReduccionPct, setMetaReduccionPct] = useState<number>(25);

  // Cálculo sobre el universo de 642,454 personas con dificultades funcionales severas
  const personasAfectadasBase642k = Math.round(
    totalPersonasDiscSevera * (tasaAnalfabetismoConDisc / 100)
  );
  const beneficiariosDirectos = Math.round(
    personasAfectadasBase642k * (metaReduccionPct / 100)
  );

  // Cálculo complementario específico en el universo >= 15 años (592,316 personas)
  const personasAnalfabetas15Mas = Math.round(
    poblacion15MasDiscSevera * (tasaAnalfabetismoConDisc / 100)
  );
  const beneficiarios15Mas = Math.round(
    personasAnalfabetas15Mas * (metaReduccionPct / 100)
  );

  // Nueva tasa proyectada de analfabetismo tras la intervención
  const nuevaTasaProyectada =
    tasaAnalfabetismoConDisc * (1 - metaReduccionPct / 100);
  const brechaRestantePP = Math.max(
    0,
    nuevaTasaProyectada - tasaAnalfabetismoSinDisc
  );

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-[#0F2C59] to-[#163d7a] text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#00A8E8] text-[#0F2C59]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide">
              Simulador de Impacto de Políticas Públicas — Alfabetización Inclusiva
            </h3>
            <p className="text-xs text-slate-200">
              Proyección paramétrica sobre las{' '}
              <strong>{totalPersonasDiscSevera.toLocaleString('es-GT')}</strong> personas con dificultades funcionales severas (tasa base de analfabetismo:{' '}
              <strong>{tasaAnalfabetismoConDisc.toFixed(2)}%</strong>)
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-[#00A8E8]/20 text-[#00A8E8] border border-[#00A8E8]/40">
          <Sparkles className="w-3.5 h-3.5" />
          Modelo Basado en ENAPROM 2025
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Control Slider 10% a 50% */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <label
              htmlFor="policy-slider"
              className="text-xs font-bold uppercase tracking-wider text-[#0F2C59]"
            >
              Meta de Reducción de la Brecha de Analfabetismo (10% a 50%)
            </label>
            <div className="flex items-center gap-2">
              {[10, 20, 25, 35, 50].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMetaReduccionPct(preset)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                    metaReduccionPct === preset
                      ? 'bg-[#00A8E8] text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-[#00A8E8]'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500">10%</span>
            <input
              id="policy-slider"
              type="range"
              min={10}
              max={50}
              step={1}
              value={metaReduccionPct}
              onChange={(e) => setMetaReduccionPct(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-500">50%</span>
            <span className="min-w-[4.5rem] text-center px-3 py-1.5 rounded-lg bg-[#0F2C59] text-white font-extrabold text-base">
              -{metaReduccionPct}%
            </span>
          </div>
        </div>

        {/* Tarjetas de Resultados de la Simulación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Resultado 1: Beneficiarios sobre universo total de 642,454 */}
          <div className="p-4 rounded-xl border-2 border-[#00A8E8] bg-[#00A8E8]/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0F2C59] mb-1">
              <span>Personas Beneficiadas</span>
              <Users className="w-4 h-4 text-[#00A8E8]" />
            </div>
            <div className="text-3xl font-extrabold text-[#0F2C59] my-1">
              {beneficiariosDirectos.toLocaleString('es-GT')}
            </div>
            <p className="text-xs text-slate-600">
              De las <strong>{personasAfectadasBase642k.toLocaleString('es-GT')}</strong> personas estimadas al aplicar la tasa del {tasaAnalfabetismoConDisc}% sobre el universo de{' '}
              <strong>{totalPersonasDiscSevera.toLocaleString('es-GT')}</strong> personas con dificultad severa.
            </p>
          </div>

          {/* Resultado 2: Nueva Tasa Proyectada */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              <span>Tasa de Analfabetismo Proyectada</span>
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2 my-1">
              <span className="text-3xl font-extrabold text-[#00A8E8]">
                {nuevaTasaProyectada.toFixed(2)}%
              </span>
              <span className="text-xs text-slate-400 line-through font-semibold">
                {tasaAnalfabetismoConDisc.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Reducción neta de{' '}
              <strong className="text-emerald-700">
                -{(tasaAnalfabetismoConDisc - nuevaTasaProyectada).toFixed(2)} puntos porcentuales
              </strong>{' '}
              (brecha remanente vs población sin discapacidad: +{brechaRestantePP.toFixed(2)} pp).
            </p>
          </div>

          {/* Resultado 3: Focalización Adultos >= 15 años */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              <span>Focalización Directa (≥ 15 años)</span>
              <Award className="w-4 h-4 text-[#0F2C59]" />
            </div>
            <div className="text-2xl font-extrabold text-slate-800 my-1">
              {beneficiarios15Mas.toLocaleString('es-GT')} jóvenes y adultos
            </div>
            <p className="text-xs text-slate-600">
              Calculado estrictamente sobre el denominador de{' '}
              <strong>{poblacion15MasDiscSevera.toLocaleString('es-GT')}</strong> personas ≥ 15 años con dificultad severa ({personasAnalfabetas15Mas.toLocaleString('es-GT')} en condición de analfabetismo).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
