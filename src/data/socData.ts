import { ReportData, SocIncident, CVEDetails, Recommendation, HighlightedEvent, GlossaryTerm } from '@/types/soc';

const MITRE_TACTICS: Record<string, string> = {
  "TA0001": "Acceso inicial",
  "TA0002": "Ejecución", 
  "TA0003": "Persistencia",
  "TA0004": "Escalado de privilegios",
  "TA0005": "Evasión de defensas",
  "TA0006": "Credenciales de acceso",
  "TA0007": "Descubrimiento",
  "TA0008": "Movimiento lateral",
  "TA0009": "Recolección",
  "TA0010": "Exfiltración",
  "TA0011": "Comando y control",
  "TA0040": "Reconocimiento",
  "TA0042": "Desarrollo de recursos",
};

const CVE_KNOWLEDGE_BASE: Record<string, Omit<CVEDetails, 'cve'>> = {
  "CVE-2024-12345": {
    titulo: "RCE en servicio web",
    descripcion: "Ejecución remota de código por deserialización insegura.",
    mitigacion: ["Parche del fabricante", "Validar entradas/deserialización segura", "WAF delante del servicio"],
    tipo: "RCE",
    afecta: "Backend web",
    accion: "Parchear + WAF",
    compact: "CVE-2024-12345 - RCE en servicio web → Parchear + WAF"
  },
  "CVE-2023-9876": {
    titulo: "Escalada de privilegios en SO",
    descripcion: "Condición de carrera en kernel permite privilegios elevados.",
    mitigacion: ["Actualizar kernel", "Mínimo privilegio", "Reinicio controlado"],
    tipo: "LPE",
    afecta: "Kernel/OS",
    accion: "Actualizar SO",
    compact: "CVE-2023-9876 - Escalada de privilegios en SO → Actualizar SO"
  },
  "CVE-2022-1111": {
    titulo: "Divulgación de información",
    descripcion: "Endpoint expone secretos por mala configuración.",
    mitigacion: ["Rotar claves", "Corregir configuración/headers", "Monitoreo DLP"],
    tipo: "Info leak",
    afecta: "API/Config",
    accion: "Reconfigurar + Rotar",
    compact: "CVE-2022-1111 - Divulgación de información → Reconfigurar + Rotar"
  },
  "CVE-2024-5555": {
    titulo: "Vulnerabilidad SQLi",
    descripcion: "Inyección SQL en formulario de login.",
    mitigacion: ["Consultas parametrizadas", "Validación de entrada", "WAF"], 
    tipo: "SQLi",
    afecta: "Web App",
    accion: "Parchear código",
    compact: "CVE-2024-5555 - Vulnerabilidad SQLi → Parchear código"
  },
  "CVE-2023-7777": {
    titulo: "Buffer overflow en servicio",
    descripcion: "Desbordamiento de buffer permite ejecución de código.",
    mitigacion: ["Actualizar servicio", "Limitar acceso", "Monitoreo"],
    tipo: "Buffer Overflow",
    afecta: "Servicio de red",
    accion: "Actualizar + Limitar acceso",
    compact: "CVE-2023-7777 - Buffer overflow → Actualizar + Limitar acceso"
  }
};

// Generate sample incidents
const generateSampleIncidents = (): SocIncident[] => {
  const severities: SocIncident['severity'][] = ['Critical', 'High', 'Medium', 'Low', 'Informational'];
  const assets = ['SRV-ERP-01', 'SRV-DB-01', 'FW-PRD-01', 'VPN-PRD-01', 'WS-CEO', 'DC-01', 'MAIL-01', 'WEB-01'];
  const statuses: SocIncident['status'][] = ['Abierta', 'En revisión', 'Mitigada'];
  const cves = Object.keys(CVE_KNOWLEDGE_BASE);
  const tactics = Object.keys(MITRE_TACTICS);
  const incidentTypes = ['Vulnerabilidad', 'Malware', 'Phishing', 'Acceso no autorizado', 'Ransomware', 'DDoS', 'Fuga de datos'];

  const incidents: SocIncident[] = [];

  for (let i = 0; i < 15; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    
    incidents.push({
      id: `INC-${String(i + 1).padStart(4, '0')}`,
      created_at: new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000)),
      severity: severities[Math.floor(Math.random() * severities.length)],
      asset: assets[Math.floor(Math.random() * assets.length)],
      cve: Math.random() > 0.4 ? cves[Math.floor(Math.random() * cves.length)] : undefined,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      tactic: Math.random() > 0.3 ? tactics[Math.floor(Math.random() * tactics.length)] : undefined,
      incident_type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)]
    });
  }

  return incidents.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
};

// Generate daily incidents data for last 14 days
const generateDailyIncidents = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      Critical: Math.floor(Math.random() * 3),
      High: Math.floor(Math.random() * 5) + 1,
      Medium: Math.floor(Math.random() * 8) + 2,
      Low: Math.floor(Math.random() * 4) + 1,
      Informational: Math.floor(Math.random() * 2)
    });
  }
  
  return data;
};

