# Datatón INE 2026 — Grupo 2: Análisis de Datos
## Tablero Interactivo Oficial: Discapacidad (Washington Group), Hogares y Brechas de Inclusión en Guatemala (ENAPROM 2025)

[![Aplicación en Vivo](https://img.shields.io/badge/Aplicación_en_Producción-dataton.jbconsultor.net-00A8E8?style=for-the-badge)](https://dataton.jbconsultor.net/)
[![Repositorio Oficial](https://img.shields.io/badge/GitHub-JBConsultant%2FDataton__INE__2026-0F2C59?style=for-the-badge)](https://github.com/JBConsultant/Dataton_INE_2026)
[![Rigor Estadístico INE](https://img.shields.io/badge/Guardrail_INE-CV_%E2%89%A4_20.0%25-10B981?style=for-the-badge)](https://dataton.jbconsultor.net/)

---

## 🌐 Enlaces Oficiales de Entrega (Jurado Datatón INE 2026)

* **Aplicación Web Publicada (Producción):** [https://dataton.jbconsultor.net/](https://dataton.jbconsultor.net/) *(Mirror en Azure Static Web Apps: `https://yellow-smoke-089ec480f.8.azurestaticapps.net`)*
* **Repositorio de Código Fuente y Documentación:** [https://github.com/JBConsultant/Dataton_INE_2026](https://github.com/JBConsultant/Dataton_INE_2026)
* **Código Fuente del Dashboard:** [https://github.com/JBConsultant/Dataton_INE_2026/tree/main/Dashboard](https://github.com/JBConsultant/Dataton_INE_2026/tree/main/Dashboard)
* **Presentación Ejecutiva para Exposición ante el Jurado (PDF):** [`docs/Presentacion_Jurado_Dataton_INE_2026.pdf`](https://github.com/JBConsultant/Dataton_INE_2026/blob/main/docs/Presentacion_Jurado_Dataton_INE_2026.pdf)
* **Documento Técnico de Funcionamiento y Tecnologías (PDF):** [`docs/Documento_Tecnico_Funcionamiento_Dashboard_INE_2026.pdf`](https://github.com/JBConsultant/Dataton_INE_2026/blob/main/docs/Documento_Tecnico_Funcionamiento_Dashboard_INE_2026.pdf)
* **Nota Metodológica y de Replicabilidad (PDF):** [`docs/Nota_Metodologica_Dataton_INE_2026.pdf`](https://github.com/JBConsultant/Dataton_INE_2026/blob/main/docs/Nota_Metodologica_Dataton_INE_2026.pdf)

---

## 1. Problema que Resuelve y Usuarios a Quienes Está Dirigida

### Problema que Resuelve
En Guatemala, las estadísticas de discapacidad históricamente han sufrido de **subregistro** cuando se miden bajo un enfoque puramente médico o estigmatizante, además de enfrentarse a dos riesgos analíticos frecuentes al explorar encuestas de hogares:
1. **Invisibilización del impacto en el hogar:** Las cifras suelen reportarse únicamente a nivel individual (`3.78%` de la población ≥ 4 años), ocultando que **el `13.42%` de los hogares guatemaltecos (`551,213 hogares`, o `1 de cada 7.45 hogares`)** convive y asume responsabilidades de cuidado de al menos una persona con dificultad funcional severa.
2. **Publicación de cruces muestrales sin precisión estadística (`CV > 20%`):** Al desagregar microdatos por edad, sexo y variables educativas, ciertos subgrupos presentan tamaños muestrales reducidos cuya varianza invalida la inferencia oficial.

Esta herramienta resuelve ambos desafíos mediante una plataforma analítica interactiva que:
* Implementa el estándar internacional del **Washington Group on Disability Statistics (WG-SS)** capturado en la **ENAPROM 2025**.
* Aplica **linealización de series de Taylor por conglomerados (`NO_HOGAR`)** y factores de expansión (`FACTOR`).
* Incorpora **Guardrails Estadísticos Automatizados del INE**: bloquea y reserva automáticamente cualquier estimación cuyo Coeficiente de Variación supere el umbral oficial (`CV > 20%`), advirtiendo con semáforo amarillo cuando se encuentra en rango de precaución (`15% < CV ≤ 20%`).

### Usuarios a Quienes Está Dirigida
1. **Tomadores de Decisión y Formuladores de Política Pública (CONADI, MINEDUC, MIDES, MSPAS, SEGEPLAN):** Para dimensionar brechas críticas (como la tasa de analfabetismo del `41.52%` en personas ≥ 15 años con dificultad severa frente a `13.81%` sin dificultad severa) y simular metas de focalización presupuestaria.
2. **Técnicos, Estadísticos y Auditores del INE:** Para auditar en tiempo real el tamaño de muestra (`n_muestral`), Error Estándar (`SE`), Coeficiente de Variación (`CV %`) y dictamen de publicabilidad de cada cruce demográfico.
3. **Investigadores Sociales, Academia, Periodistas de Datos y Ciudadanía:** Para consultar y exportar en formato CSV indicadores validados con explicaciones conceptuales claras sobre qué es un hogar censal/muestral y cómo funciona la escala funcional del Washington Group.

---

## 2. Arquitectura General y Tecnologías Empleadas

La solución sigue una arquitectura desacoplada de **Dos Capas Auditables (Data Pipeline Offline + SPA Frontend Tipada)** desplegada sobre infraestructura serverless en la nube:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ CAPA 1: PIPELINE ESTADÍSTICO Y AUDITORÍA DE MICRODATOS (Python)              │
│ Fuente única: ENAPROM_PERSONAS-3.xlsx (n = 20,531 personas ≥4a / 5,124 hog.) │
│   └── generar_json_dashboard.py                                              │
│        ├── Estimador de razón ponderada por FACTOR                           │
│        ├── Linealización de Taylor por conglomerado (UPM = NO_HOGAR)         │
│        ├── Clasificación de Semáforo INE (CONFIABLE ≤15%, PRECAUCION ≤20%)   │
│        └── Exportación inmutable: src/data/datos_dashboard.json              │
└───────────────────────────────────────┬──────────────────────────────────────┘
                                        │ JSON Validado y Tipado
                                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ CAPA 2: APLICACIÓN WEB INTERACTIVA (React 18 + TypeScript + Tailwind CSS)    │
│   ├── Columna Principal (70%):                                               │
│   │    ├── KpiCards.tsx (Hogar 13.42% [CV 4.09%] | Persona 3.78% [CV 4.37%]) │
│   │    ├── PrevalenceExplorer.tsx (12 cruces Edad×Sexo + Guardrail CV > 20%) │
│   │    ├── WashingtonDomainsChart.tsx (6 Dominios WG: General vs 60+ años)   │
│   │    ├── InclusionGaps.tsx (Analfabetismo 41.52% vs 13.81% + Guardrail)    │
│   │    └── PolicySimulator.tsx (Slider 10%-50% sobre 642,454 personas)       │
│   ├── Columna Lateral Fija (30%):                                            │
│   │    └── SidebarAuditPanel.tsx (Definiciones INE/WG + Auditoría Live)      │
│   └── Exportador CSV UTF-8 BOM con reserva automática de celdas no válidas   │
└───────────────────────────────────────┬──────────────────────────────────────┘
                                        │ Build Estático Optimizado (Vite)
                                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ CAPA 3: NUBE Y DISTRIBUCIÓN CDN (Azure Static Web Apps — East US 2)          │
│   └── Dominio Oficial: https://dataton.jbconsultor.net/                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Listado Completo de Tecnologías y Dependencias

#### A. Procesamiento Estadístico (Backend / Pipeline de Datos)
* **Python `>= 3.10`**
* **`pandas >= 2.0.0`** y **`openpyxl >= 3.1.0`**: Lectura e integridad de microdatos oficiales en Excel (`ENAPROM_PERSONAS-3.xlsx`).
* **`numpy >= 1.24.0`**: Cálculo matricial del estimador de proporción ponderada ($\hat{R}$), varianza por conglomerados mediante linealización de Taylor, Error Estándar ($SE$) y Coeficiente de Variación ($CV$).

#### B. Aplicación Web Frontend (`Dashboard/package.json`)
* **React `^18.3.1`** y **React DOM `^18.3.1`**: Librería declarativa de interfaz de usuario basada en componentes modulares y hooks (`useState`, `useMemo`).
* **TypeScript `~5.6.2`**: Tipado estático estricto (`src/types/dashboard.ts`) que garantiza la integridad del contrato de datos con el JSON validado.
* **Vite `^5.4.10`** y **`@vitejs/plugin-react ^4.3.3`**: Empaquetador de última generación para desarrollo instantáneo (HMR) y compilación optimizada para producción.
* **Tailwind CSS `^3.4.15`**, **PostCSS `^8.4.49`** y **Autoprefixer `^10.4.20`**: Sistema de diseño utilitario configurado con la identidad visual institucional del INE (`#0F2C59` azul oscuro institucional, `#00A8E8` azul radiante, `#F8FAFC` fondo neutro y fuente `Ubuntu Sans`).
* **Lucide React `^0.460.0`**: Iconografía vectorial accesible para semáforos estadísticos y dominios funcionales.
* **Azure Static Web Apps (`swa-cli 2.0.7` / `az-cli 2.82.0`)**: Hospedaje serverless con certificado SSL y reglas de enrutamiento en `staticwebapp.config.json`.

---

## 3. Reproducibilidad: Instrucciones de Instalación, Compilación y Ejecución

Cualquier miembro del jurado puede ejecutar, auditar y compilar la herramienta localmente en menos de 2 minutos siguiendo estos pasos:

### Requisitos Previos
* **Node.js** `>= 18.0.0` (incluye `npm >= 9.0.0`).
* *(Opcional, solo para regenerar el JSON desde los microdatos crudos)*: **Python** `>= 3.10` con `pandas`, `numpy` y `openpyxl`.

### Paso 1: Clonar el Repositorio Oficial
```bash
git clone https://github.com/JBConsultant/Dataton_INE_2026.git
cd Dataton_INE_2026/Dashboard
```

### Paso 2: Instalar las Dependencias del Proyecto
```bash
npm install
```

### Paso 3: Ejecutar en Modo Desarrollo Local
```bash
npm run dev
```
> La aplicación se abrirá en `http://localhost:5173`.

### Paso 4: Verificar Compilación de Producción (Type-Check + Build)
```bash
npm run build
npm run preview
```
> El comando `npm run build` ejecuta primero `tsc -b` (verificación estricta de tipos de TypeScript sin errores) y posteriormente `vite build`, generando la carpeta `dist/` lista para producción.

### Paso 5 (Opcional): Re-ejecutar el Motor Estadístico de Taylor en Python
Si el jurado desea regenerar el archivo `src/data/datos_dashboard.json` desde la base de microdatos `ENAPROM_PERSONAS-3.xlsx`:
```bash
pip install pandas numpy openpyxl
python generar_json_dashboard.py
```

---

## 4. Guía de Uso de la Herramienta

1. **Tarjetas KPI Superiores:** Al ingresar a [https://dataton.jbconsultor.net/](https://dataton.jbconsultor.net/), revise en la parte superior la comparación entre la prevalencia a nivel de **Hogar (`13.42%` / `551,213 hogares` / `"1 de cada 7.45 hogares"`, `CV = 4.09%`)** y a nivel **Poblacional (`3.78%` / `642,454 personas ≥ 4 años`, `CV = 4.37%`)**.
2. **Explorador Interactivo y Prueba del Guardrail INE (`CV > 20%`):**
   * Seleccione distintos botones de **Grupo de Edad** (`TODOS`, `4-17`, `18-59`, `60+`) y **Sexo** (`TODOS`, `Hombres`, `Mujeres`), o haga clic en cualquiera de las 12 celdas del *Mapa Rápido de Precisión Estadística*.
   * **Caso de Precaución (`15% < CV ≤ 20%`):** Seleccione `4-17 años` + `Hombres` (`1.14%`, `CV = 18.39%`). Observará el badge amarillo de advertencia metodológica.
   * **Caso No Publicable (`CV > 20%`):** Seleccione `4-17 años` + `Mujeres` (`CV = 20.34%`). El sistema **oculta automáticamente el porcentaje** y despliega la tarjeta roja de reserva estadística oficial del INE.
3. **Gráfico Comparativo de los 6 Dominios del Washington Group:** Alterne entre **Población General (≥ 4 años)**, **Adultos Mayores (60+ años)** y **Vista Comparativa** para analizar las limitaciones en *Caminar (`P02A11C`)*, *Ver (`P02A11A`)*, *Recordar (`P02A11D`)*, *Oír (`P02A11B`)*, *Comunicarse (`P02A11F`)* y *Cuidado personal (`P02A11E`)*.
4. **Comparativa de Brechas de Inclusión (≥ 15 años):** Contraste la brecha de **Analfabetismo (`41.52%` vs `13.81%`)** y verifique cómo el indicador de **Asistencia Educativa** activa automáticamente el bloqueo estadístico en el subgrupo con discapacidad severa (`CV = 20.24% > 20%`).
5. **Simulador de Políticas Públicas:** Deslice el control entre **10% y 50%** para calcular en tiempo real cuántas personas con dificultades funcionales severas serían alfabetizadas según la meta seleccionada.
6. **Panel Lateral de Trazabilidad y Exportación CSV:** Consulte a la derecha las definiciones oficiales del INE y la ficha técnica en vivo (`n_muestral`, `SE`, `CV %`), o presione **"Exportar Indicadores (CSV)"** arriba a la derecha para descargar la tabla auditada.

---

## 5. Conjuntos de Datos Utilizados

Para garantizar **cero errores de fusión entre encuestas con diseños muestrales independientes**, el dashboard consume exclusivamente estimaciones derivadas de **una única base oficial de microdatos del INE**:

| Fuente Oficial | Archivo / Hoja | Cobertura y Tamaño Muestral | Variables Clave Utilizadas |
| :--- | :--- | :--- | :--- |
| **ENAPROM 2025** (Encuesta Nacional de Propósitos Múltiples — INE Guatemala) | `ENAPROM_PERSONAS-3.xlsx` (Hoja `ENAPROM_PERSONAS 3`) | **Cobertura Nacional** <br>• Total hogares: `n = 5,124` (`N = 4,107,011` hogares expandidos)<br>• Personas ≥ 4 años: `n = 20,531` (`N = 16,974,815` expandidos)<br>• Personas ≥ 15 años: `n = 15,429` (`N = 12,669,240` expandidos)<br>• Módulo P05B: `n = 879` (`N = 642,454` expandidos) | • **Identificadores y Diseño Muestral:** `NO_HOGAR` (Conglomerado/Hogar), `CP` (Código de persona), `FACTOR` (Factor de expansión).<br>• **Demográficas:** `P02A02` (Sexo), `P02A03` (Edad en años cumplidos).<br>• **6 Dominios Washington Group (≥ 4 años):** `P02A11A` (Ver), `P02A11B` (Oír), `P02A11C` (Caminar/subir escaleras), `P02A11D` (Recordar/concentrarse), `P02A11E` (Cuidado personal/vestirse), `P02A11F` (Comunicarse).<br>• **Educación (≥ 15 años):** `P02A13` (Sabe leer y escribir), `P02A15` (Asistencia educativa actual).<br>• **Módulo Especializado:** `DISCAPACIDAD`, `P05B01A`–`P05B05`. |

---

## 6. Limitaciones y Posibles Mejoras

### Limitaciones Actuales
1. **Tamaños muestrales reducidos en subgrupos altamente específicos:** Al tratarse de un fenómeno con prevalencia nacional del `3.78%`, las intersecciones de baja prevalencia (como *mujeres de 4 a 17 años con dificultad severa*, `n = 3,163`, `CV = 20.34%`, o *asistencia escolar en personas ≥ 15 años con dificultad severa*, `n = 818`, `CV = 20.24%`) superan el límite del 20% de CV y deben reservarse.
2. **Corte transversal:** La ENAPROM 2025 ofrece una fotografía transversal; no permite seguir trayectorias longitudinales de pérdida funcional o transición educativa de un mismo individuo en el tiempo.
3. **Exclusión de menores de 4 años en WG-SS:** Por estándar internacional del Washington Group Short Set, los dominios funcionales `P02A11A–F` se evalúan a partir de los 4 años de edad, ya que en edades de 0 a 3 años los hitos del desarrollo infantil requieren el módulo extendido *Child Functioning Module (CFM)*.

### Posibles Mejoras Futuras
1. **Modelos de Estimación en Áreas Pequeñas (SAE / Fay-Herriot):** Integrar técnicas bayesiano-empíricas combinando la ENAPROM con el Censo Nacional de Población y Vivienda para lograr desagregaciones departamentales y municipales con `CV ≤ 15%`.
2. **Integración de Intervalos de Confianza al 95% (`IC 95%`) y Efecto de Diseño (`DEFF`):** Mostrar visualmente las barras de error ($\hat{R} \pm 1.96 \cdot SE$) sobre las gráficas de dominios funcionales.
3. **Módulo de Costeo Presupuestario en el Simulador:** Conectar el simulador de alfabetización con costos unitarios reales de CONALFA y MINEDUC para estimar la inversión pública requerida por cada punto porcentual de reducción de brecha.

---

## 7. Declaración de Uso de Inteligencia Artificial (Transparencia Ética)

En cumplimiento de las bases y principios de transparencia del **Datatón INE 2026**, el equipo declara de manera explícita el uso de herramientas de Inteligencia Artificial Generativa como **asistente de productividad e ingeniería de software**, bajo estricta supervisión y validación humana:

* **Herramienta utilizada:** Asistente de codificación basado en modelos de lenguaje de gran escala (LLM — Google Gemini / Antigravity IDE).
* **Alcance del uso de IA:**
  1. **Estructuración de código Frontend:** Generación de plantillas de componentes modulares en React + TypeScript + Tailwind CSS (`src/components/`) siguiendo la paleta institucional del INE definida por el equipo.
  2. **Automatización de pruebas de compilación y despliegue:** Asistencia en la configuración de `tsconfig.json`, `vite.config.ts`, `staticwebapp.config.json` y comandos de despliegue en Azure Static Web Apps.
  3. **Estandarización documental:** Apoyo en la maquetación y formato Markdown/HTML de la documentación técnica.
* **Garantía de Integridad Estadística (Cero Alucinación de Datos):**
  * **Ningún dato, porcentaje, conteo poblacional, error estándar o coeficiente de variación fue generado ni estimado por un modelo de IA.**
  * La totalidad de las cifras (`13.42%`, `3.78%`, `551,213 hogares`, `642,454 personas`, `CV`, `SE` y `n_muestral`) proviene **exclusivamente** de la ejecución determinista del script matemático en Python (`generar_json_dashboard.py`) sobre los microdatos oficiales del INE (`ENAPROM_PERSONAS-3.xlsx`), auditado contra la boleta oficial de la encuesta.
