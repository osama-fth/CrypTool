FROM python:3.12-slim

# Installazione Nginx, Supervisor e utilità base
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Configurazione Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/sites-enabled/default

# Configurazione Supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Setup Frontend
WORKDIR /usr/share/nginx/html
COPY frontend/ .

# Setup Backend
WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Esposizione della porta 80 (Nginx per Web + Proxy API)
EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