export const generateReportData = (): ReportData => {
  const sampleIncidents = generateSampleIncidents();
  const dailyIncidents = generateDailyIncidents();
  
  // Calculate metrics
  const severityCounts = sampleIncidents.reduce((acc, incident) => {
    acc[incident.severity] = (acc[incident.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const severityColors: Record<string, string> = {
    Critical: 'hsl(var(--critical))',
    High: 'hsl(var(--high))',
    Medium: 'hsl(var(--medium))',
    Low: 'hsl(var(--low))',
    Informational: 'hsl(var(--info))'
  };

  const severityData = Object.entries(severityCounts).map(([name, value]) => ({
    name,
    value,
    color: severityColors[name] || 'hsl(var(--muted))'
  }));

  // CVE analysis
  const cveCounts = sampleIncidents
    .filter(i => i.cve)
    .reduce((acc, incident) => {
      acc[incident.cve!] = (acc[incident.cve!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topCVEs = Object.entries(cveCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  // Asset analysis  
  const assetCounts = sampleIncidents.reduce((acc, incident) => {
    acc[incident.asset] = (acc[incident.asset] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topAssets = Object.entries(assetCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  // Status analysis
  const statusCounts = sampleIncidents.reduce((acc, incident) => {
    acc[incident.status] = (acc[incident.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusColors: Record<string, string> = {
    'Abierta': 'hsl(var(--destructive))',
    'En revisión': 'hsl(var(--medium))',
    'Mitigada': 'hsl(var(--low))'
  };

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
    color: statusColors[name] || 'hsl(var(--muted))'
  }));

  // MITRE TTP analysis
  const tacticCounts = sampleIncidents
    .filter(i => i.tactic)
    .reduce((acc, incident) => {
      const tacticName = MITRE_TACTICS[incident.tactic!] || incident.tactic!;
      acc[tacticName] = (acc[tacticName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const mitreData = Object.entries(tacticCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  // CVE details
  const cveDetails: CVEDetails[] = topCVEs.map(({ name }) => ({
    cve: name,
    ...CVE_KNOWLEDGE_BASE[name] || {
      titulo: "Vulnerabilidad detectada",
      descripcion: "Ver NVD/proveedor para detalles; aplicar mitigaciones estándar.",
      mitigacion: ["Aplicar parche/actualización", "Limitar exposición", "Revisar logs"],
      tipo: "Exploit",
      afecta: "Componente",
      accion: "Parchear",
      compact: `${name} - Vulnerabilidad detectada → Parchear`
    }
  }));

  const recommendations: Recommendation[] = [
    {
      icon: "🛠️",
      titulo: `Parchar ${topCVEs[0]?.name || 'CVE-2024-XXXXX'}`,
      detalle: "Aplicar parche y validar compensaciones.",
      owner: "IT Ops",
      deadline: "7 días"
    },
    {
      icon: "🔐",
      titulo: "MFA + mínimos privilegios",
      detalle: "MFA obligatorio en VPN/SSH/RDP.",
      owner: "Seguridad",
      deadline: "14 días"
    },
    {
      icon: "📘",
      titulo: "Playbooks phishing/DLP",
      detalle: "Actualizar runbooks y simulacros.",
      owner: "SOC",
      deadline: "30 días"
    }
  ];

  const highlightedEvents: HighlightedEvent[] = [
    {
      titulo: "Exfiltración bloqueada",
      fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      resumen: "Intento interrumpido por DLP."
    },
    {
      titulo: "Campaña de phishing",
      fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      resumen: "12 correos reportados; formación reforzada."
    }
  ];

  const glossary: GlossaryTerm[] = [
    {
      term: "CVE",
      def: "Identificador global de una vulnerabilidad (p. ej., CVE-2024-12345)."
    },
    {
      term: "Vulnerabilidad",
      def: "Debilidad que un atacante puede explotar."
    },
    {
      term: "Severidad",
      def: "Grado de impacto/riesgo (Critical/High/Medium/Low)."
    },
    {
      term: "MITRE ATT&CK",
      def: "Framework de tácticas y técnicas utilizadas por atacantes."
    },
    {
      term: "MTTA",
      def: "Mean Time To Acknowledge - Tiempo medio hasta reconocimiento."
    },
    {
      term: "MTTR",
      def: "Mean Time To Resolution - Tiempo medio hasta resolución."
    }
  ];

  const incidentsTotal = dailyIncidents.reduce((sum, day) => 
    sum + day.Critical + day.High + day.Medium + day.Low + day.Informational, 0
  );

  const activosAffectados = new Set(sampleIncidents.map(i => i.asset)).size;

  return {
    incidentsTotal,
    activosAffectados,
    mtta: "45m",
    mttr: "2h 14m",
    severityData,
    topCVEs,
    dailyIncidents,
    topAssets,
    statusData,
    mitreData,
    sampleIncidents,
    cveDetails,
    recommendations,
    highlightedEvents,
    glossary
  };
};