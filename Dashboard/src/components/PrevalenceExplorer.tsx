import React from 'react';
import { Filter, ShieldAlert, AlertTriangle, CheckCircle2, Users, RotateCcw } from 'lucide-react';
import { CrucePrevalencia, FiltroEdad, FiltroSexo } from '../types/dashboard';
import { CVBadge } from './CVBadge';

interface PrevalenceExplorerProps {
  edadSeleccionada: FiltroEdad;
  sexoSeleccionado: FiltroSexo;
  onChangeEdad: (edad: FiltroEdad) => void;
  onChangeSexo: (sexo: FiltroSexo) => void;
  registroActual: CrucePrevalencia;
  todosLosCruces: CrucePrevalencia[];
}

const GRUPOS_EDAD: { value: FiltroEdad; label: string; desc: string }[] = [
  { value: 'TODOS', label: 'TODOS (≥ 4 años)', desc: 'Total Nacional' },
  { value: '4-17', label: '4–17 años', desc: 'Niñez y Adolescencia' },
  { value: '18-59', label: '18–59 años', desc: 'Población Adulta' },
  { value: '60+', label: '60+ años', desc: 'Adultos Mayores' },
];

const GRUPOS_SEXO: { value: FiltroSexo; label: string }[] = [
  { value: 'TODOS', label: 'TODOS' },
  { value: 'Hombres', label: 'Hombres' },
  { value: 'Mujeres', label: 'Mujeres' },
];

