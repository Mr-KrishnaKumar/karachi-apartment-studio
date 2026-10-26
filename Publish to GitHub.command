#!/bin/bash
set -eu
cd "$(dirname "$0")"
node scripts/publish-github.mjs
