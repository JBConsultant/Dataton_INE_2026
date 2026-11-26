export type EstadoCV = 'CONFIABLE' | 'PRECAUCION' | 'NO_PUBLICABLE';

export interface MetricaEstadistica {
  valor: number;
  se: number;
  cv: number | null;
  n_muestral: number;
  poblacion_expandida: number;
  estado_cv: EstadoCV;
  publicable: boolean;
}

export interface CrucePrevalencia {
  filtro_edad: 'TODOS' | '4-17' | '18-59' | '60+';
  filtro_sexo: 'TODOS' | 'Hombres' | 'Mujeres';
  discapacidad_severa: MetricaEstadistica;
  alguna_dificultad: MetricaEstadistica | null;
  personas_con_disc_severa_est: number;
}

export interface DominioWG {
  codigo: string;
  id: string;
  nombre: string;
  general_4_mas: MetricaEstadistica;
  adultos_mayores_60_mas: MetricaEstadistica;
}

export interface BrechaInclusion {
  id: 'analfabetismo' | 'asistencia_educativa';
  indicador: string;
  variable_boleta: string;
  fuente: string;
  con_discapacidad_severa: MetricaEstadistica;
  sin_discapacidad_severa: MetricaEstadistica;
}

export interface CategoriaP05B {
  codigo: number;
  metrica: MetricaEstadistica;
}

export interface DefinicionesOficiales {
  hogar: {
    titulo: string;
    definicion_ine: string;
    metodo_calculo: string;
  };
  washington_group: {
    titulo: string;
    definicion_wg: string;
    criterio_estadistico: string;
  };
}

export interface DashboardData {
  metadata: {
    proyecto: string;
    tema: string;
    universo_geografico: string;
    umbral_cv_maximo: number;
    fecha_generacion: string;
    fuentes: string[];
    nota_metodologica: string;
  };
  definiciones_oficiales?: DefinicionesOficiales;
  kpis_hogar: {
    discapacidad_severa: MetricaEstadistica & {
      hogares_con_condicion_est: number;
      ratio_texto: string;
      descripcion: string;
    };
    alguna_dificultad: MetricaEstadistica & {
      hogares_con_condicion_est: number;
      ratio_texto: string;
      descripcion: string;
    };
  };
  explorador_prevalencia: CrucePrevalencia[];
  dominios_washington_group: DominioWG[];
  brechas_inclusion: BrechaInclusion[];
  modulo_especializado_p05b: {
    n_muestral: number;
    poblacion_expandida: number;
    nota: string;
    variables: Record<string, CategoriaP05B[]>;
  };
}