import React from 'react';
import {
  BookMarked,
  ShieldCheck,
  Database,
  FileSpreadsheet,
  Home,
  Activity,
  Lock,
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
}) => {
  const defs = definiciones ?? DEFAULT_DEFINICIONES;
  const metSevera = registroActual.discapacidad_severa;

  return (
    <aside
      aria-label="Marco Conceptual y Trazabilidad INE"
      className="lg:sticky lg:top-6 space-y-5"
    >
      {/* Encabezado del Panel Lateral */}
      <div className="bg-[#0F2C59] text-white rounded-xl p-4 shadow-sm border border-[#0F2C59]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#00A8E8] text-[#0F2C59]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A8E8]">
              Panel de Gobernanza Estadística
            </span>
            <h2 className="text-base font-extrabold tracking-tight">
              Marco Conceptual y Trazabilidad INE
            </h2>
          </div>
        </div>
      </div>

      {/* B) Ficha de Auditoría Técnica en Tiempo Real del Filtro Seleccionado */}
      <div className="bg-white rounded-xl border-2 border-[#0F2C59]/20 shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00A8E8]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Auditoría Técnica en Tiempo Real
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-[#00A8E8]/20 text-[#00A8E8] px-2 py-0.5 rounded">
            LIVE FILTER
          </span>
        </div>

        <div className="p-4 space-y-3.5">
          {/* Subpoblación Activa */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="text-xs text-slate-500">
              Filtro activo:{' '}
              <strong className="text-[#0F2C59]">
                Edad: {registroActual.filtro_edad}
              </strong>{' '}
              ×{' '}
              <strong className="text-[#00A8E8]">
                Sexo: {registroActual.filtro_sexo}
              </strong>
            </div>
            <CVBadge
              cv={metSevera.cv}
              estado={metSevera.estado_cv}
              compact
            />
          </div>

          {/* Métricas Muestrales (n_muestral, SE, CV %) */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold uppercase text-slate-400">
                n_muestral
              </div>
              <div className="text-sm font-extrabold font-mono text-[#0F2C59] mt-0.5">
                {metSevera.n_muestral.toLocaleString('es-GT')}
              </div>
              <div className="text-[10px] text-slate-500">registros</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold uppercase text-slate-400">
                Error Estándar (SE)
              </div>
              <div className="text-sm font-extrabold font-mono text-[#0F2C59] mt-0.5">
                ±{metSevera.se.toFixed(2)}%
              </div>
              <div className="text-[10px] text-slate-500">Taylor UPM</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold uppercase text-slate-400">
                CV %
              </div>
              <div
                className={`text-sm font-extrabold font-mono mt-0.5 ${
                  metSevera.estado_cv === 'CONFIABLE'
                    ? 'text-emerald-700'
                    : metSevera.estado_cv === 'PRECAUCION'
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                {metSevera.cv !== null ? `${metSevera.cv.toFixed(2)}%` : 'N/A'}
              </div>
              <div className="text-[10px] text-slate-500">
                Máx: {metadata.umbral_cv_maximo.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Universo Expandido y Condición de Publicabilidad */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Población expandida (N):</span>
              <strong className="font-mono text-slate-800">
                {metSevera.poblacion_expandida.toLocaleString('es-GT')}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Con dificultad severa:</span>
              <strong className="font-mono text-[#0F2C59]">
                {metSevera.publicable
                  ? `${registroActual.personas_con_disc_severa_est.toLocaleString('es-GT')} (${metSevera.valor.toFixed(2)}%)`
                  : 'RESERVADO (CV > 20%)'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dictamen INE:</span>
              <strong
                className={
                  metSevera.publicable ? 'text-emerald-700' : 'text-rose-700'
                }
              >
                {metSevera.publicable
                  ? `PUBLICABLE (${metSevera.estado_cv})`
                  : 'NO PUBLICABLE (OCULTO)'}
              </strong>
            </div>
          </div>

          {/* Fuente Oficial y Nota de No Fusión de Encuestas */}
          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#00A8E8] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#0F2C59] block">
                  Fuente Oficial Primaria:
                </span>
                <span className="text-slate-600 font-mono text-[11px]">
                  ENAPROM 2025 - ENAPROM_PERSONAS-3.xlsx
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#0F2C59]/5 border border-[#0F2C59]/15">
              <Lock className="w-4 h-4 text-[#0F2C59] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#0F2C59] block">
                  Garantía de No Fusión de Encuestas:
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">
                  {metadata.nota_metodologica}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* A) Bloques de Definiciones Oficiales (definiciones_oficiales) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[#0F2C59] text-white px-4 py-3 flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-[#00A8E8]" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Definiciones Oficiales Auditadas
          </h3>
        </div>

        <div className="p-4 space-y-4">
          {/* Bloque 1: ¿Qué es un Hogar y cómo se calcula? */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#0F2C59] font-bold text-xs">
              <Home className="w-4 h-4 text-[#00A8E8] shrink-0" />
              <h4>{defs.hogar.titulo}</h4>
            </div>
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <div>
                <span className="font-bold text-[#0F2C59] uppercase text-[10px] tracking-wider block">
                  Definición INE (definicion_ine):
                </span>
                <p>{defs.hogar.definicion_ine}</p>
              </div>
              <div className="pt-1.5 border-t border-slate-200/80">
                <span className="font-bold text-[#00A8E8] uppercase text-[10px] tracking-wider block">
                  Método de Cálculo (metodo_calculo):
                </span>
                <p>{defs.hogar.metodo_calculo}</p>
              </div>
            </div>
          </div>

          {/* Bloque 2: ¿Por qué 'Dificultades Funcionales Severas' (Washington Group)? */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#0F2C59] font-bold text-xs">
              <Database className="w-4 h-4 text-[#00A8E8] shrink-0" />
              <h4>{defs.washington_group.titulo}</h4>
            </div>
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <div>
                <span className="font-bold text-[#0F2C59] uppercase text-[10px] tracking-wider block">
                  Enfoque Funcional (definicion_wg):
                </span>
                <p>{defs.washington_group.definicion_wg}</p>
              </div>
              <div className="pt-1.5 border-t border-slate-200/80">
                <span className="font-bold text-[#00A8E8] uppercase text-[10px] tracking-wider block">
                  Criterio Estadístico (criterio_estadistico):
                </span>
                <p>{defs.washington_group.criterio_estadistico}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
