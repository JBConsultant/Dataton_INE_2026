import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Eye,
  Ear,
  Footprints,
  Brain,
  HeartHandshake,
  MessageSquare,
} from 'lucide-react';
import { DominioWG, FiltroEdad } from '../types/dashboard';
import { CVBadge } from './CVBadge';

interface WashingtonDomainsChartProps {
  dominios: DominioWG[];
  edadSeleccionada: FiltroEdad;
}

type ModoPoblacionWG = 'general_4_mas' | 'adultos_mayores_60_mas';

const ICONOS_DOMINIO: Record<string, React.ReactNode> = {
  caminar: <Footprints className="w-5 h-5" />,
  ver: <Eye className="w-5 h-5" />,
  recordar: <Brain className="w-5 h-5" />,
  oir: <Ear className="w-5 h-5" />,
  comunicarse: <MessageSquare className="w-5 h-5" />,
  cuidado_personal: <HeartHandshake className="w-5 h-5" />,
};

const DESCRIPCION_CIUDADANA: Record<string, string> = {
  caminar: 'Movilidad física, desplazarse o subir gradas',
  ver: 'Dificultad visual severa incluso usando lentes',
  recordar: 'Memoria, atención o concentración en la vida diaria',
  oir: 'Dificultad auditiva severa incluso con aparato',
  comunicarse: 'Entender o hacerse entender por los demás',
  cuidado_personal: 'Bañarse, vestirse o alimentarse por sí mismo',
};

export const WashingtonDomainsChart: React.FC<WashingtonDomainsChartProps> = ({
  dominios,
  edadSeleccionada,
}) => {
  const [modo, setModo] = useState<ModoPoblacionWG>('general_4_mas');

  // Si el usuario selecciona "Adultos Mayores (60+)" en la barra maestra superior, sincronizamos automáticamente el switch
  useEffect(() => {
    if (edadSeleccionada === '60+') {
      setModo('adultos_mayores_60_mas');
    } else if (edadSeleccionada === 'TODOS') {
      setModo('general_4_mas');
    }
  }, [edadSeleccionada]);

  // Escala visual máxima para que las barras horizontales aprovechen el ancho de forma limpia
  const maxValor = modo === 'general_4_mas' ? 2.0 : 12.0;

  return (
    <section
      aria-label="¿Qué actividades presentan mayor dificultad?"
      className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm"
    >
      {/* Encabezado y Switch Población General (4+) vs Adultos Mayores (60+) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#0F2C59] text-white shrink-0 mt-0.5">
            <BarChart3 className="w-5 h-5 text-[#00A8E8]" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#00A8E8]">
              Gráfico 2 • Los 6 Dominios del Washington Group
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0F2C59]">
              ¿Qué actividades presentan mayor dificultad?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Caminar y ver son las dos limitaciones cotidianas más frecuentes en Guatemala.
            </p>
          </div>
        </div>

        {/* Switch interactivo entre Población General (4+) y Adultos Mayores (60+) */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={() => setModo('general_4_mas')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              modo === 'general_4_mas'
                ? 'bg-[#0F2C59] text-white shadow-2xs'
                : 'text-slate-600 hover:text-[#0F2C59]'
            }`}
          >
            Población General (4+)
          </button>
          <button
            type="button"
            onClick={() => setModo('adultos_mayores_60_mas')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              modo === 'adultos_mayores_60_mas'
                ? 'bg-[#00A8E8] text-white shadow-2xs'
                : 'text-slate-600 hover:text-[#0F2C59]'
            }`}
          >
            Adultos Mayores (60+)
          </button>
        </div>
      </div>

      {/* Lista de los 6 Dominios con Íconos Intuitivos y Etiqueta "1 de cada X" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dominios.map((dom, index) => {
          const metActiva =
            modo === 'adultos_mayores_60_mas'
              ? dom.adultos_mayores_60_mas
              : dom.general_4_mas;

          const pctWidthActiva = Math.min(
            100,
            Math.max(5, (metActiva.valor / maxValor) * 100)
          );
          const ratioUnoDeCada =
            metActiva.valor > 0 ? Math.round(100 / metActiva.valor) : 0;
          const personasAfectadas = Math.round(
            metActiva.poblacion_expandida * (metActiva.valor / 100)
          );
          const esTop2 = index < 2;

          return (
            <div
              key={dom.codigo}
              title={`${dom.nombre}: ${metActiva.valor.toFixed(2)}% (1 de cada ${ratioUnoDeCada} personas)`}
              className="group p-4 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-[#00A8E8] hover:shadow-xs transition-all bg-[#F8FAFC]/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl transition-colors ${
                        esTop2
                          ? 'bg-[#00A8E8] text-white'
                          : 'bg-[#0F2C59]/10 text-[#0F2C59] group-hover:bg-[#00A8E8]/15'
                      }`}
                    >
                      {ICONOS_DOMINIO[dom.id] || <BarChart3 className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-[#0F2C59]">
                        {dom.nombre}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {DESCRIPCION_CIUDADANA[dom.id] || 'Actividad funcional básica'}
                      </p>
                    </div>
                  </div>

                  <CVBadge
                    cv={metActiva.cv}
                    estado={metActiva.estado_cv}
                    compact
                  />
                </div>

                {/* Cifras y etiqueta "1 de cada X" al final de la barra */}
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-2xl sm:text-3xl font-black tracking-tight ${
                        modo === 'adultos_mayores_60_mas'
                          ? 'text-[#00A8E8]'
                          : 'text-[#0F2C59]'
                      }`}
                    >
                      {metActiva.valor.toFixed(2)}%
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      (~{personasAfectadas.toLocaleString('es-GT')} personas)
                    </span>
                  </div>

                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white text-[#0F2C59] font-extrabold text-xs border border-slate-200 shadow-2xs">
                    1 de cada {ratioUnoDeCada}
                  </span>
                </div>
              </div>

              {/* Barra Horizontal Limpia */}
              <div className="w-full h-3.5 bg-slate-200/80 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    modo === 'adultos_mayores_60_mas'
                      ? 'bg-[#00A8E8]'
                      : esTop2
                      ? 'bg-[#00A8E8]'
                      : 'bg-[#0F2C59]'
                  }`}
                  style={{ width: `${pctWidthActiva}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
