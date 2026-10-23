# ==========================================
# STAGE 1: Build Dependencies (Builder)
# ==========================================
FROM python:3.12-slim AS builder

WORKDIR /build

# Strumenti di compilazione per estensioni C/Rust se necessarie
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Creazione virtual environment isolato in /opt/venv
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ==========================================
# STAGE 2: Runtime Finale (Runner)
# ==========================================
FROM python:3.12-slim AS runner

# Installazione esclusiva dei runtime necessari
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && rm -f /etc/nginx/sites-enabled/default

# Copia del virtualenv pre-costruito dallo stage builder (senza compilatori né cache)
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Configurazioni Nginx e Supervisor
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Frontend statico
WORKDIR /usr/share/nginx/html
COPY frontend/ .

# Backend applicativo
WORKDIR /app/backend
COPY backend/ .

# Healthcheck interno
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://127.0.0.1/docs || exit 1

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
