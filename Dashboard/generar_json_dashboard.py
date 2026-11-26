import json
import pandas as pd
import numpy as np
from datetime import datetime

# ==============================================================================
# 1. MOTOR DE ESTIMACIÓN PONDERADA Y CV POR CONGLOMERADOS (TAYLOR - INE)
# ==============================================================================
def calcular_metrica_taylor(df_sub, col_condicion, col_peso='FACTOR', col_upm='NO_HOGAR'):
    """
    Calcula la proporción ponderada, Error Estándar (SE), Coeficiente de Variación (CV)
    y el estado del semáforo oficial del INE (CV <= 20%).
    """
    if len(df_sub) < 5:
        return None

    y = df_sub[col_condicion].astype(float).values
    w = df_sub[col_peso].values
    suma_w = np.sum(w)

    if suma_w <= 0:
        return None

    r_hat = np.sum(w * y) / suma_w
    if r_hat <= 0:
        return {
            "valor": 0.0,
            "se": 0.0,
            "cv": None,
            "n_muestral": int(len(df_sub)),
            "poblacion_expandida": int(round(suma_w)),
            "estado_cv": "NO_PUBLICABLE",
            "publicable": False
        }

    # Linealización de Taylor agrupada por unidad de hogar (NO_HOGAR)
    tmp = pd.DataFrame({'upm': df_sub[col_upm].values, 'z': w * (y - r_hat) / suma_w})
    totales_upm = tmp.groupby('upm')['z'].sum()
    m = len(totales_upm)

    if m < 2:
        return None

    var_r = (m / (m - 1)) * np.sum((totales_upm - totales_upm.mean()) ** 2)
    se_r = np.sqrt(var_r)
    cv = (se_r / r_hat) * 100

    if cv <= 15.0:
        estado = "CONFIABLE"
    elif cv <= 20.0:
        estado = "PRECAUCION"
    else:
        estado = "NO_PUBLICABLE"

    return {
        "valor": round(float(r_hat * 100), 2),
        "se": round(float(se_r * 100), 2),
        "cv": round(float(cv), 2),
        "n_muestral": int(len(df_sub)),
        "poblacion_expandida": int(round(float(suma_w))),
        "estado_cv": estado,
        "publicable": bool(cv <= 20.0)
    }


# ==============================================================================
# 2. CARGA Y PREPARACIÓN DE MICRODATOS ENAPROM 2025 (UNA SOLA TABLA OFICIAL)
# ==============================================================================
df = pd.read_excel('ENAPROM_PERSONAS-3.xlsx', sheet_name='ENAPROM_PERSONAS 3')

cols_wg = ['P02A11A', 'P02A11B', 'P02A11C', 'P02A11D', 'P02A11E', 'P02A11F']

# Banderas Washington Group (>= 4 años)
df['disc_severa'] = (df['P02A03'] >= 4) & (df[cols_wg].isin([3, 4]).any(axis=1))
df['alguna_disc'] = (df['P02A03'] >= 4) & (df[cols_wg].isin([2, 3, 4]).any(axis=1))
df['sexo_label'] = df['P02A02'].map({1: 'Hombres', 2: 'Mujeres'})

# Grupos etarios estándar
df['grupo_edad'] = pd.cut(
    df['P02A03'],
    bins=[-1, 3, 17, 59, 120],
    labels=['0-3', '4-17', '18-59', '60+']
)

# ==============================================================================
# 3. CONSTRUCCIÓN DE BLOQUES ANALÍTICOS PARA REACT + VITE
# ==============================================================================

# A. KPIs Nivel Hogar (Agregación directa por NO_HOGAR sin cruces externos)
hogares = df.groupby('NO_HOGAR', as_index=False).agg(
    tiene_disc_severa=('disc_severa', 'any'),
    tiene_alguna_disc=('alguna_disc', 'any'),
    FACTOR=('FACTOR', 'first'),
    num_miembros=('CP', 'count')
)

kpi_hogar_severa = calcular_metrica_taylor(hogares, 'tiene_disc_severa')
kpi_hogar_alguna = calcular_metrica_taylor(hogares, 'tiene_alguna_disc')

hog_sev_exp = int(round(hogares.loc[hogares['tiene_disc_severa'], 'FACTOR'].sum()))
hog_alg_exp = int(round(hogares.loc[hogares['tiene_alguna_disc'], 'FACTOR'].sum()))

# B. Prevalencia Multidimensional (Edad x Sexo en >= 4 años)
df_4mas = df[df['P02A03'] >= 4].copy()
cruces_prevalencia = []

