#!/usr/bin/env bash
set -euo pipefail
if [[ ${RUNNER_ENVIRONMENT:-} == self-hosted ]]; then
  pnpm exec playwright install chromium
else
  pnpm exec playwright install --with-deps chromium
fi
