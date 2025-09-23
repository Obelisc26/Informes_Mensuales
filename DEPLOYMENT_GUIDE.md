# Guía de Despliegue - Dashboard SOC

## 📋 Resumen
Esta aplicación React genera informes SOC similares a tu sistema Flask original, con exportación a PDF mejorada y márgenes correctos.

## 🛠️ Tecnologías Utilizadas
- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS + shadcn/ui
- **Gráficos**: Recharts
- **PDF Export**: jsPDF + html2canvas
- **Íconos**: Lucide React

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ui/                    # Componentes base (shadcn/ui)
│   └── soc/                   # Componentes específicos del SOC
│       ├── SOCDashboard.tsx   # Dashboard principal
│       ├── ReportHeader.tsx   # Cabecera del informe
│       ├── ReportActions.tsx  # Botones de exportación
│       ├── KPICard.tsx        # Tarjetas de métricas
│       ├── *Chart.tsx         # Componentes de gráficos
│       ├── IncidentsTable.tsx # Tabla de incidentes
│       └── ...                # Otros componentes
├── data/
│   └── socData.ts            # Datos simulados y lógica
├── types/
│   └── soc.ts               # Definiciones de tipos TypeScript
├── utils/
│   └── pdfExport.ts         # Funcionalidad de exportación PDF
└── index.css                 # Estilos globales y de impresión
```

## 🚀 Instalación y Configuración

### 1. Clonar y Configurar
```bash
# Clonar el repositorio
git clone <repository-url>
cd soc-dashboard

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

### 2. Dependencias Principales
```json
{
  "react": "^18.3.1",
  "recharts": "^2.15.4",
  "jspdf": "^3.0.3",
  "html2canvas": "^1.4.1",
  "lucide-react": "^0.462.0"
}
```

## 📊 Configuración de Datos

### Estructura de Datos Principal (`src/types/soc.ts`)
```typescript
interface Incident {
  id: string;
  created_at: Date;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  asset: string;
  cve?: string;
  status: 'Abierta' | 'En revisión' | 'Mitigada';
  tactic?: string;
  incident_type: string;
}

interface ReportData {
  incidentsTotal: number;
  activosAffectados: number;
  mtta: string;
  mttr: string;
  severityData: ChartDataItem[];
  topCVEs: ChartDataItem[];
  dailyIncidents: DailyIncident[];
  // ... más campos
}
```

### Personalización de Datos (`src/data/socData.ts`)
```typescript
// 1. Modificar datos de cliente
export const generateReportData = (clienteData?: Partial<ReportData>) => {
  // Datos base simulados
  const baseData = {
    incidentsTotal: 175,
    activosAffectados: 6,
    mtta: "45m",
    mttr: "2h 14m"
  };
  
  // Combinar con datos personalizados
  return { ...baseData, ...clienteData };
};

// 2. Configurar CVEs específicas
const CVE_DATABASE = {
  "CVE-2024-12345": {
    titulo: "RCE en servicio web",
    descripcion: "Ejecución remota de código por deserialización insegura.",
    mitigacion: ["Aplicar parche", "Configurar WAF"],
    score: 9.8
  }
  // ... agregar más CVEs
};
```

## 🎨 Personalización Visual

### Sistema de Colores (`src/index.css`)
```css
:root {
  /* Colores de severidad - modificar según necesidad */
  --critical: 0 84% 60%;      /* Rojo crítico */
  --high: 25 95% 53%;         /* Naranja alto */
  --medium: 45 93% 47%;       /* Amarillo medio */
  --low: 142 76% 36%;         /* Verde bajo */
  --info: 220 9% 46%;         /* Gris informacional */
}
```

### Configurar Empresa y Branding
```typescript
// En SOCDashboard.tsx, línea ~27
interface SOCDashboardProps {
  cliente?: string;      // "Mi Empresa S.A."
  periodo?: string;      // "Q1 2024"
  autores?: string;      // "Equipo SOC ACME"
}
```

## 📄 Funcionalidad PDF

