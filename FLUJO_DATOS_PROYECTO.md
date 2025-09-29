# Flujo de datos del proyecto

> **Objetivo**: explicar, de forma clara y operativa, cómo fluye la información desde el arranque de la app hasta la generación del PDF, qué archivos intervienen y dónde modificar cada parte sin romper el informe.

---

## 1) Visión general (E2E)

```
index.html (#root)
  └─ src/main.tsx                 → Monta React + estilos globales
      └─ src/App.tsx              → ErrorBoundary + página principal
          └─ src/pages/Index.tsx  → <SOCDashboard /> (acceso al informe)
              └─ src/pages/report/Report.tsx
                  ├─ genera/obtiene datos (src/data/socData.ts)
                  ├─ Página 1: Page1Overview
                  ├─ Página 2: Page2Analysis
                  ├─ Página 3: Page3Records
                  └─ Exportar PDF: src/utils/pdfExportByPages.ts
```

- **HTML final**: solo existe **`index.html`**. Todo lo demás es **DOM generado por React**.
- **Datos**: por defecto vienen de **`src/data/socData.ts`** (mock). En producción, remplazar por capa de acceso a Postgres/API que **devuelva el mismo shape**.
- **PDF**: se crea a partir del DOM visible (por páginas A4), con **html2canvas** + **jsPDF**.

---

## 2) Puntos de entrada

### `index.html`
- Único HTML estático. Define `<div id="root"></div>` y carga el bundle Vite.

### `src/main.tsx`
- Monta el árbol React en `#root`.
- Aplica estilos globales con `import "./index.css"`.

### `src/App.tsx`
- Envuelve la app en `<ErrorBoundary>`.
- Renderiza la página principal (`<IndexPage />`).

### `src/pages/Index.tsx`
- Renderiza **`<SOCDashboard />`** (punto de entrada de la UI). Desde aquí se navega/abre el informe.

---

## 3) El Informe

### `src/pages/report/Report.tsx`
- **Responsable de orquestar el informe**.
- Obtiene datos de `generateReportData()` (mock) o de tu API (cuando la integres).
- Normaliza datos a un shape consistente para gráficos/tablas.
- Compone el informe en **3 páginas**:
  - **P1**: `Page1Overview` → cabecera, KPIs, donuts, evolución diaria.
  - **P2**: `Page2Analysis` → Top CVE, Activos más afectados, MITRE.
  - **P3**: `Page3Records` → Tabla de incidentes, eventos, recomendaciones, glosario.
- Dispone de un **botón** que llama a `exportReportByPages(rootRef, options)`.

### `src/pages/report/Page1Overview.tsx`
- **Cabecera**: `src/components/soc/ReportHeader.tsx` (export **nombrado**: `{ ReportHeader }`).
- **KPIs**: tarjetas compactas con Incidentes | Activos | MTTA | MTTR.
- **Donuts**:
  - `src/components/soc/SeverityChart.tsx` (Recharts Pie; excluye "Informational").
  - `src/components/soc/StatusChart.tsx` (Recharts Pie).
- **Evolución diaria**: `src/components/soc/DailyIncidentsChart.tsx`.

### `src/pages/report/Page2Analysis.tsx`
- **Top CVE**: `TopCVEChart` (barras; etiquetas diagonales si procede).
- **Activos más afectados**: `TopAssetsChart`.
- **MITRE**: `MitreRadarChart` (o barras/radar según implementación actual).

### `src/pages/report/Page3Records.tsx`
- **IncidentsTable**: tabla de incidentes (sin columna CVE por decisión de diseño).
- **HighlightedEventsSection**: eventos relevantes.
- **RecommendationsSection**: recomendaciones (sin campo "Responsable" si así se definió).
- **GlossarySection**: términos clave.

---

## 4) Datos (mock → reales)

### `src/data/socData.ts`
- Genera **mocks** coherentes: severidad, estado, top CVE, activos, MITRE, incidentes, etc.
- Devuelve un objeto plano que `Report.tsx` adapta al shape esperado por los componentes.

