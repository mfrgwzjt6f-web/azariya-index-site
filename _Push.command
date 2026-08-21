#!/bin/bash
# Azariya — one-click publish: re-encrypt the vault page, then commit & push.
cd "$(dirname "$0")" || exit 1
SITE="$(pwd)"
SRC="$SITE/../Properties/_Azariya_Data.html"
PASSFILE="$SITE/../.azariya_passphrase"
OUT="$SITE/x/f.json"

echo "Azariya - publishing..."

if [ -f "$SRC" ] && [ -f "$PASSFILE" ]; then
  if command -v node >/dev/null 2>&1; then
    if AZARIYA_PASSPHRASE="$(cat "$PASSFILE")" node "$SITE/tools/encrypt.mjs" "$SRC" "$OUT"; then
      echo "[ok] Re-encrypted the latest data."
    else
      echo "[stop] Encryption failed - aborting so stale data isn't published."
      echo "Press any key to close."; read -n 1; exit 1
    fi
  else
    echo "[warn] Node not found on this Mac - skipping re-encryption."
    echo "       (Install Node to enable auto-encryption; pushing existing blob.)"
  fi
else
  echo "[warn] Data file or passphrase not found - skipping re-encryption."
fi

git add -A
if git commit -m "Site update $(date '+%Y-%m-%d %H:%M')"; then
  echo "[ok] Committed."
else
  echo "[..] Nothing new to commit."
fi

if git push; then
  echo "[ok] Pushed. Netlify will deploy in ~1-2 min."
else
  echo "[stop] Push failed - check your connection / GitHub sign-in."
fi

echo ""
echo "Press any key to close."
read -n 1