### Configuración de Exportación (`src/utils/pdfExport.ts`)
```typescript
export const exportToPDF = async (elementId: string, options?: ExportOptions) => {
  // Configuración mejorada con márgenes correctos
  const margin = 15; // 15mm de margen
  const pdfWidth = 210; // A4: 210mm ancho
  const pdfHeight = 297; // A4: 297mm alto
  
  // El sistema automáticamente:
  // ✅ Centra el contenido
  // ✅ Aplica márgenes apropiados
  // ✅ Maneja paginación automática
  // ✅ Optimiza resolución para PDF
};
```

## 🔧 Integración con Backend Real

### Reemplazar Datos Simulados
1. **Modificar `src/data/socData.ts`**:
```typescript
// Reemplazar función generateReportData()
export const fetchReportDataFromAPI = async (): Promise<ReportData> => {
  const response = await fetch('/api/soc/report');
  const data = await response.json();
  
  return {
    incidentsTotal: data.incidents_total,
    severityData: data.severity_breakdown.map(item => ({
      name: item.severity,
      value: item.count,
      color: getSeverityColor(item.severity)
    })),
    // ... mapear otros campos
  };
};
```

2. **Conectar en SOCDashboard.tsx**:
```typescript
useEffect(() => {
  const loadData = async () => {
    try {
      const data = await fetchReportDataFromAPI(); // En lugar de generateReportData()
      setReportData(data);
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback a datos simulados
    }
  };
  loadData();
}, []);
```

## 🌐 Despliegue en Producción

### Opción 1: Build Estático
```bash
# Generar build de producción
npm run build

# Los archivos están en dist/
# Servir con cualquier servidor web (nginx, apache, etc.)
```

### Opción 2: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Opción 3: Integrar con Flask Existente
```python
# En tu app.py Flask existente
@app.route('/dashboard')
def dashboard():
    return send_from_directory('dist', 'index.html')

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('dist/assets', filename)
```

## 📋 Lista de Verificación para Despliegue

### ✅ Configuración Básica
- [ ] Instalar Node.js 18+ y npm
- [ ] Clonar repositorio y `npm install`
- [ ] Verificar que `npm run dev` funciona
- [ ] Personalizar colores en `index.css`

### ✅ Personalización de Datos
- [ ] Modificar empresa/período en `SOCDashboard.tsx`
- [ ] Actualizar CVE database en `socData.ts`
- [ ] Configurar colores de severidad
- [ ] Ajustar métricas KPI según necesidades

### ✅ Integración Backend
- [ ] Crear endpoint API para datos SOC
- [ ] Modificar `fetchReportDataFromAPI()` 
- [ ] Testear conexión con datos reales
- [ ] Configurar fallbacks para errores

### ✅ Funcionalidad PDF
- [ ] Verificar que exportación PDF funciona
- [ ] Comprobar márgenes y paginación
- [ ] Testear con diferentes tamaños de contenido
- [ ] Validar calidad de gráficos en PDF

### ✅ Despliegue Producción
- [ ] Ejecutar `npm run build` exitosamente
- [ ] Configurar servidor web para servir archivos estáticos
- [ ] Testear en diferentes navegadores
- [ ] Configurar HTTPS si es necesario

## 🆘 Resolución de Problemas Comunes

### PDF sin márgenes o cortado
- ✅ **Solucionado**: El nuevo algoritmo aplica márgenes de 15mm automáticamente
- Verificar que `print-mode` class se aplica correctamente

### Gráficos no aparecen en PDF
- Asegurar que Recharts renderiza antes de captura
- Aumentar `setTimeout` en `exportToPDF` si es necesario

### Colores incorrectos en modo oscuro
- Verificar variables CSS en `:root` vs `.dark`
- Los estilos `.print-mode` fuerzan colores apropiados para PDF

### Datos no cargan
- Verificar conexión API en Network tab del navegador
- Confirmar formato de datos coincide con interfaces TypeScript

## 📞 Soporte

Para problemas específicos:
1. Revisar console del navegador para errores
2. Verificar que todas las dependencias están instaladas
3. Consultar esta documentación para configuración
4. Probar con datos simulados primero antes de integrar API real

---

**Versión**: 1.0  
**Última actualización**: 2024  
**Compatibilidad**: Node.js 18+, Navegadores modernos