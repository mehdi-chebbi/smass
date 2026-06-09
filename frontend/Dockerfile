# =============================================================================
# SMAS Frontend — Next.js 16 + Bun runtime
# Build strategy: Node.js for the build step (Next.js toolchain is Node-native),
# Bun for the production runtime. This sidesteps bunx PATH/version issues that
# prevent .next/standalone from being emitted.
# =============================================================================

# ── Stage 1: deps ─────────────────────────────────────────────────────────────
# Install dependencies with Bun so bun.lock is respected, but expose them to
# the Node-based build stage via a plain node_modules layout.
FROM oven/bun:1 AS deps

WORKDIR /app

# Copy lockfile and manifests first for layer-cache efficiency
COPY package.json bun.lock* ./

# Install all deps (including devDeps — needed for the build)
RUN bun install --frozen-lockfile


# ── Stage 2: builder ──────────────────────────────────────────────────────────
# Use Node 20 (LTS) to run `next build`.  This guarantees:
#   • next binary resolves from project-local node_modules (not a global cache)
#   • output: "standalone" is reliably emitted
#   • sharp native bindings compile correctly for the linux/amd64 target
FROM node:20-alpine AS builder

WORKDIR /app

# Bring in source + the node_modules installed by Bun above
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env vars Next.js needs to inline at compile time.
# Do NOT put secrets here; use ARG for public/build-only values.
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=production
# Disable Next.js telemetry inside CI/Docker
ENV NEXT_TELEMETRY_DISABLED=1

# Run the build via the npm script so Node picks up the local next binary.
RUN npm run build

# Verify standalone was actually emitted — fail fast
RUN test -d .next/standalone || { echo "ERROR: .next/standalone not generated — check next.config.ts has output: 'standalone' and that the build completed without fatal errors"; exit 1; }


# ── Stage 3: runner ───────────────────────────────────────────────────────────
# Minimal Bun image.  Only the standalone bundle, static assets, and public
# files are copied in — no node_modules, no source, no build tooling.
FROM oven/bun:1-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create a non-root user (oven/bun:1-slim is Debian-based — use groupadd/useradd)
RUN groupadd --system --gid 1001 nodejs \
 && useradd  --system --uid 1001 --gid nodejs -s /bin/false nextjs

# The standalone output is self-contained: it includes a minimal server.js and
# a trimmed node_modules copy with only the production runtime deps.
COPY --from=builder /app/.next/standalone ./

# Static assets are NOT included in standalone — must be copied separately.
COPY --from=builder /app/.next/static ./.next/static

# Public directory (logos, robots.txt, etc.)
COPY --from=builder /app/public ./public

# i18n dictionaries required at runtime
COPY --from=builder /app/src/i18n/dictionaries ./src/i18n/dictionaries

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Run the standalone server with Bun.
# standalone/server.js is plain Node-compatible CJS — Bun runs it natively.
CMD ["bun", "run", "server.js"]