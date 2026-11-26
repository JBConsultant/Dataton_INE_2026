# Datatón INE 2026 — Grupo 2: Análisis de Datos
## Tablero Ciudadano e Interactivo Oficial: *¿Cómo viven las personas con dificultades funcionales en Guatemala?* (ENAPROM 2025)

<p align="left">
  <img src="Dashboard/public/LogoINE.png" alt="Instituto Nacional de Estadística - INE Guatemala" height="64" />
</p>

[![Aplicación en Vivo](https://img.shields.io/badge/Aplicación_en_Producción-dataton.jbconsultor.net-00A8E8?style=for-the-badge)](https://dataton.jbconsultor.net/)
[![Repositorio Oficial](https://img.shields.io/badge/GitHub-JBConsultant%2FDataton__INE__2026-0F2C59?style=for-the-badge)](https://github.com/JBConsultant/Dataton_INE_2026)
[![100% Open Source](https://img.shields.io/badge/Tecnologías_100%25_Libres-Docker_%7C_Cloud_WebApp-10B981?style=for-the-badge)](https://dataton.jbconsultor.net/)

---

## 🌐 Enlaces Oficiales de Entrega (Jurado Datatón INE 2026)

* **Aplicación Web Publicada (Producción Cloud WebApp):** [https://dataton.jbconsultor.net/](https://dataton.jbconsultor.net/) *(Mirror en Azure Static Web Apps: `https://yellow-smoke-089ec480f.8.azurestaticapps.net`)*
* **Repositorio de Código Fuente y Documentación:** [https://github.com/JBConsultant/Dataton_INE_2026](https://github.com/JBConsultant/Dataton_INE_2026)
* **Código Fuente del Dashboard:** [https://github.com/JBConsultant/Dataton_INE_2026/tree/main/Dashboard](https://github.com/JBConsultant/Dataton_INE_2026/tree/main/Dashboard)
* **Presentación Ejecutiva para Exposición ante el Jurado (PDF):** [`Presentacion_Jurado_Dataton_INE_2026.pdf`](docs/Presentacion_Jurado_Dataton_INE_2026.pdf)
* **Manual Técnico de Funcionamiento, Arquitectura Open Source y Despliegue (PDF):** [`2-Documento_Tecnico_Funcionamiento_Dashboard_INE_2026.pdf`](docs/Documento_Tecnico_Funcionamiento_Dashboard_INE_2026.pdf)

---

## 1. Problema que Resuelve y Enfoque de Comprensión Ciudadana

### Problema que Resuelve
En Guatemala, la difusión de estadísticas de discapacidad suele enfrentar tres barreras principales:
1. **Sobrecarga técnica para el ciudadano común:** Los tabulados tradicionales presentan términos estadísticos complejos sin traducir qué significan en la vida cotidiana de una comunidad o familia.
2. **Invisibilización del impacto en el hogar:** Las cifras suelen reportarse únicamente a nivel individual (`3.78%` en población de 4+ años, o `3.9%` en población de 5+ años según el *Boletín Estadístico de Discapacidad ENAPROM 2025*), ocultando que **el `13.42%` de los hogares guatemaltecos (`551,213 hogares`, es decir, `1 de cada 7 hogares`)** integra y cuida al menos a una persona con dificultad funcional severa.
3. **Publicación de cruces muestrales sin precisión estadística (`CV > 20%`):** Al cruzar edad, sexo y educación, ciertos subgrupos tienen muestras pequeñas cuya varianza invalida la inferencia oficial.

### Solución: Visualización Ciudadana + Rigor Estadístico INE
Rediseñamos la experiencia bajo un paradigma de **Visualización de Datos Ciudadanos**:
* **Comparador Dual Protagonista ("En Porcentajes vs. En Palabras Simples"):** Traduce automáticamente cada porcentaje oficial (`13.42%` en hogares o `19.00%` en adultos mayores) a su proporción humana (**"1 de cada 7 hogares"**, **"1 de cada 5 adultos mayores"**) acompañada de un **gráfico de anillo (Donut Chart)** y un **pictograma dinámico de casas o siluetas** donde 1 ícono se ilumina en Azul Radiante (`#00A8E8`).
* **Guardrail Estadístico Silencioso y Amigable:** Cuando el usuario selecciona un cruce con `CV > 20%` (ej. `Niñez y Juventud 4–17` + `Mujeres`, `CV = 20.34%`), el sistema oculta los números de ese segmento y muestra una tarjeta amigable explicando por qué el INE resguarda la precisión muestral, invitando con un clic a volver a `'Todos'`.
* **Cero Saturación en Pantalla:** Se eliminan tablas densas y fórmulas de la vista principal, dejando únicamente píldoras discretas de calidad (`"Dato confiable • INE"` o `"Precaución muestral"`) y concentrando la ficha técnica (`n`, `SE`, `CV`, definiciones oficiales y descarga CSV) en un **acordeón colapsable al pie de página**.

---

## 2. Soberanía Tecnológica: 100% Software de Uso Libre y Agnóstico de Servidor

Una fortaleza central del proyecto para el **Instituto Nacional de Estadística (INE)** es que fue construido **100% con tecnologías de uso libre (Open Source / licencias MIT, PSF y BSD)**, garantizando **cero costos de licenciamiento propietario** y **total independencia de proveedor o servidor (*Zero Vendor Lock-in*)**:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ CAPA 1: MOTOR ESTADÍSTICO OPEN SOURCE (Python 3 + Pandas + NumPy)            │
│ Fuente oficial: ENAPROM 2025 — Base Nacional (ENAPROM_PERSONAS-3.xlsx)       │
│   └── generar_json_dashboard.py                                              │
│        ├── Ponderación por FACTOR y Linealización de Taylor (UPM = NO_HOGAR) │
│        ├── Semáforo INE (CONFIABLE ≤15%, PRECAUCION ≤20%, NO_PUBLICABLE >20%)│
│        └── Emisión de contrato JSON estático: src/data/datos_dashboard.json  │
└───────────────────────────────────────┬──────────────────────────────────────┘
                                        │ JSON Validado (Sin requerir BD cara)
                                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ CAPA 2: INTERFAZ CIUDADANA REACTIVA (React 18 + TypeScript + Tailwind CSS)   │
│   ├── Encabezado Institucional con LogoINE.png + Barra Maestra Sticky        │
│   ├── KpiCards.tsx: Comparador Dual (% + Donut SVG vs "1 de cada X" + Íconos)│
│   ├── PrevalenceExplorer.tsx: Gráfico 1 — Comparativa por Etapas de la Vida  │
│   ├── WashingtonDomainsChart.tsx: Gráfico 2 — Los 6 Dominios WG (4+ vs 60+)  │
│   ├── InclusionGaps.tsx: Gráfico 3 — Brechas en la Vida Diaria (4 de cada 10)│
│   ├── PolicySimulator.tsx: Gráfico 4 — Simulador Visual con Barra Apilada    │
│   └── SidebarAuditPanel.tsx: Acordeón Metodológico Colapsable + Export CSV   │
└───────────────────────────────────────┬──────────────────────────────────────┘
                                        │ Bundle Estático Universal (dist/)
                                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ CAPA 3: DESPLIEGUE PORTABLE Y AGNÓSTICO DE SERVIDOR                          │
│   ├── Opción A (Actual en Producción): Cloud WebApp / Azure Static Web Apps  │
│   │    └── https://dataton.jbconsultor.net/                                  │
│   ├── Opción B (Contenedores en la Nube o Local): Docker + NGINX Alpine      │
│   │    └── Dockerfile incluido (AWS ECS, Google Cloud Run, Azure Containers) │
│   └── Opción C (Infraestructura Propia INE): Cualquier servidor Apache/IIS   │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Modalidades de Alojamiento (Portabilidad Total)
Al compilarse en un paquete estático estándar (`HTML5 + CSS3 + JS`) alimentado por el archivo precalculado `datos_dashboard.json`, la aplicación **no depende de estar alojada en un servidor específico**:
1. **Cloud WebApp (Alojamiento Actual en Producción):** Publicado actualmente como WebApp en la nube con distribución CDN global y SSL automático en [https://dataton.jbconsultor.net/](https://dataton.jbconsultor.net/).
2. **Contenedores Docker en la Nube o Datacenter del INE (`Dockerfile` incluido):** Incluye un `Dockerfile` multi-etapa basado en `node:20-alpine` y `nginx:stable-alpine` que permite desplegar el tablero en segundos dentro de cualquier clúster Docker, Kubernetes, Google Cloud Run, AWS ECS, Azure Container Apps o servidores Linux on-premise del INE.
3. **Servidor Web Institucional Estándar:** La carpeta `dist/` generada por `npm run build` puede copiarse directamente a cualquier servidor institucional existente (NGINX, Apache, IIS) sin instalar motores de bases de datos ni pagar licencias de BI propietario.

---

## 3. Reproducibilidad: Ejecución Local y con Docker

### Opción A: Ejecución Estándar con Node.js (2 Minutos)
```bash
# 1. Clonar el repositorio oficial y entrar a la carpeta Dashboard
git clone https://github.com/JBConsultant/Dataton_INE_2026.git
cd Dataton_INE_2026/Dashboard

# 2. Instalar dependencias libres (React, TypeScript, Tailwind CSS, Lucide)
npm install

# 3. Iniciar servidor de desarrollo interactivo
npm run dev       # Disponible en http://localhost:5173

# 4. Compilar versión optimizada de producción
npm run build     # Verifica tipos (tsc -b) y empaqueta en dist/
```

### Opción B: Ejecución en Contenedor Docker (Cloud / On-Premise)
```bash
cd Dataton_INE_2026/Dashboard
docker build -t tablero-ine-enaprom2025 .
docker run -d -p 8080:80 tablero-ine-enaprom2025
# Disponible inmediatamente en http://localhost:8080
```

### Opción C: Re-ejecución del Motor Estadístico en Python
```bash
pip install pandas numpy openpyxl
python generar_json_dashboard.py
```

---

## 4. Guía de Recorrido por la Nueva Interfaz Ciudadana

1. **Encabezado Minimalista y Control Maestro (Barra de Filtros Sticky):**
   * Incluye el título ciudadano *"¿Cómo viven las personas con dificultades funcionales en Guatemala?"*, el logotipo oficial del INE (`LogoINE.png`) y selectores tipo *pill* para **Grupo de Edad** (`Todos (4+ años)`, `Niñez y Juventud (4–17)`, `Adultos (18–59)`, `Adultos Mayores (60+)`) y **Sexo** (`Todos`, `Hombres`, `Mujeres`).
   * Al cambiar cualquier filtro, **todos los bloques y gráficos de la pantalla se actualizan dinámicamente**.
2. **Bloque Central Protagonista — Comparador Dual:**
   * **Tarjeta Izquierda ("En Porcentajes - Dato Oficial"):** Muestra el porcentaje exacto en tipografía gigante (`13.42%` en hogares o `3.78%` en personas), un **Donut Chart SVG** y el total expandido (`551,213 hogares` / `642,454 personas`). Permite alternar con un clic entre *En los Hogares* y *En las Personas*.
   * **Tarjeta Derecha ("En Palabras Simples - 1 de cada X"):** Muestra en gigante **"1 de cada 7 hogares"** (o **"1 de cada 5 adultos mayores"**) junto a un **pictograma dinámico** de casas o siluetas donde 1 ícono resalta en Azul Radiante (`#00A8E8`).
   * **Guardrail Estadístico Silencioso:** Si se elige `Niñez y Juventud (4–17)` + `Mujeres` (`CV = 20.34% > 20%`), oculta los números y muestra una tarjeta amigable explicando el criterio de rigor muestral del INE.
3. **Gráfico 1 — Comparativa por Etapas de la Vida:**
   * Barras interactivas que contrastan `4–17 años (1.15%)`, `18–59 años (2.89%)` y `60+ años (19.00%)` filtradas por el Sexo elegido, iluminando la barra del grupo de edad activo.
4. **Gráfico 2 — ¿Qué actividades presentan mayor dificultad? (6 Dominios WG):**
   * Barras horizontales con íconos intuitivos para *Caminar/subir escaleras, Ver, Recordar/concentrarse, Oír, Comunicarse y Cuidado personal*, con switch entre `Población General (4+)` y `Adultos Mayores (60+)` y etiqueta `"1 de cada X"`.
5. **Gráfico 3 — Brechas de Inclusión en la Vida Diaria:**
   * Contrasta personas *Con dificultades severas* vs. *Sin dificultades severas* en analfabetismo (`41.52%` vs `13.81%` — *"4 de cada 10 personas vs. 1 de cada 7 personas"*), respetando `publicable: false` en asistencia educativa (`CV = 20.24%`).
6. **Gráfico 4 — Simulador Visual de Impacto ("¿Qué pasa si cerramos la brecha?"):**
   * Slider de `10%` a `50%` con **barra apilada interactiva** que traduce la meta en personas reales que mejorarían su acceso a lectura, escritura e inclusión.
7. **Acordeón Colapsable al Pie de Página (*"Ver ficha metodológica y definiciones del INE"*):**
   * Mantiene la pantalla principal limpia de tecnicismos y despliega bajo demanda las definiciones oficiales (*Hogar* y *Washington Group*), los indicadores muestrales (`n`, `SE`, `CV`, `N`) y el botón de descarga CSV.

---

## 5. Conjuntos de Datos y Alineación con Documentos Oficiales (`Data/`)

El proyecto se fundamenta en los documentos y bases oficiales depositados en la carpeta `Data/`:

| Documento / Archivo en `Data/` | Rol y Alineación en el Proyecto |
| :--- | :--- |
| **`ENAPROM_PERSONAS-3.xlsx`** (Hoja `ENAPROM_PERSONAS 3`) | **Base Primaria Nacional de Microdatos (Fuente Única del JSON):** `n = 5,124` hogares (`N = 4,107,011` expandidos) y `n = 20,531` personas ≥ 4 años (`N = 16,974,815` expandidas). Variables `NO_HOGAR`, `CP`, `FACTOR`, `P02A02`, `P02A03`, `P02A11A–F`, `P02A13`, `P02A15` y `P05B01A–P05B05`. |
| **`ENAPROM-Boletin-Discapacidad-RGB.pdf`** *(Boletín Estadístico de Discapacidad — ENAPROM 2025, INE)* | **Referencia Oficial de Validación Institucional:** Confirma los hallazgos clave del tablero: **13.4% de los hogares** tiene al menos una persona con discapacidad (Gráfica 1, pág. 6), **19.0% de prevalencia en adultos mayores de 60+ años** (Gráfica 4, pág. 7), y que **Movilidad (1.7%) y Visión (1.6%)** son los dos dominios de mayor prevalencia nacional (Gráfica 5, pág. 8). *(Nota técnica: el boletín reporta 3.9% sobre el corte de 5+ años, mientras que el motor de microdatos evalúa desde los 4+ años con 3.78%, coincidiendo en 13.4% de hogares y 19.0% en adultos mayores).* |
| **`BOLETA-ENAPROM-2025.pdf`** | **Diccionario y Estructura Cartográfica/Conceptual:** Define la escala de 4 niveles del Conjunto Corto del Grupo de Washington (1: Sin dificultad, 2: Alguna dificultad, 3: Mucha dificultad, 4: No puede hacerlo) y la sección educativa. |

---

## 6. Limitaciones, Mejoras Futuras y Declaración de Uso de IA

* **Limitaciones Muestrales:** En subgrupos muy acotados (como *niñas y adolescentes mujeres de 4 a 17 años con dificultad severa*, `CV = 20.34%`, o *asistencia escolar en ≥ 15 años con dificultad severa*, `CV = 20.24%`), el tamaño muestral supera el umbral del 20% de CV y la interfaz lo resguarda automáticamente.
* **Mejoras Futuras:** Integrar Estimación en Áreas Pequeñas (*Small Area Estimation — SAE*) con el Censo de Población para desagregación municipal y vincular el simulador con costos unitarios de CONALFA y CONADI.
* **Declaración de Uso de IA:** Se utilizó IA Generativa (Google Gemini / Antigravity IDE) exclusivamente como asistente de desarrollo Frontend (React/TypeScript/Tailwind) y maquetación documental. **Ningún dato estadístico fue generado ni estimado por IA:** el 100% de las cifras proviene del cálculo matemático determinista en Python (`generar_json_dashboard.py`) sobre los microdatos oficiales del INE.