for edad in ['TODOS', '4-17', '18-59', '60+']:
    for sexo in ['TODOS', 'Hombres', 'Mujeres']:
        sub = df_4mas.copy()
        if edad != 'TODOS':
            sub = sub[sub['grupo_edad'] == edad]
        if sexo != 'TODOS':
            sub = sub[sub['sexo_label'] == sexo]

        res_sev = calcular_metrica_taylor(sub, 'disc_severa')
        res_alg = calcular_metrica_taylor(sub, 'alguna_disc')

        if res_sev:
            pob_con_disc = int(round(sub.loc[sub['disc_severa'], 'FACTOR'].sum()))
            cruces_prevalencia.append({
                "filtro_edad": edad,
                "filtro_sexo": sexo,
                "discapacidad_severa": res_sev,
                "alguna_dificultad": res_alg,
                "personas_con_disc_severa_est": pob_con_disc
            })

# C. Dominios Funcionales Washington Group (ENAPROM 2025: P02A11A - P02A11F)
dominios_meta = [
    {"codigo": "P02A11C", "id": "caminar", "nombre": "Caminar o subir escaleras"},
    {"codigo": "P02A11A", "id": "ver", "nombre": "Ver (aun usando lentes)"},
    {"codigo": "P02A11D", "id": "recordar", "nombre": "Recordar o concentrarse"},
    {"codigo": "P02A11B", "id": "oir", "nombre": "Oír (aun usando aparato)"},
    {"codigo": "P02A11F", "id": "comunicarse", "nombre": "Comunicarse"},
    {"codigo": "P02A11E", "id": "cuidado_personal", "nombre": "Cuidado personal o vestirse"}
]

dominios_wg = []
for dom in dominios_meta:
    col = dom["codigo"]
    df_4mas['tmp_dom'] = df_4mas[col].isin([3, 4])
    metrica_gral = calcular_metrica_taylor(df_4mas, 'tmp_dom')
    metrica_60 = calcular_metrica_taylor(df_4mas[df_4mas['grupo_edad'] == '60+'], 'tmp_dom')
    dominios_wg.append({
        **dom,
        "general_4_mas": metrica_gral,
        "adultos_mayores_60_mas": metrica_60
    })

# D. Brechas Sociodemográficas en la Misma Tabla (>= 15 años, sin cruces)
df_15mas = df[df['P02A03'] >= 15].copy()
df_15mas['no_sabe_leer'] = (df_15mas['P02A13'] == 2)
df_15mas['asiste_educacion'] = (df_15mas['P02A15'] == 1)

brechas_inclusion = [
    {
        "id": "analfabetismo",
        "indicador": "No sabe leer ni escribir (>= 15 años)",
        "variable_boleta": "P02A13 == 2",
        "fuente": "ENAPROM 2025 (ENAPROM_PERSONAS-3)",
        "con_discapacidad_severa": calcular_metrica_taylor(df_15mas[df_15mas['disc_severa']], 'no_sabe_leer'),
        "sin_discapacidad_severa": calcular_metrica_taylor(df_15mas[~df_15mas['disc_severa']], 'no_sabe_leer')
    },
    {
        "id": "asistencia_educativa",
        "indicador": "Asistencia actual a establecimiento educativo (>= 15 años)",
        "variable_boleta": "P02A15 == 1",
        "fuente": "ENAPROM 2025 (ENAPROM_PERSONAS-3)",
        "con_discapacidad_severa": calcular_metrica_taylor(df_15mas[df_15mas['disc_severa']], 'asiste_educacion'),
        "sin_discapacidad_severa": calcular_metrica_taylor(df_15mas[~df_15mas['disc_severa']], 'asiste_educacion')
    }
]

# E. Módulo Especializado de Discapacidad (P05B - Solo personas con DISCAPACIDAD == 1, n=879)
df_disc = df[df['DISCAPACIDAD'] == 1].copy()
modulo_discapacidad_p05b = {
    "n_muestral": int(len(df_disc)),
    "poblacion_expandida": int(round(df_disc['FACTOR'].sum())),
    "nota": "Preguntas aplicadas exclusivamente a personas con discapacidad severa en ENAPROM 2025 (sin cruce externo)",
    "variables": {}
}

