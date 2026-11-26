import { useState, useMemo } from 'react';
import { ShieldCheck, RotateCcw, Users, Calendar } from 'lucide-react';
import rawData from './data/datos_dashboard.json';
import {
  DashboardData,
  FiltroEdad,
  FiltroSexo,
  CrucePrevalencia,
} from './types/dashboard';
import { KpiCards } from './components/KpiCards';
import { PrevalenceExplorer } from './components/PrevalenceExplorer';
import { WashingtonDomainsChart } from './components/WashingtonDomainsChart';
import { InclusionGaps } from './components/InclusionGaps';
import { PolicySimulator } from './components/PolicySimulator';
import { SidebarAuditPanel } from './components/SidebarAuditPanel';

const dashboardData = rawData as unknown as DashboardData;

const OPCIONES_EDAD: { value: FiltroEdad; label: string }[] = [
  { value: 'TODOS', label: 'Todos (4+ años)' },
  { value: '4-17', label: 'Niñez y Juventud (4–17)' },
  { value: '18-59', label: 'Adultos (18–59)' },
  { value: '60+', label: 'Adultos Mayores (60+)' },
];

const OPCIONES_SEXO: { value: FiltroSexo; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'Hombres', label: 'Hombres' },
  { value: 'Mujeres', label: 'Mujeres' },
];

