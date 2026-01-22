# Match Electoral - El Poder en tus Manos | RPP

![Match Electoral](https://img.shields.io/badge/Status-Activo-brightgreen)
![Vanilla JS](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS-blue)
![API](https://img.shields.io/badge/Data-Google%20Sheets%20API-yellow)

**Match Electoral** es una herramienta interactiva desarrollada para **RPP Noticias** bajo la campaña "El Poder en tus Manos". Su objetivo es ayudar a los ciudadanos a descubrir su afinidad con los candidatos presidenciales mediante una experiencia de usuario dinámica y basada en datos verificados.

## 📌 Propósito del Proyecto
Facilitar el acceso a las propuestas de los planes de gobierno de forma lúdica y educativa. El usuario interactúa con afirmaciones clave y, al finalizar, obtiene un porcentaje de coincidencia con cada candidato basado en las posturas oficiales de estos frente a los temas planteados.

---

## 🚀 Funcionalidades Principales

### 1. Interacción de Tarjetas (Swipe)
- **Gestos Intuitivos**: Los usuarios pueden deslizar las tarjetas a la derecha (**De acuerdo**), izquierda (**En desacuerdo**) o usar el botón central (**Neutral**).
- **Indicadores Visuales**: Colores dinámicos y etiquetas que aparecen mientras se desliza para confirmar la acción.
- **Micro-animaciones**: Efectos de burbujas y feedback hápitico (vibración) al tomar una decisión.

### 2. Fuentes Verificadas
- Cada propuesta incluye un icono de información que abre un panel lateral con las **fuentes y referencias** oficiales citadas por RPP.pe, garantizando la veracidad de la información.

### 3. Sistema de Afinidad
- **Algoritmo de Cálculo**: La afinidad se calcula de forma proporcional a las respuestas del usuario frente a las posturas de los candidatos:
    - **Coincidencia Total (+1.0 pto)**: Si la respuesta del usuario (De acuerdo/En desacuerdo) coincide exactamente con la postura del candidato.
    - **Postura Neutral (+0.5 pto)**: Si el usuario elige la opción "Neutral", se asigna medio punto de afinidad con todos los candidatos, reconociendo una postura intermedia o no conflictiva.
    - **Discrepancia (0 ptos)**: Si la respuesta del usuario es opuesta a la postura del candidato.
- **Puntaje Final**: Se suma el puntaje total obtenido por candidato y se divide entre el número total de preguntas respondidas, generando un porcentaje de 0% a 100%.
- **Pantalla de Resultados**: Muestra un ranking de candidatos con sus fotos, partidos y el porcentaje de afinidad animado de mayor a menor.

### 4. Herramientas de Control
- **Deshacer (Undo)**: Permite revertir la última decisión tomada durante un periodo de 4 segundos.
- **Barra de Progreso**: Indicador visual del avance en el test.

### 5. Engagement y Recirculación
- **Encuesta de Satisfacción**: Integrada con Google Analytics 4 para medir la experiencia del usuario.
- **Recirculación**: Enlaces directos a otras herramientas como "Brújula Electoral" y "Mapa Político".

---

## 🛠️ Stack Tecnológico
El proyecto está construido sin dependencias pesadas para asegurar máxima velocidad de carga:
- **HTML5**: Estructura semántica avanzada.
- **CSS3 Moderno**: Variables CSS, Flexbox/Grid, animaciones y soporte para *Safe Areas* (dispositivos móviles modernos).
- **JavaScript (Vanilla JS)**: Lógica de interacción, manejo del DOM y consumo de APIs.
- **Google Sheets API v4**: Utilizado como backend para la gestión dinámica de contenidos.

---

## ⚙️ Mantenimiento y Gestión de Datos

El sistema se alimenta directamente de una hoja de cálculo de Google, lo que permite actualizaciones en tiempo real sin tocar el código.

### Configuración del Google Sheet
El ID de la hoja actual es: `1f1S5srBhGx8Gshl3lDe-oCNaNvEcjAkaBhcQ6ts_VQU`

#### 1. Hoja: `Candidatos`
Columnas necesarias:
- `ID_Candidato`: Número correlativo.
- `Nombre_Completo`: Nombre del candidato.
- `Partido_Politico`: Nombre de la agrupación.
- `URL_Foto`: Enlace a la imagen del candidato.

#### 2. Hoja: `Afirmaciones`
Columnas necesarias:
- `ID_Afirmacion`: Identificador único.
- `Tema_Principal`: Categoría de la propuesta (ej: Economía).
- `Texto_Propuesta`: La afirmación que leerá el usuario.
- `Candidato_{ID}_Postura`: `agree`, `disagree` o `neutral`.
- `Candidato_{ID}_Fuente_URL`: Link a la noticia en RPP.pe.

> **Importante**: Al agregar un nuevo candidato, se deben crear sus respectivas columnas de postura y fuente en la hoja de Afirmaciones siguiendo el patrón `Candidato_X_...`.

---

## 📦 Instalación y Despliegue

1. Clona el repositorio:
   ```bash
   git clone https://github.com/ppetitv/test-de-afinidad.git
   ```
2. Abre `index.html` en un servidor local (puedes usar la extensión *Live Server* en VS Code o similar).
3. Asegúrate de que la API Key de Google Cloud Console en `script.js` esté activa y tenga permisos para Google Sheets API.

---

## 🎨 Diseño y UX
- **Tipografía**: 'Inter' para garantizar legibilidad en móviles.
- **Paleta de Colores**:
  - Acuerdos: `#28a745` (Verde)
  - Desacuerdos: `#dc3545` (Rojo)
  - Neutral/Marca: `#5838D9` (Púrpura RPP)
- **Modo Mobile First**: Optimizado para pantallas táctiles con áreas de clic ampliadas.

---

## 👤 Accesibilidad y SEO
- Atributos **ARIA** implementados para lectores de pantalla.
- Navegación por teclado:
  - `Flecha Derecha`: De acuerdo.
  - `Flecha Izquierda`: En desacuerdo.
  - `Espacio`: Neutral.
- Metaetiquetas optimizadas para compartir en redes sociales (Open Graph).

---

© 2026 RPP Noticias - El Poder en tus Manos.
