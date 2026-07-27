#!/usr/bin/env bash
# Génère des placeholders JPG (dégradés, SANS texte) pour chaque projet.
# Nécessite ImageMagick (`convert`). Lancer : bash scripts/gen-placeholders.sh
# Tes vraies images se déposent dans public/projects/{slug}/ (voir src/data/projects.ts).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/projects"

# slug:colorA:colorB  (dégradé du projet)
PROJECTS=(
  "poz-dca-lab:#2b2b2e:#9a9a9f"
  "cycling-doc:#3a4a3f:#cdd7c9"
  "animalia:#4a3b2f:#ddcdb8"
  "ecole-42:#1f1f24:#7d7d86"
  "visions:#2d2a3a:#c7c2da"
)

gen() { # w h A B out
  convert -size "${1}x${2}" -define gradient:angle=135 "gradient:${3}-${4}" \
    -attenuate 0.35 +noise Gaussian -quality 82 "${5}"
}

for entry in "${PROJECTS[@]}"; do
  IFS=':' read -r slug a b <<< "$entry"
  dir="$OUT/$slug"
  mkdir -p "$dir"
  # cover : paysage 3:2 (ratio 1.5)
  gen 1600 1067 "$a" "$b" "$dir/cover.jpg"
  # 6 visuels éditoriaux pour la page projet (alternance large / portrait)
  for n in 1 2 3 4 5 6; do
    name=$(printf "%02d" "$n")
    if (( n % 3 == 1 )); then gen 1600 1000 "$a" "$b" "$dir/$name.jpg"   # large
    else gen 1100 1400 "$a" "$b" "$dir/$name.jpg"; fi                    # portrait
  done
done

echo "Placeholders JPG générés dans public/projects/*"
