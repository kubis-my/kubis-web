# Set build arguments for Node and pnpm versions
ARG NODE_VERSION=22.13
ARG PNPM_VERSION=9.0.0
ARG APP_NAME

# Environment variables required at build time
ARG NEXT_PUBLIC_AUTH_URL
ARG NEXT_PUBLIC_MAIN_APP_BASE_URL
ARG NEXT_PUBLIC_SSO_APP_BASE_URL
ARG NEXT_PUBLIC_MAIN_CLIENT_ID

# ---- 1. Prune Phase: Optimize Monorepo Context ----
FROM node:${NODE_VERSION} AS pruner

ARG APP_NAME
WORKDIR /app

# Install TurboRepo for efficient monorepo builds
RUN npm install -g turbo

# Copy all project files for pruning
COPY . .

# Prune to only needed dependencies/files for specified service
RUN turbo prune --scope=${APP_NAME} --docker

# ---- 2. Installer Phase: Install Dependencies ----
FROM node:${NODE_VERSION} AS installer

WORKDIR /app

# Copy only pruned workspace JSON, lockfile, and turbo config
COPY --from=pruner /app/out/json .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/turbo.json ./turbo.json

# Install pnpm and all dependencies based on pruned context
RUN npm install -g pnpm@${PNPM_VERSION}
RUN pnpm install --frozen-lockfile

# ---- 3. Builder Phase: Build the Project ----
FROM node:${NODE_VERSION} AS builder

# Re-declare build arguments needed in this stage
ARG PNPM_VERSION
ARG NEXT_PUBLIC_AUTH_URL
ARG NEXT_PUBLIC_MAIN_APP_BASE_URL
ARG NEXT_PUBLIC_SSO_APP_BASE_URL
ARG NEXT_PUBLIC_MAIN_CLIENT_ID

# Set environment variables for Next.js build
ENV NEXT_PUBLIC_AUTH_URL=${NEXT_PUBLIC_AUTH_URL}
ENV NEXT_PUBLIC_MAIN_APP_BASE_URL=${NEXT_PUBLIC_MAIN_APP_BASE_URL}
ENV NEXT_PUBLIC_SSO_APP_BASE_URL=${NEXT_PUBLIC_SSO_APP_BASE_URL}
ENV NEXT_PUBLIC_MAIN_CLIENT_ID=${NEXT_PUBLIC_MAIN_CLIENT_ID}

WORKDIR /app

# Copy installed deps and pruned files for build
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full .

RUN npm install -g pnpm@${PNPM_VERSION}

# Build the main service
RUN pnpm run build

# ---- 4. Runner Phase: Production Image ----
FROM node:${NODE_VERSION}-slim AS runner

ENV NODE_ENV=production
ARG APP_NAME
ARG PNPM_VERSION
ENV APP_NAME=${APP_NAME}
WORKDIR /app

# Install required packages for the runtime
RUN apt-get update && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

# Copy only needed package.json files for runtime
COPY --from=builder /app/apps/${APP_NAME}/package.json ./apps/${APP_NAME}/package.json
COPY --from=builder /app/pnpm-workspace.yaml .

# Copy production node_modules for each relevant workspace
COPY --from=builder /app/apps/${APP_NAME}/node_modules ./apps/${APP_NAME}/node_modules
COPY --from=builder /app/node_modules ./node_modules

# Copy built output
COPY --from=builder /app/apps/${APP_NAME}/.next ./apps/${APP_NAME}/.next
COPY --from=builder /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public

# Install pnpm CLI
RUN npm install -g pnpm@${PNPM_VERSION}

# Clean up npm/pnpm cache to reduce image size
RUN rm -rf /root/.npm /root/.pnpm-store /root/.local/share/pnpm

CMD ["sh", "-c", "cd apps/${APP_NAME} && pnpm start"]