for col in ['P05B01A', 'P05B01B', 'P05B02', 'P05B03', 'P05B04', 'P05B05']:
    categorias = []
    for val in sorted(df_disc[col].dropna().unique()):
        df_disc['tmp_cat'] = (df_disc[col] == val)
        sub_valid = df_disc[df_disc[col].notna()].copy()
        met = calcular_metrica_taylor(sub_valid, 'tmp_cat')
        categorias.append({
            "codigo": int(val),
            "metrica": met
        })
    modulo_discapacidad_p05b["variables"][col] = categorias

# ==============================================================================
# 4. ENSAMBLAJE Y EXPORTACIÓN FINAL DEL JSON PARA REACT + VITE
# ==============================================================================
dashboard_payload = {
    "metadata": {
        "proyecto": "Datatón INE 2026 — Grupo 2: Análisis de Datos",
        "tema": "Discapacidad (Washington Group), Hogares y Brechas de Inclusión",
        "universo_geografico": "República de Guatemala (Cobertura Nacional — ENAPROM 2025)",
        "umbral_cv_maximo": 20.0,
        "fecha_generacion": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "fuentes": [
            "ENAPROM 2025 — Base de Personas Nacional (ENAPROM_PERSONAS-3.xlsx, INE)"
        ],
        "nota_metodologica": "Estimaciones generadas íntegramente desde una única base oficial de ENAPROM 2025 agregada por NO_HOGAR y CP, sin fusión de encuestas independientes."
    },
    "definiciones_oficiales": {
        "hogar": {
            "titulo": "¿Qué es un Hogar y cómo se calcula?",
            "definicion_ine": "Según el INE (ENAPROM 2025), un hogar es la unidad doméstica formada por una persona sola o un grupo de personas, con o sin vínculo de parentesco, que residen habitualmente en la misma vivienda y comparten un presupuesto común para la alimentación.",
            "metodo_calculo": "A partir de la base oficial de personas (ENAPROM_PERSONAS-3.xlsx), se agrupan los residentes por la llave única de hogar (NO_HOGAR, n = 5,124 hogares; N = 4,107,011 hogares expandidos). Un hogar se clasifica con presencia de dificultad funcional severa si al menos un integrante de 4 años o más (CP) presenta código 3 o 4 en los dominios del Washington Group, aplicando el factor de expansión del hogar (FACTOR) y linealización de Taylor por conglomerado."
        },
        "washington_group": {
            "titulo": "¿Por qué 'Dificultades Funcionales Severas' (Washington Group)?",
            "definicion_wg": "El Grupo de Washington sobre Estadísticas de Discapacidad (WG-SS), adoptado por el INE en el Capítulo II de la ENAPROM 2025 (preguntas P02A11A a P02A11F), evalúa limitaciones funcionales en 6 dominios básicos (ver, oír, caminar, recordar/concentrarse, cuidado personal y comunicarse) en población de 4 años y más, evitando el subregistro asociado al estigma del término clínico 'discapacidad'.",
            "criterio_estadistico": "La escala de respuesta tiene 4 niveles: 1) Sin dificultad, 2) Cierta dificultad, 3) Mucha dificultad y 4) No puede hacerlo. Siguiendo el estándar internacional del Washington Group para comparabilidad y focalización de políticas públicas, el umbral operativo de 'Dificultad Funcional Severa (Discapacidad)' incluye exclusivamente a quienes reportan código 3 (Mucha dificultad) o código 4 (No puede hacerlo) en al menos un dominio."
        }
    },
    "kpis_hogar": {
        "discapacidad_severa": {
            **kpi_hogar_severa,
            "hogares_con_condicion_est": hog_sev_exp,
            "ratio_texto": f"1 de cada {100 / kpi_hogar_severa['valor']:.2f} hogares",
            "descripcion": "Hogares con al menos una persona (>=4 años) con dificultad severa o total"
        },
        "alguna_dificultad": {
            **kpi_hogar_alguna,
            "hogares_con_condicion_est": hog_alg_exp,
            "ratio_texto": f"1 de cada {100 / kpi_hogar_alguna['valor']:.2f} hogares",
            "descripcion": "Hogares con al menos una persona (>=4 años) con alguna dificultad funcional"
        }
    },
    "explorador_prevalencia": cruces_prevalencia,
    "dominios_washington_group": dominios_wg,
    "brechas_inclusion": brechas_inclusion,
    "modulo_especializado_p05b": modulo_discapacidad_p05b
}

output_path = 'datos_dashboard.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(dashboard_payload, f, ensure_ascii=False, indent=2)

print(f"Archivo '{output_path}' generado exitosamente.")