export const PrevalenceExplorer: React.FC<PrevalenceExplorerProps> = ({
  edadSeleccionada,
  sexoSeleccionado,
  onChangeEdad,
  onChangeSexo,
  registroActual,
  todosLosCruces,
}) => {
  const metricaSevera = registroActual.discapacidad_severa;
  const metricaAlguna = registroActual.alguna_dificultad;
  const esFiltrado = edadSeleccionada !== 'TODOS' || sexoSeleccionado !== 'TODOS';

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Encabezado Institucional */}
      <div className="bg-[#0F2C59] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Filter className="w-4 h-4 text-[#00A8E8]" />
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase">
              Explorador Interactivo de Prevalencia Demográfica
            </h3>
            <p className="text-xs text-slate-300">
              Segmentación por Grupo Etario y Sexo con control automático de precisión estadística (Umbral INE: CV ≤ 20%)
            </p>
          </div>
        </div>
        {esFiltrado && (
          <button
            type="button"
            onClick={() => {
              onChangeEdad('TODOS');
              onChangeSexo('TODOS');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer filtros
          </button>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Controles de Filtro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200/80">
          {/* Filtro Grupo de Edad */}
          <div className="lg:col-span-7">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F2C59] mb-2">
              1. Grupo de Edad (P02A03)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GRUPOS_EDAD.map((g) => {
                const active = edadSeleccionada === g.value;
                return (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => onChangeEdad(g.value)}
                    className={`px-3 py-2 rounded-lg text-left border transition-all ${
                      active
                        ? 'bg-[#0F2C59] text-white border-[#0F2C59] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-[#00A8E8]'
                    }`}
                  >
                    <div className="text-xs font-bold">{g.label}</div>
                    <div className={`text-[10px] truncate ${active ? 'text-[#00A8E8]' : 'text-slate-400'}`}>
                      {g.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtro Sexo */}
          <div className="lg:col-span-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F2C59] mb-2">
              2. Sexo (P02A02)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {GRUPOS_SEXO.map((s) => {
                const active = sexoSeleccionado === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => onChangeSexo(s.value)}
                    className={`px-3 py-2.5 rounded-lg text-center border text-xs font-bold transition-all ${
                      active
                        ? 'bg-[#00A8E8] text-white border-[#00A8E8] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-[#00A8E8]'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Resultado del Cruce Seleccionado con Guardrails Estadísticos INE */}
        {!metricaSevera.publicable ? (
          /* GUARDRAIL OBLIGATORIO: publicable === false (Ej. 4-17 + Mujeres, CV = 20.34% > 20%) */
          <div
            role="alert"
            className="rounded-xl border-2 border-rose-300 bg-rose-50/80 p-5 text-rose-950 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-600 text-white">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700">
                    Guardrail Metodológico Activado — Regla Oficial INE
                  </span>
                  <h4 className="text-base font-bold text-rose-950">
                    CV &gt; 20%: Dato reservado por precisión estadística
                  </h4>
                </div>
              </div>
              <CVBadge cv={metricaSevera.cv} estado={metricaSevera.estado_cv} />
            </div>

            <div className="mt-3 space-y-2 text-sm text-rose-900">
              <p>
                Para la subpoblación seleccionada (<strong>Edad: {edadSeleccionada}</strong> |{' '}
                <strong>Sexo: {sexoSeleccionado}</strong>), el Coeficiente de Variación estimado mediante linealización de Taylor es{' '}
                <strong className="underline">CV = {metricaSevera.cv?.toFixed(2)}%</strong> (superando el umbral máximo permitido del{' '}
                <strong>20.0%</strong> establecido por la Dirección de Censos y Encuestas del INE).
              </p>
              <p className="text-xs text-rose-800 bg-white/80 p-3 rounded-lg border border-rose-200 font-medium">
                <strong>Acción del sistema:</strong> En cumplimiento del rigor estadístico del Datatón INE 2026, se{' '}
                <strong>oculta la proporción puntual de dificultad severa</strong> para evitar interpretaciones erróneas derivadas de alta varianza muestral (
                <span className="font-mono">n = {metricaSevera.n_muestral.toLocaleString('es-GT')}</span>,{' '}
                <span className="font-mono">SE = ±{metricaSevera.se.toFixed(2)}%</span>). Se recomienda consultar el agregado del tramo etario{' '}
                <button
                  type="button"
                  onClick={() => onChangeSexo('TODOS')}
                  className="underline font-bold text-[#0F2C59] hover:text-[#00A8E8]"
                >
                  4–17 años (TODOS, CV = 14.53%)
                </button>.
              </p>
            </div>
          </div>
        ) : (
          /* CASO PUBLICABLE: CONFIABLE (CV <= 15%) o PRECAUCION (15% < CV <= 20%) */
          <div
            className={`rounded-xl border p-5 transition-all ${
              metricaSevera.estado_cv === 'PRECAUCION'
                ? 'border-amber-300 bg-amber-50/40'
                : 'border-slate-200 bg-white'
            }`}
          >
            {metricaSevera.estado_cv === 'PRECAUCION' && (
              <div className="mb-4 flex items-start gap-2.5 rounded-lg bg-amber-100/80 border border-amber-300 px-3.5 py-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Advertencia de Precisión Estadística (15% &lt; CV ≤ 20%):</strong>{' '}
                  Esta estimación cuenta con un Coeficiente de Variación de{' '}
                  <strong>{metricaSevera.cv?.toFixed(2)}%</strong>. Es publicable bajo estándares INE, pero debe utilizarse con precaución por su dispersión muestral moderada.
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
              {/* Cifra Principal */}
              <div className="md:col-span-2 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#0F2C59] text-white">
                    Edad: {edadSeleccionada}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#00A8E8] text-white">
                    Sexo: {sexoSeleccionado}
                  </span>
                  <CVBadge cv={metricaSevera.cv} estado={metricaSevera.estado_cv} />
                </div>

                <div className="flex items-baseline gap-4 pt-1 flex-wrap">
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#0F2C59] tracking-tight">
                    {metricaSevera.valor.toFixed(2)}%
                  </span>
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      {registroActual.personas_con_disc_severa_est.toLocaleString('es-GT')} personas estimadas
                    </div>
                    <div className="text-xs text-slate-500">
                      con dificultad funcional severa (códigos 3 o 4 WG)
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 pt-1">
                  Universo del subgrupo:{' '}
                  <strong className="text-slate-800">
                    {metricaSevera.poblacion_expandida.toLocaleString('es-GT')} personas
                  </strong>{' '}
                  | Tamaño de muestra:{' '}
                  <strong className="font-mono text-slate-800">
                    n = {metricaSevera.n_muestral.toLocaleString('es-GT')}
                  </strong>{' '}
                  | Error Estándar:{' '}
                  <strong className="font-mono text-slate-800">±{metricaSevera.se.toFixed(2)}%</strong>
                </p>
              </div>

              {/* Comparativa con Alguna Dificultad en el mismo subgrupo */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-600">
                    Alguna dificultad (códigos 2–4)
                  </span>
                  <Users className="w-4 h-4 text-[#00A8E8]" />
                </div>
                {metricaAlguna && metricaAlguna.publicable ? (
                  <>
                    <div className="text-2xl font-extrabold text-[#00A8E8] my-1">
                      {metricaAlguna.valor.toFixed(2)}%
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>SE: ±{metricaAlguna.se.toFixed(2)}%</span>
                      <span className="font-semibold text-emerald-700">
                        CV: {metricaAlguna.cv?.toFixed(2)}%
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-rose-700 font-semibold py-2">
                    Dato reservado (CV &gt; 20%)
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Matriz Rápida de los 12 Cruces (Transparencia Total) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Mapa Rápido de Precisión Estadística (12 Subpoblaciones ENAPROM 2025)
            </span>
            <span className="text-[11px] text-slate-400">
              Haz clic en cualquier celda para inspeccionar su auditoría técnica
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {todosLosCruces.map((c) => {
              const isSelected =
                c.filtro_edad === edadSeleccionada && c.filtro_sexo === sexoSeleccionado;
              const est = c.discapacidad_severa.estado_cv;
              return (
                <button
                  key={`${c.filtro_edad}-${c.filtro_sexo}`}
                  type="button"
                  onClick={() => {
                    onChangeEdad(c.filtro_edad);
                    onChangeSexo(c.filtro_sexo);
                  }}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'ring-2 ring-[#0F2C59] border-[#0F2C59] bg-[#0F2C59]/5'
                      : 'border-slate-200 hover:border-[#00A8E8] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span>{c.filtro_edad}</span>
                    <span>{c.filtro_sexo}</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    {c.discapacidad_severa.publicable ? (
                      <span className="text-sm font-extrabold text-[#0F2C59]">
                        {c.discapacidad_severa.valor.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-rose-700">RESERVADO</span>
                    )}
                    {est === 'CONFIABLE' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    {est === 'PRECAUCION' && (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                    {est === 'NO_PUBLICABLE' && (
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    CV: {c.discapacidad_severa.cv?.toFixed(2)}%
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