export function App() {
  const [edadSeleccionada, setEdadSeleccionada] = useState<FiltroEdad>('TODOS');
  const [sexoSeleccionado, setSexoSeleccionado] = useState<FiltroSexo>('TODOS');

  // KPI Poblacional Base (TODOS x TODOS: 3.78% / 642,454 personas >= 4 años)
  const kpiPoblacionalBase = useMemo<CrucePrevalencia>(() => {
    return (
      dashboardData.explorador_prevalencia.find(
        (c) => c.filtro_edad === 'TODOS' && c.filtro_sexo === 'TODOS'
      ) || dashboardData.explorador_prevalencia[0]
    );
  }, []);

  // Registro actual según filtros del Control Maestro
  const registroActual = useMemo<CrucePrevalencia>(() => {
    return (
      dashboardData.explorador_prevalencia.find(
        (c) =>
          c.filtro_edad === edadSeleccionada &&
          c.filtro_sexo === sexoSeleccionado
      ) || kpiPoblacionalBase
    );
  }, [edadSeleccionada, sexoSeleccionado, kpiPoblacionalBase]);

  // Brecha de Analfabetismo para alimentar el Simulador Visual de Impacto
  const brechaAnalfabetismo = useMemo(() => {
    return (
      dashboardData.brechas_inclusion.find((b) => b.id === 'analfabetismo') ||
      dashboardData.brechas_inclusion[0]
    );
  }, []);

  const hayFiltroActivo =
    edadSeleccionada !== 'TODOS' || sexoSeleccionado !== 'TODOS';

  const handleResetFiltros = () => {
    setEdadSeleccionada('TODOS');
    setSexoSeleccionado('TODOS');
  };

  // Función para exportar a CSV los indicadores validados respetando publicable === false
  const handleExportCSV = () => {
    const headers = [
      'Bloque',
      'Indicador',
      'Subpoblacion_Filtro',
      'Valor_Porcentaje',
      'Error_Estandar_SE',
      'CV_Porcentaje',
      'n_Muestral',
      'Poblacion_o_Hogares_Expandidos',
      'Conteo_Condicion_Estimado',
      'Estado_CV_INE',
      'Publicable',
      'Fuente_Oficial',
    ];

    const fuente = 'ENAPROM 2025 - ENAPROM_PERSONAS-3.xlsx';
    const rows: string[][] = [];

    const hSev = dashboardData.kpis_hogar.discapacidad_severa;
    rows.push([
      'KPI Hogar',
      hSev.descripcion,
      `Nacional (${hSev.ratio_texto})`,
      hSev.publicable ? `${hSev.valor.toFixed(2)}%` : 'RESERVADO (CV > 20%)',
      `${hSev.se.toFixed(2)}%`,
      hSev.cv !== null ? `${hSev.cv.toFixed(2)}%` : 'N/A',
      String(hSev.n_muestral),
      String(hSev.poblacion_expandida),
      String(hSev.hogares_con_condicion_est),
      hSev.estado_cv,
      String(hSev.publicable),
      fuente,
    ]);

    const hAlg = dashboardData.kpis_hogar.alguna_dificultad;
    rows.push([
      'KPI Hogar',
      hAlg.descripcion,
      `Nacional (${hAlg.ratio_texto})`,
      hAlg.publicable ? `${hAlg.valor.toFixed(2)}%` : 'RESERVADO (CV > 20%)',
      `${hAlg.se.toFixed(2)}%`,
      hAlg.cv !== null ? `${hAlg.cv.toFixed(2)}%` : 'N/A',
      String(hAlg.n_muestral),
      String(hAlg.poblacion_expandida),
      String(hAlg.hogares_con_condicion_est),
      hAlg.estado_cv,
      String(hAlg.publicable),
      fuente,
    ]);

    const pAct = registroActual.discapacidad_severa;
    rows.push([
      'Filtro Activo',
      'Prevalencia Dificultad Funcional Severa',
      `Edad: ${registroActual.filtro_edad} | Sexo: ${registroActual.filtro_sexo}`,
      pAct.publicable ? `${pAct.valor.toFixed(2)}%` : 'RESERVADO (CV > 20%)',
      `${pAct.se.toFixed(2)}%`,
      pAct.cv !== null ? `${pAct.cv.toFixed(2)}%` : 'N/A',
      String(pAct.n_muestral),
      String(pAct.poblacion_expandida),
      pAct.publicable
        ? String(registroActual.personas_con_disc_severa_est)
        : 'RESERVADO',
      pAct.estado_cv,
      String(pAct.publicable),
      fuente,
    ]);

    dashboardData.dominios_washington_group.forEach((dom) => {
      const g4 = dom.general_4_mas;
      rows.push([
        'Dominios Washington Group',
        `${dom.nombre} (${dom.codigo})`,
        'Poblacion General (>= 4 años)',
        g4.publicable ? `${g4.valor.toFixed(2)}%` : 'RESERVADO (CV > 20%)',
        `${g4.se.toFixed(2)}%`,
        g4.cv !== null ? `${g4.cv.toFixed(2)}%` : 'N/A',
        String(g4.n_muestral),
        String(g4.poblacion_expandida),
        'N/A',
        g4.estado_cv,
        String(g4.publicable),
        fuente,
      ]);

      const g60 = dom.adultos_mayores_60_mas;
      rows.push([
        'Dominios Washington Group',
        `${dom.nombre} (${dom.codigo})`,
        'Adultos Mayores (60+ años)',
        g60.publicable ? `${g60.valor.toFixed(2)}%` : 'RESERVADO (CV > 20%)',
        `${g60.se.toFixed(2)}%`,
        g60.cv !== null ? `${g60.cv.toFixed(2)}%` : 'N/A',
        String(g60.n_muestral),
        String(g60.poblacion_expandida),
        'N/A',
        g60.estado_cv,
        String(g60.publicable),
        fuente,
      ]);
    });

    dashboardData.brechas_inclusion.forEach((b) => {
      const conD = b.con_discapacidad_severa;
      rows.push([
        'Brechas de Inclusion (>=15 años)',
        `${b.indicador} (${b.variable_boleta})`,
        'Con Dificultad Funcional Severa',
        conD.publicable ? `${conD.valor.toFixed(2)}%` : 'RESERVADO (CV > 20%)',
        `${conD.se.toFixed(2)}%`,
        conD.cv !== null ? `${conD.cv.toFixed(2)}%` : 'N/A',
        String(conD.n_muestral),
        String(conD.poblacion_expandida),
        'N/A',
        conD.estado_cv,
        String(conD.publicable),
        fuente,
      ]);

      const sinD = b.sin_discapacidad_severa;
      rows.push([
        'Brechas de Inclusion (>=15 años)',
        `${b.indicador} (${b.variable_boleta})`,
        'Sin Dificultad Funcional Severa',
        sinD.publicable ? `${sinD.valor.toFixed(2)}%` : 'RESERVADO (CV > 20%)',
        `${sinD.se.toFixed(2)}%`,
        sinD.cv !== null ? `${sinD.cv.toFixed(2)}%` : 'N/A',
        String(sinD.n_muestral),
        String(sinD.poblacion_expandida),
        'N/A',
        sinD.estado_cv,
        String(sinD.publicable),
        fuente,
      ]);
    });

    const escapeCsvCell = (cell: string) => `"${cell.replace(/"/g, '""')}"`;

    const csvContent =
      '\uFEFF' +
      [headers.map(escapeCsvCell).join(',')]
        .concat(rows.map((r) => r.map(escapeCsvCell).join(',')))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Indicadores_INE_ENAPROM2025_${edadSeleccionada}_${sexoSeleccionado}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col">
      {/* Encabezado Minimalista Institucional (INE Guatemala) */}
      <header className="bg-[#0F2C59] text-white border-b-4 border-[#00A8E8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex flex-col items-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A8E8]/20 text-[#00A8E8] border border-[#00A8E8]/30 text-xs font-extrabold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                ENAPROM 2025 • Estándar Washington Group
              </span>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                ¿Cómo viven las personas con dificultades funcionales en Guatemala?
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
                Explora de forma visual y sencilla cuántos hogares y personas enfrentan limitaciones severas en su día a día, según las estadísticas oficiales del INE.
              </p>
            </div>

            {/* Logotipo Oficial INE Guatemala */}
            <div className="bg-white px-4 py-2.5 rounded-2xl shadow-md self-start md:self-center shrink-0 border border-slate-100">
              <img
                src="/LogoINE.png"
                alt="Instituto Nacional de Estadística - INE Guatemala"
                className="h-11 sm:h-13 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Barra de Filtros Interactivos (Control Maestro Sticky) */}
      <div className="sticky top-0 z-20 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Selector Grupo de Edad (Pills grandes) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#0F2C59] mr-1">
                <Calendar className="w-3.5 h-3.5 text-[#00A8E8]" />
                Grupo de Edad:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {OPCIONES_EDAD.map((op) => {
                  const activo = edadSeleccionada === op.value;
                  return (
                    <button
                      key={op.value}
                      type="button"
                      onClick={() => setEdadSeleccionada(op.value)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        activo
                          ? 'bg-[#0F2C59] text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-[#00A8E8]'
                      }`}
                    >
                      {op.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selector Sexo (Pills grandes) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#0F2C59] mr-1">
                <Users className="w-3.5 h-3.5 text-[#00A8E8]" />
                Sexo:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {OPCIONES_SEXO.map((op) => {
                  const activo = sexoSeleccionado === op.value;
                  return (
                    <button
                      key={op.value}
                      type="button"
                      onClick={() => setSexoSeleccionado(op.value)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        activo
                          ? 'bg-[#00A8E8] text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-[#00A8E8]'
                      }`}
                    >
                      {op.label}
                    </button>
                  );
                })}

                {hayFiltroActivo && (
                  <button
                    type="button"
                    onClick={handleResetFiltros}
                    title="Restablecer a Todos"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-[#0F2C59] hover:bg-slate-200/60 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal con Mucho Aire y Estructura Ciudadana */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Bloque Central Protagonista: Comparador Dual ("El Dato Técnico vs. En Palabras Simples") */}
        <KpiCards
          kpisHogar={dashboardData.kpis_hogar}
          registroActual={registroActual}
          edadSeleccionada={edadSeleccionada}
          sexoSeleccionado={sexoSeleccionado}
          onResetFiltros={handleResetFiltros}
        />

        {/* Gráfico 1 — Comparativa por Etapas de la Vida */}
        <PrevalenceExplorer
          edadSeleccionada={edadSeleccionada}
          sexoSeleccionado={sexoSeleccionado}
          onChangeEdad={setEdadSeleccionada}
          todosLosCruces={dashboardData.explorador_prevalencia}
        />

        {/* Gráfico 2 — ¿Qué actividades presentan mayor dificultad? (Los 6 Dominios del Washington Group) */}
        <WashingtonDomainsChart
          dominios={dashboardData.dominios_washington_group}
          edadSeleccionada={edadSeleccionada}
        />

        {/* Gráfico 3 — Brechas de Inclusión en la Vida Diaria */}
        <InclusionGaps brechas={dashboardData.brechas_inclusion} />

        {/* Gráfico 4 — Simulador Visual de Impacto ("¿Qué pasa si cerramos la brecha?") */}
        <PolicySimulator
          registroActual={registroActual}
          totalNacionalDiscSevera={
            kpiPoblacionalBase.personas_con_disc_severa_est
          }
          tasaAnalfabetismoConDisc={
            brechaAnalfabetismo.con_discapacidad_severa.valor
          }
          tasaAnalfabetismoSinDisc={
            brechaAnalfabetismo.sin_discapacidad_severa.valor
          }
          poblacion15MasDiscSevera={
            brechaAnalfabetismo.con_discapacidad_severa.poblacion_expandida
          }
        />

        {/* Acordeón Colapsable al Pie de Página: Ficha Metodológica, Definiciones INE, SE/CV y Descarga CSV */}
        <SidebarAuditPanel
          metadata={dashboardData.metadata}
          definiciones={dashboardData.definiciones_oficiales}
          registroActual={registroActual}
          onExportCSV={handleExportCSV}
        />
      </main>

      {/* Pie de Página Limpio */}
      <footer className="bg-white border-t border-slate-200 mt-8 py-5 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/LogoINE.png"
              alt="INE Guatemala"
              className="h-7 w-auto object-contain"
            />
            <div>
              <strong className="text-[#0F2C59]">
                Instituto Nacional de Estadística (INE Guatemala)
              </strong>{' '}
              • {dashboardData.metadata.proyecto}
            </div>
          </div>
          <div className="text-slate-400">
            Datos oficiales ENAPROM 2025 • Tecnologías 100% Open Source (Docker / Cloud WebApp)
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
