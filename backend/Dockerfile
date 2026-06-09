# =============================================================================
# SMAS Backend — Express 5 + Prisma 6 + Bun runtime
# Multi-stage build:
#   1. deps    — install production deps
#   2. prisma  — generate Prisma client for the linux/amd64 target
#   3. runner  — lean runtime image
# No compile step needed: Bun runs index.ts directly.
# =============================================================================

# ── Stage 1: deps ─────────────────────────────────────────────────────────────
FROM oven/bun:1 AS deps

WORKDIR /app

COPY package.json bun.lock* ./

# Install all dependencies (including devDeps for prisma CLI)
RUN bun install --frozen-lockfile


# ── Stage 2: prisma-generate ──────────────────────────────────────────────────
# Generate the Prisma client for the linux/amd64 platform.
# This must happen inside Docker (not on a dev Mac/Windows) so the native
# query engine binary matches the container OS/arch.
FROM oven/bun:1 AS prisma-generate

WORKDIR /app

# Need the full node_modules (including prisma CLI) for generation
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY prisma/ ./prisma/

# Generate into the standard output path: node_modules/.prisma/client
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
RUN bunx prisma generate


# ── Stage 3: runner ───────────────────────────────────────────────────────────
FROM oven/bun:1-slim AS runner

WORKDIR /app

# ── System dependencies ───────────────────────────────────────────────────────
# openssl  — Prisma query engine needs it at runtime
# ca-certificates — outbound HTTPS calls (e.g. JWT verification, webhooks)
RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends \
      openssl \
      ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# ── Non-root user ─────────────────────────────────────────────────────────────
# oven/bun:1-slim is Debian-based — use groupadd/useradd
RUN groupadd --system --gid 1001 appgroup \
 && useradd  --system --uid 1001 --gid appgroup -s /bin/false appuser

# ── Application files ─────────────────────────────────────────────────────────
# Source (Bun runs TypeScript directly — no dist/ needed)
COPY --chown=appuser:appgroup . .

# Overwrite node_modules with the Docker-built ones (correct arch binaries)
COPY --from=prisma-generate --chown=appuser:appgroup /app/node_modules ./node_modules

# Prisma client generated for linux/amd64
COPY --from=prisma-generate --chown=appuser:appgroup /app/node_modules/.prisma ./node_modules/.prisma

# Prisma schema + migrations (needed at runtime for db push / migrate deploy)
COPY --chown=appuser:appgroup prisma/ ./prisma/

# ── Upload directories ────────────────────────────────────────────────────────
# Mount a volume over /app/uploads in production to persist files.
RUN mkdir -p uploads/pdfs uploads/images uploads/videos uploads/docs uploads/misc \
 && chown -R appuser:appgroup uploads/

USER appuser

EXPOSE 3001

# ── Health check ──────────────────────────────────────────────────────────────
# The Express app exposes /api/health
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD bun -e "fetch('http://localhost:3001/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# ── Startup ───────────────────────────────────────────────────────────────────
# Bun runs index.ts directly — no tsc, no build artefacts.
# Your app handles migrations + admin seeding internally on boot.
CMD ["bun", "run", "index.ts"]
