import React, { useState, useEffect } from 'react';
import { Home, User, Users, AlertCircle, RotateCcw, Sparkles } from 'lucide-react';
import {
  DashboardData,
  CrucePrevalencia,
  FiltroEdad,
  FiltroSexo,
} from '../types/dashboard';
import { CVBadge } from './CVBadge';

interface KpiCardsProps {
  kpisHogar: DashboardData['kpis_hogar'];
  registroActual: CrucePrevalencia;
  edadSeleccionada: FiltroEdad;
  sexoSeleccionado: FiltroSexo;
  onResetFiltros: () => void;
}

type PerspectivaVisual = 'personas' | 'hogares';

const ETIQUETA_SEGMENTO: Record<FiltroEdad, Record<FiltroSexo, string>> = {
  TODOS: {
    TODOS: 'personas (4+ años)',
    Hombres: 'hombres (4+ años)',
    Mujeres: 'mujeres (4+ años)',
  },
  '4-17': {
    TODOS: 'niños, niñas y jóvenes (4–17 años)',
    Hombres: 'niños y jóvenes hombres (4–17 años)',
    Mujeres: 'niñas y jóvenes mujeres (4–17 años)',
  },
  '18-59': {
    TODOS: 'adultos (18–59 años)',
    Hombres: 'hombres adultos (18–59 años)',
    Mujeres: 'mujeres adultas (18–59 años)',
  },
  '60+': {
    TODOS: 'adultos mayores (60+ años)',
    Hombres: 'hombres adultos mayores (60+ años)',
    Mujeres: 'mujeres adultas mayores (60+ años)',
  },
};

