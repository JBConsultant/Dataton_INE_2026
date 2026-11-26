import React, { useState } from 'react';
import {
  BookMarked,
  ShieldCheck,
  Database,
  FileSpreadsheet,
  Home,
  Activity,
  ChevronDown,
  ChevronUp,
  Download,
} from 'lucide-react';
import {
  CrucePrevalencia,
  DashboardData,
  DefinicionesOficiales,
} from '../types/dashboard';
import { CVBadge } from './CVBadge';

interface SidebarAuditPanelProps {
  metadata: DashboardData['metadata'];
  definiciones?: DefinicionesOficiales;
  registroActual: CrucePrevalencia;
  onExportCSV: () => void;
}

const DEFAULT_DEFINICIONES: DefinicionesOficiales = {
  hogar: {
    titulo: '¿Qué es un Hogar y cómo se calcula?',
    definicion_ine:
      'Según el INE (ENAPROM 2025), un hogar es la unidad doméstica formada por una persona sola o un grupo de personas, con o sin vínculo de parentesco, que residen habitualmente en la misma vivienda y comparten un presupuesto común para la alimentación.',
    metodo_calculo:
      'A partir de la base oficial de personas (ENAPROM_PERSONAS-3.xlsx), se agrupan los residentes por la llave única de hogar (NO_HOGAR, n = 5,124 hogares; N = 4,107,011 hogares expandidos). Un hogar se clasifica con presencia de dificultad funcional severa si al menos un integrante de 4 años o más (CP) presenta código 3 o 4 en los dominios del Washington Group, aplicando el factor de expansión del hogar (FACTOR) y linealización de Taylor por conglomerado.',
  },
  washington_group: {
    titulo: "¿Por qué 'Dificultades Funcionales Severas' (Washington Group)?",
    definicion_wg:
      "El Grupo de Washington sobre Estadísticas de Discapacidad (WG-SS), adoptado por el INE en el Capítulo II de la ENAPROM 2025 (preguntas P02A11A a P02A11F), evalúa limitaciones funcionales en 6 dominios básicos (ver, oír, caminar, recordar/concentrarse, cuidado personal y comunicarse) en población de 4 años y más, evitando el subregistro asociado al estigma del término clínico 'discapacidad'.",
    criterio_estadistico:
      "La escala de respuesta tiene 4 niveles: 1) Sin dificultad, 2) Cierta dificultad, 3) Mucha dificultad y 4) No puede hacerlo. Siguiendo el estándar internacional del Washington Group para comparabilidad y focalización de políticas públicas, el umbral operativo de 'Dificultad Funcional Severa (Discapacidad)' incluye exclusivamente a quienes reportan código 3 (Mucha dificultad) o código 4 (No puede hacerlo) en al menos un dominio.",
  },
};

export const SidebarAuditPanel: React.FC<SidebarAuditPanelProps> = ({
  metadata,
  definiciones,
  registroActual,
  onExportCSV,
}) => {
  const [abierto, setAbierto] = useState<boolean>(false);
  const defs = definiciones ?? DEFAULT_DEFINICIONES;
  const metSevera = registroActual.discapacidad_severa;

  return (
    <section
      aria-label="Ficha metodológica y definiciones del INE"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
    >
      {/* Botón Principal del Acordeón Colapsable al Pie de Página */}
      <button
        type="button"
        onClick={() => setAbierto((prev) => !prev)}
        aria-expanded={abierto}
        className="w-full px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left hover:bg-slate-50/80 transition cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#0F2C59] text-white shrink-0">
            <BookMarked className="w-5 h-5 text-[#00A8E8]" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#00A8E8] block">
              Transparencia y Rigor Técnico • ENAPROM 2025
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0F2C59]">
              Ver ficha metodológica y definiciones del INE
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Consulta qué es un hogar, qué significa el estándar Washington Group, los indicadores de precisión (SE / CV) y descarga la base en CSV.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-[#0F2C59] text-xs font-extrabold self-start sm:self-center shrink-0">
          <span>{abierto ? 'Ocultar ficha técnica' : 'Desplegar ficha'}</span>
          {abierto ? (
            <ChevronUp className="w-4 h-4 text-[#00A8E8]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#00A8E8]" />
          )}
        </div>
      </button>

      {/* Contenido Colapsable */}
      {abierto && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-6 bg-[#F8FAFC]/50">
          {/* Bloque 1: Definiciones Oficiales Ciudadanas e Institucionales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            {/* ¿Qué es un Hogar? */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2.5 text-[#0F2C59] font-extrabold text-sm">
                <Home className="w-5 h-5 text-[#00A8E8] shrink-0" />
                <h3>{defs.hogar.titulo}</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {defs.hogar.definicion_ine}
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                <strong className="text-[#0F2C59]">Cálculo en ENAPROM 2025:</strong>{' '}
                {defs.hogar.metodo_calculo}
              </div>
            </div>

            {/* ¿Qué significa Dificultades Funcionales Severas? */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2.5 text-[#0F2C59] font-extrabold text-sm">
                <Database className="w-5 h-5 text-[#00A8E8] shrink-0" />
                <h3>{defs.washington_group.titulo}</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {defs.washington_group.definicion_wg}
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                <strong className="text-[#0F2C59]">Umbral oficial (Códigos 3 y 4):</strong>{' '}
                {defs.washington_group.criterio_estadistico}
              </div>
            </div>
          </div>

          {/* Bloque 2: Detalle Técnico Muestral (SE / CV) del Filtro Activo y Botón de Descarga CSV */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <Activity className="w-4 h-4 text-[#00A8E8]" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F2C59]">
                  Detalle Muestral del Segmento Seleccionado (Edad: {registroActual.filtro_edad} • Sexo: {registroActual.filtro_sexo})
                </span>
                <CVBadge cv={metSevera.cv} estado={metSevera.estado_cv} compact />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 font-bold block">
                    Muestra (n)
                  </span>
                  <strong className="text-sm font-black text-[#0F2C59] font-mono">
                    {metSevera.n_muestral.toLocaleString('es-GT')} personas
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 font-bold block">
                    Error Estándar (SE)
                  </span>
                  <strong className="text-sm font-black text-[#0F2C59] font-mono">
                    ±{metSevera.se.toFixed(2)}%
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 font-bold block">
                    Coeficiente Variación (CV)
                  </span>
                  <strong className="text-sm font-black text-[#0F2C59] font-mono">
                    {metSevera.cv !== null ? `${metSevera.cv.toFixed(2)}%` : 'N/A'} (Máx {metadata.umbral_cv_maximo}%)
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 font-bold block">
                    Población Expandida (N)
                  </span>
                  <strong className="text-sm font-black text-[#0F2C59] font-mono">
                    {metSevera.poblacion_expandida.toLocaleString('es-GT')}
                  </strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#00A8E8]" />
                  Fuente primaria: <strong>{metadata.fuentes[0]}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {metadata.nota_metodologica}
                </span>
              </div>
            </div>

            {/* Botón de Descarga CSV */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={onExportCSV}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-[#0F2C59] hover:bg-[#163d7a] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#00A8E8]" />
                Descargar Datos Validados (CSV)
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
