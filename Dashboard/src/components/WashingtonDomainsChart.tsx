import React, { useState } from 'react';
import { BarChart3, Eye, Ear, Footprints, Brain, HeartHandshake, MessageSquare } from 'lucide-react';
import { DominioWG } from '../types/dashboard';
import { CVBadge } from './CVBadge';

interface WashingtonDomainsChartProps {
  dominios: DominioWG[];
}

type ModoPoblacionWG = 'general_4_mas' | 'adultos_mayores_60_mas' | 'comparativo';

const ICONOS_DOMINIO: Record<string, React.ReactNode> = {
  caminar: <Footprints className="w-4 h-4" />,
  ver: <Eye className="w-4 h-4" />,
  recordar: <Brain className="w-4 h-4" />,
  oir: <Ear className="w-4 h-4" />,
  comunicarse: <MessageSquare className="w-4 h-4" />,
  cuidado_personal: <HeartHandshake className="w-4 h-4" />,
};

export const WashingtonDomainsChart: React.FC<WashingtonDomainsChartProps> = ({ dominios }) => {
  const [modo, setModo] = useState<ModoPoblacionWG>('general_4_mas');

  // Escala máxima dinámica según la vista seleccionada para barras proporcionales limpias
  const maxValor = modo === 'general_4_mas' ? 2.2 : 12.5;

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Encabezado */}
      <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#0F2C59] text-white">
            <BarChart3 className="w-4 h-4 text-[#00A8E8]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F2C59] uppercase tracking-wide">
              6 Dominios Funcionales del Washington Group (Dificultad Severa)
            </h3>
            <p className="text-xs text-slate-500">
              Variables oficiales ENAPROM 2025: <code className="font-mono text-[#0F2C59]">P02A11A – P02A11F</code> (Códigos 3 y 4)
            </p>
          </div>
        </div>

        {/* Selector de Universo Poblacional */}
        <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setModo('general_4_mas')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              modo === 'general_4_mas'
                ? 'bg-[#0F2C59] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0F2C59]'
            }`}
          >
            Población General (≥ 4 años)
          </button>
          <button
            type="button"
            onClick={() => setModo('adultos_mayores_60_mas')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              modo === 'adultos_mayores_60_mas'
                ? 'bg-[#00A8E8] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0F2C59]'
            }`}
          >
            Adultos Mayores (60+ años)
          </button>
          <button
            type="button"
            onClick={() => setModo('comparativo')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              modo === 'comparativo'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0F2C59]'
            }`}
          >
            Vista Comparativa
          </button>
        </div>
      </div>

      {/* Cuerpo del Gráfico de Barras */}
      <div className="p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200/70">
          {modo === 'general_4_mas' && (
            <span>
              Mostrando: <strong className="text-[#0F2C59]">Población Nacional ≥ 4 años</strong> (N = 16,974,815 | n = 20,531)
            </span>
          )}
          {modo === 'adultos_mayores_60_mas' && (
            <span>
              Mostrando: <strong className="text-[#00A8E8]">Adultos Mayores 60+ años</strong> (N = 1,538,841 | n = 2,366)
            </span>
          )}
          {modo === 'comparativo' && (
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#0F2C59]">
                <span className="w-3 h-3 rounded-sm bg-[#0F2C59] inline-block" /> Población General (≥ 4 años)
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#00A8E8]">
                <span className="w-3 h-3 rounded-sm bg-[#00A8E8] inline-block" /> Adultos Mayores (60+ años)
              </span>
            </div>
          )}
          <span className="font-mono text-[11px] text-slate-500">
            Umbral de publicación INE: CV ≤ 20.0%
          </span>
        </div>

        <div className="space-y-4">
          {dominios.map((dom) => {
            const metGral = dom.general_4_mas;
            const met60 = dom.adultos_mayores_60_mas;
            const metActiva = modo === 'adultos_mayores_60_mas' ? met60 : metGral;
            const pctWidthActiva = Math.min(100, (metActiva.valor / maxValor) * 100);
            const ratio60vsGral = metGral.valor > 0 ? (met60.valor / metGral.valor).toFixed(1) : '1.0';

            return (
              <div
                key={dom.codigo}
                className="p-3.5 rounded-lg border border-slate-200/90 hover:border-[#00A8E8]/60 transition bg-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-[#0F2C59]/10 text-[#0F2C59]">
                      {ICONOS_DOMINIO[dom.id] || <BarChart3 className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">{dom.nombre}</span>
                        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {dom.codigo}
                        </span>
                      </div>
                    </div>
                  </div>

                  {modo !== 'comparativo' ? (
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <CVBadge cv={metActiva.cv} estado={metActiva.estado_cv} compact />
                      <span className="text-xs font-mono text-slate-500">
                        SE ±{metActiva.se.toFixed(2)}%
                      </span>
                      <span
                        className={`text-lg font-extrabold ${
                          modo === 'adultos_mayores_60_mas' ? 'text-[#00A8E8]' : 'text-[#0F2C59]'
                        }`}
                      >
                        {metActiva.valor.toFixed(2)}%
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                      <span className="px-2 py-0.5 rounded bg-[#00A8E8]/10 text-[#0F2C59] font-bold">
                        {ratio60vsGral}x mayor en 60+ años
                      </span>
                    </div>
                  )}
                </div>

                {/* Barras Visuales */}
                {modo !== 'comparativo' ? (
                  <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        modo === 'adultos_mayores_60_mas' ? 'bg-[#00A8E8]' : 'bg-[#0F2C59]'
                      }`}
                      style={{ width: `${pctWidthActiva}%` }}
                    />
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    {/* Barra General >= 4 años */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600 font-medium">Población General (≥ 4 años)</span>
                        <div className="flex items-center gap-2">
                          <CVBadge cv={metGral.cv} estado={metGral.estado_cv} compact />
                          <span className="font-bold text-[#0F2C59] w-14 text-right">
                            {metGral.valor.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0F2C59] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (metGral.valor / 12.5) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Barra Adultos Mayores 60+ */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600 font-medium">Adultos Mayores (60+ años)</span>
                        <div className="flex items-center gap-2">
                          <CVBadge cv={met60.cv} estado={met60.estado_cv} compact />
                          <span className="font-bold text-[#00A8E8] w-14 text-right">
                            {met60.valor.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00A8E8] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (met60.valor / 12.5) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