**Recomendación para conectar Postgres**:
1. Crea `src/data/api.ts` con funciones asíncronas (ej.: `fetchReportData(periodo)`), que consulten tu API/DB.
2. En `Report.tsx`, sustituye `generateReportData()` por la llamada a `fetchReportData()`.
3. **Mantén el shape** de salida (por ejemplo, arrays `{ name, value, color? }` para los charts). Así evitas tocar la UI.

---

## 5) Exportación a PDF por páginas (A4)

### `src/utils/pdfExportByPages.ts`
- Recorre el contenedor del informe buscando secciones con `data-pdf-page` (una por página A4).
- Activa `print-mode` (clase CSS) para densificar espaciados y fijar tamaños reales (mm).
- Para cada sección:
  - Rasteriza con `html2canvas` (fondo blanco, escala 2x).
  - Inserta en `jsPDF` como imagen del tamaño A4 (210×297 mm).
  - Añade salto de página entre secciones.
- Limpia `print-mode` al finalizar.

**Dependencias**:
```bash
npm i html2canvas jspdf
npm i -D @types/jspdf
```

---

## 6) Estilos globales y de impresión

### `src/index.css`
- **Design System**: variables HSL (colores base, severidades, estados, etc.).
- **Estilos A4**: `.a4`, `.pdf-page`, `.avoid-break` y `@media print`.
- **Modo PDF**: `.print-mode` para compactar densidades y evitar cortes.
- Ajustes de tablas y grids para que no desborden.

> *Tip*: si en PDF algún texto se pisa, añade reglas bajo `.print-mode` (p. ej., reducir `font-size` de leyendas, ajustar `gap` o `line-height`).

---

## 7) Alias de importación y rutas portables

- Alias `@` → `src/` definido en **`vite.config.ts`** y **`tsconfig.json`**.
- **Nunca** uses rutas absolutas del sistema (ej.: `/home/usuario/...`).
- Formato correcto de imports internos:

```ts
import { ReportHeader } from "@/components/soc/ReportHeader";
import SeverityChart from "@/components/soc/SeverityChart";
import StatusChart from "@/components/soc/StatusChart";
```

---

## 8) Estructura de carpetas (referencial)

```
src/
├─ assets/                      # opcional
├─ components/
│  ├─ ui/                       # Card, Button, etc.
│  └─ soc/
│     ├─ ReportHeader.tsx
│     ├─ SeverityChart.tsx
│     ├─ StatusChart.tsx
│     ├─ DailyIncidentsChart.tsx
│     ├─ TopCVEChart.tsx
│     ├─ TopAssetsChart.tsx
│     ├─ MitreRadarChart.tsx
│     ├─ IncidentsTable.tsx
│     ├─ RecommendationsSection.tsx
│     ├─ HighlightedEventsSection.tsx
│     └─ GlossarySection.tsx
├─ data/
│  └─ socData.ts               # mocks (intercambiar por API/DB)
├─ pages/
│  ├─ Index.tsx
│  └─ report/
│     ├─ Report.tsx
│     ├─ Page1Overview.tsx
│     ├─ Page2Analysis.tsx
│     └─ Page3Records.tsx
├─ utils/
│  └─ pdfExportByPages.ts
├─ App.tsx
├─ ErrorBoundary.tsx
├─ index.css
└─ main.tsx
```

---

## 9) Scripts útiles

```bash
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # build de producción en /dist
npm run preview   # sirve /dist localmente
```

> Para GitHub Pages bajo `/usuario/repositorio/`, añade `base` en `vite.config.ts`:
> ```ts
> export default defineConfig({ base: '/soc-insight-render/', ... })
> ```

---

## 10) Troubleshooting rápido

- **Pantalla en blanco**: revisa la consola → imports rotos, export nombrado vs default (ej.: `{ ReportHeader }`).
- **Rutas absolutas**: busca `/home/` o `from "/`:
  ```bash
  grep -RIn "from \"/" src || true
  grep -RIn "/home/" src || true
  ```
- **PDF cortado**: confirma que cada página del informe tenga `data-pdf-page` y que `.a4` tenga `padding` correcto. Revisa `.print-mode` en `index.css`.
- **Leyendas que se pisan**: usa leyenda personalizada (flex-wrap, fuente pequeña) o muévela fuera del chart.
