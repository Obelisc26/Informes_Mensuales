import React, { Suspense } from "react";
import IndexPage from "@/pages/Index";
import { ErrorBoundary } from "@/ErrorBoundary";

// Señal visual de que React sí montó:
const MountPing = () => (
  <div className="text-xs text-gray-500 px-2 py-1">
    <span>✅ App montada</span>
  </div>
);

export default function App() {
  return (
    <>
      <MountPing />
      <ErrorBoundary>
        <Suspense fallback={<div className="p-4">Cargando…</div>}>
          <IndexPage />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
