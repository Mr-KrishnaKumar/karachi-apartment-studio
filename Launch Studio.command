#!/bin/bash
set -eu
cd "$(dirname "$0")"
if ! command -v npm >/dev/null 2>&1; then
  echo "Install Node.js 20.19+ or 22.12+ first, then open this launcher again."
  read -r -p "Press Enter to close..." response
  exit 1
fi
npm install
npm run validate
exec npm run dev -- --open
