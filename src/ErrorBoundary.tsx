import React from "react";

type State = { hasError: boolean; error?: unknown };

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Útil para diagnosticar fallos de render
    console.error("🚨 Error atrapado por ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, color: "#b91c1c", background: "#fff1f2", border: "1px solid #fecdd3" }}>
          <b>Se produjo un error al renderizar el reporte.</b>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{String(this.state.error)}</pre>
          <div style={{ fontSize: 12, marginTop: 8 }}>
            Abre la consola (F12 → Consola) para ver el stacktrace y el archivo exacto que falló.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
