# CrypTool 🔐

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-6BA539?logo=openapiinitiative&logoColor=white)](http://localhost:8080/docs)
[![Swagger UI](https://img.shields.io/badge/Swagger%20UI-85EA2D?logo=swagger&logoColor=black)](http://localhost:8080/docs)

Applicazione web semplice per operazioni crittografiche di base, composta da un backend FastAPI e un frontend statico Bootstrap.  
- Backend: FastAPI, vedi [backend/app.py](backend/app.py) ⚙️  
- Frontend: HTML/CSS/JS statici, vedi [frontend/index.html](frontend/index.html), [frontend/script.js](frontend/script.js), [frontend/styles.css](frontend/styles.css) 🎨  
- Container: [docker-compose.yml](docker-compose.yml) 🐳

## Funzionalità ✨

- Cifrario di Cesare: cifratura/decifratura con scorrimento personalizzabile 🔁
- Cifrario di Vigenère: cifratura/decifratura con chiave 🔑
- Hash: MD5, SHA-1, SHA-256 🧮
- Cifratura/Decifratura file con password (AES) 🗂️🔐

## Requisiti 🧰

- Docker e Docker Compose 🐳
- Porte libere: 5173 (frontend), 8080 (backend) 🔌

## Avvio rapido 🚀

Con Docker Compose (consigliato):

```bash
# Avvia frontend + backend
docker compose up --build
```

- Interfaccia Web: http://localhost:5173 🌐  
- API/Swagger UI: http://localhost:8080/docs 📘

Arresto:

```bash
docker compose down
```

Arresto con rimozione:

```bash
docker compose down -v
```

## API Reference (POST) 🔗

Base URL: http://localhost:8080

1) /api/caesar  
Form fields:
- text: string
- shift: int (1–25)
- decode: bool ("true"/"false")

Esempio:

```bash
curl -X POST http://localhost:8080/api/caesar \
  -F "text=Hello, World! 123" -F "shift=3" -F "decode=false"
```

2) /api/vigenere  
Form fields:
- text: string
- key: string
- decode: bool

Esempio:

```bash
curl -X POST http://localhost:8080/api/vigenere \
  -F "text=ATTACK AT DAWN!" -F "key=LEMON" -F "decode=false"
```

3) /api/hash  
Form fields:
- text: string
- algorithm: md5 | sha1 | sha256 (default sha256)

Esempio:

```bash
curl -X POST http://localhost:8080/api/hash \
  -F "text=hello" -F "algorithm=sha256"
```

4) /api/encrypt-file  
Form fields:
- file: file binario
- password: string

Esempio:

```bash
curl -X POST http://localhost:8080/api/encrypt-file \
  -F "file=@/percorso/al/file.pdf" -F "password=Segreta123!" \
  -o file.pdf.enc
```

5) /api/decrypt-file  
Form fields:
- file: file .enc
- password: string

Esempio:

```bash
curl -X POST http://localhost:8080/api/decrypt-file \
  -F "file=@file.pdf.enc" -F "password=Segreta123!" \
  -o file.pdf
```
