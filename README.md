# CrypTool 🔐 v2.0

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://docs.docker.com)
[![Nginx](https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=white)](https://nginx.org)
[![NIST PQC](https://img.shields.io/badge/NIST-FIPS%20203%20%2F%20204-blue)](https://csrc.nist.gov/pqc)

**Laboratorio interattivo di crittografia classica, moderna, quantistica e post-quantistica**.
Progettato per comprendere i principi matematici, sperimentare con attacchi computazionali reali e quantistici, e visualizzare il passaggio agli standard NIST del 2024.

---

## 🎯 Panoramica e Obiettivi Didattici

CrypTool guida l'utente attraverso l'intera evoluzione della sicurezza informatica:
1. **Crittografia Classica**: Cesare, Vigenère e le debolezze storiche (brute-force, analisi statistica).
2. **Funzioni di Hash & Password Security**: Da MD5/SHA-1 (vulnerabili a collisioni e rainbow tables) a SHA-256 e Bcrypt con cost factor adattivo.
3. **Crittografia Moderna Autenticata**: AES-256-GCM (riservatezza + integrità) e RSA-2048/4096 (crittografia asimmetrica).
4. **Crittografia Quantistica (QKD)**: Protocollo BB84 e rilevazione di intercettazioni via principio di indeterminazione di Heisenberg.
5. **Attacchi Quantistici (Shor & Grover)**: Simulazione della fattorizzazione RSA via algoritmo di Shor (tempo polinomiale) e dimezzamento della sicurezza con Grover.
6. **Crittografia Post-Quantistica (NIST Standards 2024)**:
   - **ML-KEM (CRYSTALS-Kyber, FIPS 203)**: Key Encapsulation basato su reticoli algebrici (Module-LWE).
   - **ML-DSA (CRYSTALS-Dilithium, FIPS 204)**: Firma digitale quantisticamente resistente.

---

## 🐳 Architettura Single-Container

Il progetto adotta un'architettura integrata **single-container** per la massima portabilità (`git clone` e `docker compose up`):
- **Nginx**: Serve il frontend statico sulla porta 80 e funge da reverse proxy verso `/api/*`.
- **FastAPI / Uvicorn**: Backend asincrono Python 3.12 in esecuzione interna su `127.0.0.1:8080`.
- **Supervisor**: Gestore di processi per coordinare Nginx e Uvicorn in un unico container leggero.

---

## 🚀 Avvio Rapido

### Prerequisiti
- **Docker** e **Docker Compose**
- Porta locale `8080` libera

### Esecuzione

```bash
# 1. Clona il repository
git clone <repository-url>
cd CrypTool

# 2. Avvia il container unico
docker compose up --build
```

**Accesso Immediato:**
- 🌐 **Interfaccia Web del Laboratorio**: [http://localhost:8080](http://localhost:8080)
- 📘 **Documentazione API Interattiva (Swagger)**: [http://localhost:8080/docs](http://localhost:8080/docs)

### Arresto

```bash
docker compose down
```

---

## 🧪 I 10 Tool del Laboratorio

| # | Sezione | Strumento / Algoritmo | Funzionalità Principali | Simulazione Attacco / Difesa |
|---|---------|-----------------------|-------------------------|------------------------------|
| 1 | **Storico** | Cifrario di Cesare | Cifratura/Decifratura con shift | Brute Force (25 combinazioni) |
| 2 | **Storico** | Cifrario di Vigenère | Cifratura polialfabetica con chiave | Dictionary Attack |
| 3 | **Storico/Hash** | MD5 & SHA-1 vs SHA-256 | Calcolo impronte crittografiche | Dictionary Preimage Attack |
| 4 | **Moderno** | Bcrypt | Password hashing con salt automatico | Benchmark Cost Factor (misura tempi) |
| 5 | **Moderno** | AES-256-GCM | Cifratura/Decifratura file autenticata | Protezione da tampering/bit-flipping |
| 6 | **Moderno** | RSA (1024-4096 bit) | Coppie chiavi PEM, crittografia OAEP | Violabile da computer quantistici |
| 7 | **Quantistico** | BB84 QKD | Trasmissione fotoni polarizzati (Alice/Bob) | Intercettazione Man-in-the-Middle (Eve) con QBER |
| 8 | **Quantistico** | Algoritmo di Shor | Quantum Order-Finding per fattorizzazione | Fattorizzazione RSA in tempo polinomiale & Grover Matrix |
| 9 | **Post-Quantum** | ML-KEM (Kyber) | FIPS 203 Key Encapsulation (512/768/1024) | Scambio chiavi resistente a Shor |
| 10 | **Post-Quantum** | ML-DSA (Dilithium) | FIPS 204 Firme Digitali (44/65/87) | Firme e verifiche anti-manomissione |

---

## 🔗 API Reference

L'API REST FastAPI offre oltre 18 endpoint documentati:
- `/api/caesar` & `/api/caesar/bruteforce`
- `/api/vigenere` & `/api/vigenere/dictionaryattack`
- `/api/hash` & `/api/hash/dictionaryattack`
- `/api/hash/bcrypt` & `/api/hash/bcrypt-verify`
- `/api/aes/encrypt-file` & `/api/aes/decrypt-file`
- `/api/rsa/generate`, `/api/rsa/encrypt`, `/api/rsa/decrypt`
- `/api/quantum/bb84`, `/api/quantum/shor`, `/api/quantum/grover`
- `/api/pqc/ml-kem/keygen`, `/api/pqc/ml-kem/encapsulate`, `/api/pqc/ml-kem/decapsulate`
- `/api/pqc/ml-dsa/keygen`, `/api/pqc/ml-dsa/sign`, `/api/pqc/ml-dsa/verify`

Documentazione completa visualizzabile su [http://localhost:8080/docs](http://localhost:8080/docs).
