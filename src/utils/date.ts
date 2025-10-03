// src/utils/date.ts
export function fmtDateES(input: string | Date): string {
  const d = input instanceof Date ? input : new Date(input + 'T00:00:00');
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
