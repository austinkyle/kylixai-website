#!/usr/bin/env bash
# ============================================================
#  KylixAI — Cloudflare Pages Build Script
#  Copies build/src/ → dist/ and injects environment variables.
#
#  Required env vars (set in Cloudflare Pages dashboard):
#    WEB3FORMS_ACCESS_KEY  — from web3forms.com
#    CALENDAR_BOOKING_URL  — Calendly or Cal.com booking link
#
#  Local use:
#    source .env && bash deploy-build.sh
# ============================================================
set -euo pipefail

SRC="build/src"
OUT="dist"

if [ ! -d "$SRC" ]; then
  echo "ERROR: $SRC directory not found. Run from project root." >&2
  exit 1
fi

if [ -z "${WEB3FORMS_ACCESS_KEY:-}" ]; then
  echo "ERROR: WEB3FORMS_ACCESS_KEY is not set." >&2
  exit 1
fi

if [ -z "${CALENDAR_BOOKING_URL:-}" ]; then
  echo "ERROR: CALENDAR_BOOKING_URL is not set." >&2
  exit 1
fi

echo "Building to $OUT/ ..."
rm -rf "$OUT"
cp -r "$SRC" "$OUT"

# Substitute placeholders in the output copy — never touches source files
sed -i.bak \
  -e "s|__WEB3FORMS_KEY__|${WEB3FORMS_ACCESS_KEY}|g" \
  -e "s|__CALENDAR_URL__|${CALENDAR_BOOKING_URL}|g" \
  "$OUT/index.html"
rm -f "$OUT/index.html.bak"

echo "Done. Output: $OUT/"
