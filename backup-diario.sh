#!/usr/bin/env bash
set -euo pipefail

# Uso: ./backup-diario.sh [ruta-del-repo]
# Si pasas una ruta, entrará ahí; si no, usa el directorio actual.
if [[ $# -ge 1 ]]; then
  cd "$1"
fi

# 1) Comprobar que estamos en un repo git
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  echo "❌ Aquí no hay un repositorio Git. Ve a la carpeta del repo o pásala como argumento."
  exit 1
}

# 2) Detectar rama base (main o master)
BASE_BRANCH="main"
if ! git rev-parse --verify "$BASE_BRANCH" >/dev/null 2>&1; then
  BASE_BRANCH="master"
fi

# 3) Asegurar que origin existe
if ! git remote get-url origin >/dev/null 2>&1; then
  echo "❌ No hay remoto 'origin' configurado. Configúralo primero:"
  echo "   git remote add origin git@github.com:Obelisc26/Informes_Mensuales.git"
  exit 1
fi

# 4) Actualizar rama base local desde origin (opcional pero recomendado)
git fetch origin
git checkout "$BASE_BRANCH"
# Si quieres rebase, cambia 'merge' por 'rebase'
git pull --ff-only origin "$BASE_BRANCH" || {
  echo "⚠️  No se pudo hacer fast-forward a $BASE_BRANCH. Revisa el estado antes de continuar."
}

# 5) Crear nombre de rama por fecha (y hora si ya existía)
DATE_STR="$(date +%Y-%m-%d)"
TIME_STR="$(date +%H%M%S)"
BRANCH_NAME="backup/${DATE_STR}"

# Si ya existe local o remoto, añade hora para que sea única
if git rev-parse --verify "$BRANCH_NAME" >/dev/null 2>&1 || \
   git ls-remote --exit-code --heads origin "$BRANCH_NAME" >/dev/null 2>&1; then
  BRANCH_NAME="backup/${DATE_STR}-${TIME_STR}"
fi

# 6) Crear/saltar a la rama nueva desde la base actualizada
git checkout -b "$BRANCH_NAME"

# 7) Añadir y commitear todo (aunque sean archivos nuevos/eliminados)
git add -A

# Si no hay cambios reales, crea commit vacío para dejar rastro del snapshot
if git diff --cached --quiet; then
  git commit --allow-empty -m "chore(backup): snapshot ${DATE_STR} ${TIME_STR}"
else
  git commit -m "chore(backup): snapshot ${DATE_STR} ${TIME_STR}"
fi

# 8) Subir la rama al remoto y dejarla trackeada
git push -u origin "$BRANCH_NAME"

echo "✅ Backup diario creado y subido: $BRANCH_NAME"

