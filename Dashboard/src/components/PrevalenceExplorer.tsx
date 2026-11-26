import React from 'react';
import { TrendingUp, Users, AlertCircle } from 'lucide-react';
import { CrucePrevalencia, FiltroEdad, FiltroSexo } from '../types/dashboard';
import { CVBadge } from './CVBadge';

interface PrevalenceExplorerProps {
  edadSeleccionada: FiltroEdad;
  sexoSeleccionado: FiltroSexo;
  onChangeEdad: (edad: FiltroEdad) => void;
  todosLosCruces: CrucePrevalencia[];
}

const ETAPAS_VIDA: {
  id: FiltroEdad;
  titulo: string;
  rango: string;
  descripcion: string;
}[] = [
  {
    id: '4-17',
    titulo: 'Niñez y Juventud',
    rango: '4–17 años',
    descripcion: 'Etapa escolar y formativa',
  },
  {
    id: '18-59',
    titulo: 'Adultos',
    rango: '18–59 años',
    descripcion: 'Etapa productiva y laboral',
  },
  {
    id: '60+',
    titulo: 'Adultos Mayores',
    rango: '60+ años',
    descripcion: 'Mayor requerimiento de apoyos y cuidados',
  },
];

export const PrevalenceExplorer: React.FC<PrevalenceExplorerProps> = ({
  edadSeleccionada,
  sexoSeleccionado,
  onChangeEdad,
  todosLosCruces,
}) => {
  // Obtenemos los 3 tramos de edad filtrados por el Sexo elegido arriba
  const etapasConDatos = ETAPAS_VIDA.map((etapa) => {
    const cruce = todosLosCruces.find(
      (c) => c.filtro_edad === etapa.id && c.filtro_sexo === sexoSeleccionado
    );
    return {
      ...etapa,
      cruce,
    };
  });

  // Escala visual máxima (22% para que 19.00% o 19.74% se vea amplio y proporcionado)
  const maxEscala = 22;

  const etiquetaSexo =
    sexoSeleccionado === 'TODOS'
      ? 'Hombres y Mujeres'
      : sexoSeleccionado === 'Hombres'
      ? 'Solo Hombres'
      : 'Solo Mujeres';

  return (
    <section
      aria-label="Comparativa por Etapas de la Vida"
      className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm"
    >
      {/* Encabezado limpio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#0F2C59] text-white shrink-0 mt-0.5">
            <TrendingUp className="w-5 h-5 text-[#00A8E8]" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#00A8E8]">
              Gráfico 1 • Evolución Demográfica
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0F2C59]">
              Comparativa por Etapas de la Vida
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Las dificultades funcionales aumentan significativamente al llegar a la tercera edad. Haz clic en una etapa para seleccionarla.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 text-[#0F2C59] text-xs font-bold self-start sm:self-center shrink-0">
          <Users className="w-4 h-4 text-[#00A8E8]" />
          <span>Filtro de sexo: {etiquetaSexo}</span>
        </div>
      </div>

      {/* Barras Interactivas por Etapa de la Vida */}
      <div className="space-y-4">
        {etapasConDatos.map(({ id, titulo, rango, descripcion, cruce }) => {
          if (!cruce) return null;

          const met = cruce.discapacidad_severa;
          const esSeleccionado = edadSeleccionada === id;
          const esVistaTodos = edadSeleccionada === 'TODOS';
          const ratioUnoDeCada =
            met.publicable && met.valor > 0 ? Math.round(100 / met.valor) : null;
          const anchoBarraPct = met.publicable
            ? Math.min(100, Math.max(4, (met.valor / maxEscala) * 100))
            : 0;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onChangeEdad(esSeleccionado ? 'TODOS' : id)}
              className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer block ${
                esSeleccionado
                  ? 'border-[#00A8E8] bg-[#00A8E8]/5 shadow-sm ring-2 ring-[#00A8E8]/20'
                  : 'border-slate-200/80 hover:border-[#00A8E8]/60 bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider ${
                      esSeleccionado
                        ? 'bg-[#00A8E8] text-white'
                        : 'bg-[#0F2C59] text-white'
                    }`}
                  >
                    {rango}
                  </span>
                  <div>
                    <h4 className="text-base font-extrabold text-[#0F2C59] flex items-center gap-2">
                      {titulo}
                      {esSeleccionado && (
                        <span className="text-[11px] font-bold text-[#00A8E8] bg-[#00A8E8]/15 px-2 py-0.5 rounded-full">
                          Seleccionado arriba
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-500">{descripcion}</p>
                  </div>
                </div>

                {/* Derecha: Píldora de calidad + Cifra y "1 de cada X" */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <CVBadge cv={met.cv} estado={met.estado_cv} compact />

                  {met.publicable ? (
                    <div className="text-right">
                      <div className="flex items-baseline gap-2 justify-end">
                        <span
                          className={`text-2xl sm:text-3xl font-black tracking-tight ${
                            esSeleccionado
                              ? 'text-[#00A8E8]'
                              : id === '60+'
                              ? 'text-[#F97316]'
                              : 'text-[#0F2C59]'
                          }`}
                        >
                          {met.valor.toFixed(2)}%
                        </span>
                        {ratioUnoDeCada && (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            1 de cada {ratioUnoDeCada}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {cruce.personas_con_disc_severa_est.toLocaleString('es-GT')} personas
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                      Muestra insuficiente (CV &gt; 20%)
                    </span>
                  )}
                </div>
              </div>

              {/* Barra visual o aviso amigable si publicable === false */}
              {met.publicable ? (
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      esSeleccionado
                        ? 'bg-[#00A8E8]'
                        : esVistaTodos && id === '60+'
                        ? 'bg-[#F97316]'
                        : esVistaTodos
                        ? 'bg-[#0F2C59]'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${anchoBarraPct}%` }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-amber-900 bg-amber-50/90 border border-amber-200 rounded-xl px-3.5 py-2.5 mt-1">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Por rigor estadístico del INE (CV &gt; 20%), este cruce específico no tiene muestra suficiente para mostrarse con precisión. Prueba seleccionando &apos;Todos&apos; en Sexo o Edad.
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mensaje de lectura ciudadana rápida */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <span>
          💡 <strong className="text-[#0F2C59]">Lectura rápida:</strong> En los adultos mayores (60+ años), la dificultad funcional severa afecta a{' '}
          <strong className="text-[#F97316]">casi 1 de cada 5 personas</strong>, más de 6 veces la tasa de los adultos jóvenes.
        </span>
        {edadSeleccionada !== 'TODOS' && (
          <button
            type="button"
            onClick={() => onChangeEdad('TODOS')}
            className="text-[#00A8E8] hover:underline font-bold self-start sm:self-auto cursor-pointer"
          >
            Ver todas las edades (4+ años)
          </button>
        )}
      </div>
    </section>
  );
};
