#!/bin/bash
# Azariya Index — publish the marketing site.
#
# WHAT THIS DOES NOW: commit and push. That is the whole job. Cloudflare Pages is connected to
# this repo and builds on every push to main, so there is nothing to upload by hand.
#
# WHAT IT NO LONGER DOES: re-encrypt a dashboard blob into x/f.json. That passphrase-gated vault
# was retired on 21 Aug 2026 — the blob, the gate markup and its decryption code are all gone.
# The real product replaces it with per-account auth rather than one shared passphrase.
#
# NOT THE NIGHTLY DASHBOARDS. Those are a different pipeline entirely: the collection run uploads
# ~451 bundles straight to R2 from fs_postprocess.sh. They never touch git — a daily commit of
# data files would bloat this repo permanently, which is the same reason *.db is gitignored.
cd "$(dirname "$0")" || exit 1

echo "Azariya Index - publishing the site..."

if [ -n "$(git status --porcelain)" ]; then
  git add -A
  if git commit -q -m "Site update $(date '+%Y-%m-%d %H:%M')"; then
    echo "[ok] Committed."
  else
    echo "[stop] Commit failed."
    echo ""; echo "Press any key to close."; read -n 1; exit 1
  fi
else
  echo "[..] No local changes - pushing anything unpushed."
fi

if git push -q; then
  echo "[ok] Pushed. Cloudflare Pages deploys in ~1 min -> https://azariyaindex.com"
else
  echo "[stop] Push failed - check the network, or that the SSH key is still on the GitHub account."
  echo ""; echo "Press any key to close."; read -n 1; exit 1
fi

echo ""
echo "Press any key to close."
read -n 1
