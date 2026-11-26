import { useState, useMemo } from 'react';
import {
  Download,
  ShieldCheck,
  MapPin,
  Calendar,
  FileCheck2,
} from 'lucide-react';
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

  // Registro actual según filtros del Explorador Interactivo
  const registroActual = useMemo<CrucePrevalencia>(() => {
    return (
      dashboardData.explorador_prevalencia.find(
        (c) =>
          c.filtro_edad === edadSeleccionada &&
          c.filtro_sexo === sexoSeleccionado
      ) || kpiPoblacionalBase
    );
  }, [edadSeleccionada, sexoSeleccionado, kpiPoblacionalBase]);

  // Brecha de Analfabetismo para alimentar el Simulador de Políticas Públicas
  const brechaAnalfabetismo = useMemo(() => {
    return (
      dashboardData.brechas_inclusion.find((b) => b.id === 'analfabetismo') ||
      dashboardData.brechas_inclusion[0]
    );
  }, []);

  // Función para exportar a CSV los indicadores visibles respetando el guardrail publicable === false
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

    // 1. KPIs Superiores de Hogar
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

    // 2. KPI Poblacional Nacional y Filtro Activo en Explorador
    const pBase = kpiPoblacionalBase.discapacidad_severa;
    rows.push([
      'KPI Poblacional (>=4 años)',
      'Prevalencia Nacional Dificultad Funcional Severa',
      'Edad: TODOS | Sexo: TODOS',
      pBase.publicable ? `${pBase.valor.toFixed(2)}%` : 'RESERVADO (CV > 20%)',
      `${pBase.se.toFixed(2)}%`,
      pBase.cv !== null ? `${pBase.cv.toFixed(2)}%` : 'N/A',
      String(pBase.n_muestral),
      String(pBase.poblacion_expandida),
      String(kpiPoblacionalBase.personas_con_disc_severa_est),
      pBase.estado_cv,
      String(pBase.publicable),
      fuente,
    ]);

    // Registro del Filtro Seleccionado Actualmente
    const pAct = registroActual.discapacidad_severa;
    rows.push([
      'Explorador Interactivo (Filtro Activo)',
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

    // 3. Dominios Funcionales del Washington Group (General >=4 y Adultos Mayores 60+)
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

    // 4. Brechas de Inclusión (>= 15 años)
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

    const escapeCsvCell = (cell: string) =>
      `"${cell.replace(/"/g, '""')}"`;

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
      {/* Encabezado Institucional Superior INE (#0F2C59) */}
      <header className="bg-[#0F2C59] text-white border-b-4 border-[#00A8E8] shadow-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#00A8E8] text-[#0F2C59] text-xs font-extrabold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {dashboardData.metadata.proyecto}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#00A8E8]" />
                  {dashboardData.metadata.universo_geografico}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {dashboardData.metadata.tema}
              </h1>
              <p className="text-xs text-slate-300 max-w-3xl">
                {dashboardData.metadata.nota_metodologica}
              </p>
            </div>

            {/* Botón de Exportación CSV y Metadatos */}
            <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
              <div className="hidden xl:flex flex-col items-end text-[11px] text-slate-300 font-mono">
                <span className="flex items-center gap-1">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#00A8E8]" />
                  Regla INE: CV ≤ {dashboardData.metadata.umbral_cv_maximo.toFixed(1)}%
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3 h-3" />
                  Corte: {dashboardData.metadata.fecha_generacion}
                </span>
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#00A8E8] hover:bg-[#0095ce] text-[#0F2C59] font-extrabold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Exportar Indicadores (CSV)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Layout Principal de 2 Columnas (70% Principal + 30% Panel Lateral Fijo) */}
      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Columna Principal (70%) */}
          <div className="w-full lg:w-[70%] space-y-6">
            {/* a) Tarjetas KPI Superiores */}
            <KpiCards
              kpisHogar={dashboardData.kpis_hogar}
              kpiPoblacional={kpiPoblacionalBase}
            />

            {/* b) Explorador Interactivo con Guardrails de CV */}
            <PrevalenceExplorer
              edadSeleccionada={edadSeleccionada}
              sexoSeleccionado={sexoSeleccionado}
              onChangeEdad={setEdadSeleccionada}
              onChangeSexo={setSexoSeleccionado}
              registroActual={registroActual}
              todosLosCruces={dashboardData.explorador_prevalencia}
            />

            {/* c) Gráfico de Barras Comparativo de los 6 Dominios Funcionales WG */}
            <WashingtonDomainsChart
              dominios={dashboardData.dominios_washington_group}
            />

            {/* d) Comparativa de Brechas de Inclusión */}
            <InclusionGaps brechas={dashboardData.brechas_inclusion} />

            {/* e) Simulador de Políticas Públicas */}
            <PolicySimulator
              totalPersonasDiscSevera={
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
          </div>

          {/* Columna Lateral Fija (30% - "Marco Conceptual y Trazabilidad INE") */}
          <div className="w-full lg:w-[30%]">
            <SidebarAuditPanel
              metadata={dashboardData.metadata}
              definiciones={dashboardData.definiciones_oficiales}
              registroActual={registroActual}
            />
          </div>
        </div>
      </main>

      {/* Pie de Página Institucional */}
      <footer className="bg-white border-t border-slate-200 mt-10 py-4 text-xs text-slate-500">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-[#0F2C59]">
              Instituto Nacional de Estadística (INE Guatemala)
            </strong>{' '}
            — {dashboardData.metadata.proyecto}
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            Fuente única: {dashboardData.metadata.fuentes[0]} | Linealización de Taylor por UPM (NO_HOGAR)
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
