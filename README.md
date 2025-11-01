# CrypTool 🔐

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://docs.docker.com)

**Laboratorio interattivo di crittografia** per esplorare algoritmi classici e moderni, comprendere le loro vulnerabilità e sperimentare con attacchi simulati.

---

## 🎯 Obiettivi del Laboratorio

- **Comprendere algoritmi storici** (Cesare, Vigenère) e perché sono vulnerabili
- **Sperimentare con hash function** (MD5, SHA-1, SHA-256, Bcrypt) e capire le differenze di sicurezza
- **Utilizzare algoritmi moderni** (AES-256, RSA) per cifratura file e messaggi
- **Simulare attacchi** (brute force, dictionary attack) in modo sicuro e controllato
---

## 🧪 Cosa Puoi Fare

### Algoritmi Storici (⚠️ NON Sicuri)
- **Cifrario di Cesare**: Cifra e decifra con shift alfabetico | Simula attacco brute force
- **Cifrario di Vigenère**: Cifra con chiave alfabetica | Simula dictionary attack
- **Hash MD5/SHA-1**: Calcola hash legacy | Simula rainbow table attack

### Algoritmi Moderni (✅ Sicuri)
- **SHA-256**: Hash crittograficamente sicuro per integrità dati
- **Bcrypt**: Password hashing con salt e cost factor configurabile
- **AES-256**: Cifratura simmetrica di file con password robusta
- **RSA-2048/4096**: Crittografia asimmetrica per messaggi e scambio chiavi

### Simulazioni Attacchi
- **Brute Force**: Prova tutte le combinazioni possibili (Cesare)
- **Dictionary Attack**: Prova parole comuni come chiavi (Vigenère, Hash)
- **Confronto Tempi**: Misura l'efficacia del cost factor (Bcrypt)

---

## 🚀 Avvio Rapido

### Prerequisiti
- **Docker** e **Docker Compose**
- Porte libere: `5173` (frontend), `8080` (backend)

### Lancio Applicazione

```bash
# Clona il repository
git clone <repository-url>
cd CrypTool

# Avvia frontend + backend
docker compose up --build
```

**Accesso:**
- 🌐 **Interfaccia Web**: http://localhost:5173
- 📘 **API Docs (Swagger)**: http://localhost:8080/docs

### Arresto

```bash
# Stop containers
docker compose down

# Stop + rimozione volumi
docker compose down -v
```

---

## 📚 Come Usare il Laboratorio

1. **Esplora gli algoritmi**: Ogni card contiene una spiegazione teorica e indicatori di sicurezza
2. **Sperimenta**: Cifra/decifra testi, genera hash, crea chiavi RSA
3. **Simula attacchi**: Prova brute force e dictionary attack per capire le vulnerabilità
4. **Confronta**: Misura i tempi di esecuzione (es. Bcrypt con diversi cost factor)
5. **Impara**: Leggi le best practices e scopri quando usare ogni algoritmo

---

## 🔗 API Reference

Le API sono completamente documentate con **Swagger UI** interattivo.

**Base URL**: `http://localhost:8080`

### Endpoint Disponibili

| Categoria | Endpoint | Metodo | Descrizione |
|-----------|----------|--------|-------------|
| **Cesare** | `/api/caesar` | POST | Cifra/decifra con shift |
| | `/api/caesar/bruteforce` | POST | Attacco brute force |
| **Vigenère** | `/api/vigenere` | POST | Cifra/decifra con chiave |
| | `/api/vigenere/dictionaryattack` | POST | Dictionary attack |
| **Hash** | `/api/hash` | POST | Calcola hash (MD5/SHA-1/SHA-256) |
| | `/api/hash/dictionaryattack` | POST | Trova testo originale |
| **Bcrypt** | `/api/hash/bcrypt` | POST | Genera hash con cost factor |
| | `/api/hash/bcrypt-verify` | POST | Verifica password |
| **AES** | `/api/aes/encrypt-file` | POST | Cifra file con password |
| | `/api/aes/decrypt-file` | POST | Decifra file .enc |
| **RSA** | `/api/rsa/generate` | POST | Genera coppia chiavi |
| | `/api/rsa/encrypt` | POST | Cifra con chiave pubblica |
| | `/api/rsa/decrypt` | POST | Decifra con chiave privata |

**Per dettagli completi e test interattivi**: http://localhost:8080/docs

---


