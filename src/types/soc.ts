export interface SocIncident {
  id: string;
  created_at: Date;
  severity: "Critical" | "High" | "Medium" | "Low" | "Informational";
  asset: string;
  cve?: string;
  status: "Abierta" | "En revisión" | "Mitigada";
  tactic?: string;
  incident_type: string;
}

export interface CVEDetails {
  cve: string;
  titulo: string;
  descripcion: string;
  mitigacion: string[];
  tipo: string;
  afecta: string;
  accion: string;
  compact: string;
}

export interface Recommendation {
  icon: string;
  titulo: string;
  detalle: string;
  owner: string;
  deadline: string;
}

export interface HighlightedEvent {
  titulo: string;
  fecha: string;
  resumen: string;
}

export interface GlossaryTerm {
  term: string;
  def: string;
}

export interface ReportData {
  incidentsTotal: number;
  activosAffectados: number;
  mtta: string;
  mttr: string;
  severityData: Array<{ name: string; value: number; color: string }>;
  topCVEs: Array<{ name: string; value: number }>;
  dailyIncidents: Array<{ date: string; Critical: number; High: number; Medium: number; Low: number; Informational: number }>;
  topAssets: Array<{ name: string; value: number }>;
  statusData: Array<{ name: string; value: number; color: string }>;
  mitreData: Array<{ name: string; value: number }>;
  sampleIncidents: SocIncident[];
  cveDetails: CVEDetails[];
  recommendations: Recommendation[];
  highlightedEvents: HighlightedEvent[];
  glossary: GlossaryTerm[];
}