export const KpiCards: React.FC<KpiCardsProps> = ({
  kpisHogar,
  registroActual,
  edadSeleccionada,
  sexoSeleccionado,
  onResetFiltros,
}) => {
  const esFiltroGeneral =
    edadSeleccionada === 'TODOS' && sexoSeleccionado === 'TODOS';

  // Cuando el usuario filtra por un grupo específico de Edad o Sexo, mostramos automáticamente el segmento demográfico.
  // En la vista general ("Todos"), puede alternar entre "Nivel Hogar (13.42%)" y "Nivel Personas (3.78%)" con un clic.
  const [perspectiva, setPerspectiva] = useState<PerspectivaVisual>('hogares');

  useEffect(() => {
    if (!esFiltroGeneral) {
      setPerspectiva('personas');
    }
  }, [esFiltroGeneral]);

  const mostrarModoHogar = esFiltroGeneral && perspectiva === 'hogares';

  const hogarSev = kpisHogar.discapacidad_severa;
  const hogarAlg = kpisHogar.alguna_dificultad;
  const pobSev = registroActual.discapacidad_severa;
  const pobAlg = registroActual.alguna_dificultad;

  const publicable = mostrarModoHogar ? hogarSev.publicable : pobSev.publicable;
  const porcentaje = mostrarModoHogar ? hogarSev.valor : pobSev.valor;
  const estadoCv = mostrarModoHogar ? hogarSev.estado_cv : pobSev.estado_cv;
  const cv = mostrarModoHogar ? hogarSev.cv : pobSev.cv;

  const conteoCondicion = mostrarModoHogar
    ? hogarSev.hogares_con_condicion_est
    : registroActual.personas_con_disc_severa_est;

  const universoTotal = mostrarModoHogar
    ? hogarSev.poblacion_expandida
    : pobSev.poblacion_expandida;

  const etiquetaSustantivo = mostrarModoHogar
    ? 'hogares en Guatemala'
    : ETIQUETA_SEGMENTO[edadSeleccionada][sexoSeleccionado];

  const porcentajeAlguna = mostrarModoHogar
    ? hogarAlg.valor
    : pobAlg?.publicable
    ? pobAlg.valor
    : null;

  // Cálculo de "1 de cada X"
  const xExacto = porcentaje > 0 ? Math.round(100 / porcentaje) : 0;
  // Límite visual de máximo 20 íconos para el pictograma si el porcentaje es muy bajo
  const totalIconosVisuales = Math.min(20, Math.max(2, xExacto));
  const superaLimitePictograma = xExacto > 20;

  // Parámetros del Donut Chart SVG
  const radio = 54;
  const circunferencia = 2 * Math.PI * radio;
  const strokeDashoffset =
    circunferencia - (Math.min(100, porcentaje) / 100) * circunferencia;

  return (
    <section aria-label="Comparador Dual: El Dato Oficial vs. En Palabras Simples" className="space-y-4">
      {/* Barra superior del bloque protagonista: Contexto activo + Selector Hogares / Personas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-2.5 h-2.5 rounded-full bg-[#00A8E8]" />
          <span className="text-sm font-semibold text-slate-600">
            Viendo actualmente:{' '}
            <strong className="text-[#0F2C59]">
              {mostrarModoHogar
                ? 'Hogares a Nivel Nacional (4.1 millones de hogares)'
                : `Población de ${etiquetaSustantivo}`}
            </strong>
          </span>
        </div>

        {/* Toggle rápido Hogar vs Personas (si hay filtro demográfico activo, permite volver a vista Hogares o alternar) */}
        <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              if (!esFiltroGeneral) {
                onResetFiltros();
              }
              setPerspectiva('hogares');
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mostrarModoHogar
                ? 'bg-[#0F2C59] text-white shadow-2xs'
                : 'text-slate-600 hover:text-[#0F2C59]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            En los Hogares (13.42%)
          </button>
          <button
            type="button"
            onClick={() => setPerspectiva('personas')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !mostrarModoHogar
                ? 'bg-[#00A8E8] text-white shadow-2xs'
                : 'text-slate-600 hover:text-[#0F2C59]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            En las Personas ({pobSev.publicable ? `${pobSev.valor.toFixed(2)}%` : 'Filtro activo'})
          </button>
        </div>
      </div>

      {/* GUARDRAIL ESTADÍSTICO SILENCIOSO Y AMIGABLE */}
      {!publicable ? (
        <div
          role="alert"
          className="bg-white rounded-2xl border-2 border-amber-300 p-6 sm:p-8 shadow-sm text-center max-w-3xl mx-auto my-2"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="mb-2">
            <CVBadge cv={cv} estado={estadoCv} />
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#0F2C59] mb-2">
            Muestra insuficiente para este cruce específico
          </h3>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-6">
            Por rigor estadístico del INE (CV &gt; 20%), este cruce específico no tiene muestra suficiente para mostrarse con precisión. Prueba seleccionando <strong>&apos;Todos&apos;</strong> en Sexo o Edad.
          </p>
          <button
            type="button"
            onClick={onResetFiltros}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F2C59] hover:bg-[#163d7a] text-white text-sm font-bold shadow-sm transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#00A8E8]" />
            Seleccionar &apos;Todos&apos; en Edad y Sexo
          </button>
        </div>
      ) : (
        /* BLOQUE CENTRAL PROTAGONISTA: 2 TARJETAS GRANDES LADO A LADO */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TARJETA IZQUIERDA — "En Porcentajes (Dato Oficial)" */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between gap-3 mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#00A8E8] mb-1">
                  {mostrarModoHogar ? (
                    <Home className="w-4 h-4" />
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                  En Porcentajes (Dato Oficial)
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0F2C59]">
                  {mostrarModoHogar
                    ? 'Hogares con dificultades severas'
                    : `Prevalencia en ${etiquetaSustantivo}`}
                </h2>
              </div>
              <CVBadge cv={cv} estado={estadoCv} />
            </div>

            {/* Centro visual: Porcentaje Gigante + Donut Chart Limpio */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 my-2">
              {/* Gráfico de Anillo (Donut Chart) */}
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                  {/* Círculo base */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radio}
                    fill="transparent"
                    stroke="#E2E8F0"
                    strokeWidth="14"
                  />
                  {/* Arco de progreso */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radio}
                    fill="transparent"
                    stroke="#00A8E8"
                    strokeWidth="14"
                    strokeDasharray={circunferencia}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  {mostrarModoHogar ? (
                    <Home className="w-6 h-6 text-[#0F2C59]" />
                  ) : (
                    <Users className="w-6 h-6 text-[#0F2C59]" />
                  )}
                  <span className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">
                    {mostrarModoHogar ? 'Hogares' : 'Población'}
                  </span>
                </div>
              </div>

              {/* Cifra en Tipografía Gigante */}
              <div className="text-center sm:text-left space-y-2">
                <div className="text-5xl sm:text-6xl font-black text-[#0F2C59] tracking-tight leading-none">
                  {porcentaje.toFixed(2)}%
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#00A8E8]/10 text-[#0F2C59] font-extrabold text-sm sm:text-base border border-[#00A8E8]/25">
                  <span>
                    {conteoCondicion.toLocaleString('es-GT')}{' '}
                    {mostrarModoHogar ? 'hogares' : 'personas'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  De un total nacional de{' '}
                  <strong className="text-slate-700">
                    {universoTotal.toLocaleString('es-GT')}{' '}
                    {mostrarModoHogar ? 'hogares' : etiquetaSustantivo}
                  </strong>
                  .
                </p>
              </div>
            </div>

            {/* Nota inferior ciudadana: Alguna dificultad leve o moderada */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>
                Incluyendo dificultades leves o moderadas:{' '}
                <strong className="text-[#0F2C59]">
                  {porcentajeAlguna !== null ? `${porcentajeAlguna.toFixed(2)}%` : 'N/A'}
                </strong>
              </span>
              <span className="text-slate-400 font-medium">
                Criterio: Mucha dificultad o no puede hacerlo
              </span>
            </div>
          </div>

          {/* TARJETA DERECHA — "En Palabras Simples (1 de cada X)" */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#F97316] mb-1">
                  <Sparkles className="w-4 h-4" />
                  En Palabras Simples (Proporción Real)
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0F2C59]">
                  ¿Qué significa este porcentaje en tu comunidad?
                </h2>
              </div>
              <CVBadge cv={cv} estado={estadoCv} />
            </div>

            {/* Titular Gigante "1 de cada X" */}
            <div className="my-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl sm:text-5xl font-black text-[#0F2C59] tracking-tight">
                  1 de cada {xExacto}
                </span>
                <span className="text-base sm:text-lg font-bold text-[#00A8E8]">
                  {etiquetaSustantivo}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1.5">
                {mostrarModoHogar
                  ? 'En aproximadamente 1 de cada 7 hogares guatemaltecos vive al menos una persona con dificultad severa para realizar actividades básicas.'
                  : `Si reúnes a ${xExacto} ${etiquetaSustantivo}, en promedio 1 vive con una dificultad funcional severa o total.`}
              </p>
            </div>

            {/* Pictograma Dinámico de Siluetas / Casas */}
            <div className="my-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
                <span>
                  Representación visual ({mostrarModoHogar ? 'Hogares' : 'Personas'}):
                </span>
                <span className="text-[#00A8E8]">
                  1 iluminado de {xExacto}
                  {superaLimitePictograma ? ' (mostrando escala 1 a 20)' : ''}
                </span>
              </div>

              <div
                className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 justify-items-center"
                aria-label={`Pictograma: 1 de cada ${xExacto} iluminado`}
              >
                {Array.from({ length: totalIconosVisuales }).map((_, idx) => {
                  const iluminado = idx === 0;
                  return (
                    <div
                      key={idx}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        iluminado
                          ? 'bg-[#00A8E8] text-white shadow-md scale-105 ring-4 ring-[#00A8E8]/20'
                          : 'bg-[#E2E8F0] text-slate-400'
                      }`}
                      title={
                        iluminado
                          ? `1 con dificultad funcional severa`
                          : `Sin dificultad funcional severa`
                      }
                    >
                      {mostrarModoHogar ? (
                        <Home className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-2 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#00A8E8] inline-block" />
                <strong className="text-[#0F2C59]">Con dificultad severa</strong>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#E2E8F0] inline-block" />
                <span>Resto de {mostrarModoHogar ? 'hogares' : 'la población'}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
