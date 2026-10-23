from fastapi import FastAPI, Form, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from crypto_utils import caesar, vigenere, hashutils, aes_file, rsa, bb84, shor, grover, ml_kem, ml_dsa
import io
import time

app = FastAPI(
    title="CrypTool API - Laboratorio di Crittografia Classica, Moderna, Quantistica e Post-Quantistica",
    description="API interattiva per l'esplorazione e l'analisi di cifrari storici, moderni e standard post-quantistici NIST FIPS 203/204.",
    version="2.0.0"
)

# Nginx gestisce il reverse proxy sulla stessa origine.
# Qui si limitano i metodi e si disabilitano le credenziali con origine jolly.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# --- 1. Algoritmi Classici ---

@app.post("/api/caesar", tags=["Classici"])
async def caesar_api(text: str = Form(...), shift: int = Form(...), decode: bool = Form(False)):
    try:
        result = caesar.decrypt(text, shift) if decode else caesar.encrypt(text, shift)
        return {"result": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore: {str(e)}")

@app.post("/api/caesar/bruteforce", tags=["Classici"])
async def caesar_bruteforce(ciphertext: str = Form(...)):
    try:
        start = time.perf_counter()
        results = []
        for s in range(1, 26):
            results.append({"shift": s, "plaintext": caesar.decrypt(ciphertext, s)})
        total_seconds = round((time.perf_counter() - start), 6)
        return {"total_seconds": total_seconds, "total_ms": total_seconds, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore durante il brute force: {str(e)}")

@app.post("/api/vigenere", tags=["Classici"])
async def vigenere_api(text: str = Form(...), key: str = Form(...), decode: bool = Form(False)):
    try:
        result = vigenere.decrypt(text, key) if decode else vigenere.encrypt(text, key)
        return {"result": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore: {str(e)}")

@app.post("/api/vigenere/dictionaryattack", tags=["Classici"])
async def vigenere_dictionary_attack(text: str = Form(...), dictionary: str = Form(...)):
    try:
        start = time.perf_counter()
        results = []
        words = [line.strip() for line in dictionary.splitlines() if line.strip()]
        words = list(dict.fromkeys(words))
        if not words:
            raise ValueError("Dizionario vuoto")
        for key in words:
            try:
                decrypted = vigenere.decrypt(text, key)
                results.append({"key": key, "plaintext": decrypted})
            except Exception:
                continue
        total_seconds = round((time.perf_counter() - start), 6)
        return {"total_seconds": total_seconds, "total_ms": total_seconds, "results": results}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore durante l'attacco: {str(e)}")

# --- 2. Funzioni di Hash e Cifrari Moderni ---

@app.post("/api/hash", tags=["Hash"])
async def hash_api(text: str = Form(...), algorithm: str = Form("sha256")):
    try:
        result = hashutils.hash(text, algorithm)
        return {"result": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore: {str(e)}")

@app.post("/api/hash/dictionaryattack", tags=["Hash"])
async def hash_dictionary_attack(hash: str = Form(...), algorithm: str = Form("sha256"), dictionary: str = Form(...)):
    try:
        start = time.perf_counter()
        results = []
        words = [line.strip() for line in dictionary.splitlines() if line.strip()]
        words = list(dict.fromkeys(words))
        if not words:
            raise ValueError("Dizionario vuoto")
        for key in words:
            if hashutils.hash(key, algorithm) == hash:
                results.append({"text": key, "hash": hash})
                break
        total_seconds = round((time.perf_counter() - start), 6)
        return {"total_seconds": total_seconds, "total_ms": total_seconds, "results": results}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore durante l'attacco: {str(e)}")

@app.post("/api/hash/bcrypt", tags=["Hash"])
async def bcrypt_multi(password: str = Form(...), rounds1: int = Form(10), rounds2: int = Form(12), rounds3: int = Form(14)):
    try:
        results = []
        for rounds in (rounds1, rounds2, rounds3):
            t0 = time.perf_counter()
            h = hashutils.bcrypt_hash(password, rounds)
            t_sec = round((time.perf_counter() - t0), 4)
            results.append({"rounds": rounds, "hash": h, "time_ms": t_sec})
        return {"bcrypt": results}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore: {str(e)}")

@app.post("/api/hash/bcrypt-verify", tags=["Hash"])
async def bcrypt_verify_endpoint(password: str = Form(...), hashedPassword: str = Form(...)):
    try:
        ok = hashutils.bcrypt_verify(password, hashedPassword)
        return {"verified": ok}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore: {str(e)}")

@app.post("/api/aes/encrypt-file", tags=["Moderni"])
async def encrypt_file(file: UploadFile = File(...), password: str = Form(...)):
    max_size = 10 * 1024 * 1024
    content = await file.read()
    if len(content) > max_size:
        await file.close()
        raise HTTPException(status_code=400, detail="Dimensione massima file superata (limite: 10MB).")
    try:
        encrypted_bytes = aes_file.encrypt_bytes(content, password)
        await file.close()
        return StreamingResponse(
            io.BytesIO(encrypted_bytes),
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={file.filename}.enc"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore durante cifratura: {str(e)}")

@app.post("/api/aes/decrypt-file", tags=["Moderni"])
async def decrypt_file(file: UploadFile = File(...), password: str = Form(...)):
    max_size = 10 * 1024 * 1024
    content = await file.read()
    if len(content) > max_size:
        await file.close()
        raise HTTPException(status_code=400, detail="Dimensione massima file superata (limite: 10MB).")
    try:
        decrypted_bytes = aes_file.decrypt_bytes(content, password)
        await file.close()
        original_name = file.filename.replace(".enc", "") if file.filename.endswith(".enc") else f"decrypted_{file.filename}"
        return StreamingResponse(
            io.BytesIO(decrypted_bytes),
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={original_name}"}
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore durante decifratura: {str(e)}")

@app.post("/api/rsa/generate", tags=["Moderni"])
async def generate_keys(key_size: int = Form(2048)):
    try:
        private_key, public_key = rsa.generate(key_size)
        return {"private_key": private_key, "public_key": public_key}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore generazione chiavi RSA: {str(e)}")

@app.post("/api/rsa/encrypt", tags=["Moderni"])
async def encrypt_text(public_key: str = Form(...), message: str = Form(...)):
    try:
        ciphertext = rsa.encrypt(public_key, message)
        return {"ciphertext": ciphertext}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Errore cifratura RSA: {str(e)}")

@app.post("/api/rsa/decrypt", tags=["Moderni"])
async def decrypt_text(private_key: str = Form(...), ciphertext: str = Form(...)):
    try:
        plaintext = rsa.decrypt(private_key, ciphertext)
        return {"plaintext": plaintext}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Errore decifratura RSA: {str(e)}")

# --- 3. Crittografia Quantistica e Attacchi ---

@app.post("/api/quantum/bb84", tags=["Quantistica"])
async def bb84_endpoint(num_bits: int = Form(32), eve_present: bool = Form(False)):
    try:
        result = bb84.simulate_bb84(num_bits, eve_present)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore nella simulazione BB84: {str(e)}")

@app.post("/api/quantum/shor", tags=["Quantistica"])
async def shor_endpoint(rsa_bits: int = Form(14)):
    try:
        result = shor.attack_rsa_with_shor(rsa_bits)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore durante simulazione Shor: {str(e)}")

@app.get("/api/quantum/grover", tags=["Quantistica"])
async def grover_endpoint():
    try:
        return grover.get_grover_impact_analysis()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore recupero dati Grover: {str(e)}")

# --- 4. Standard Post-Quantistici (NIST FIPS 203/204) ---

@app.post("/api/pqc/ml-kem/keygen", tags=["Post-Quantum"])
async def mlkem_keygen(security_level: int = Form(768)):
    try:
        return ml_kem.generate_keypair(security_level)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore ML-KEM keygen: {str(e)}")

@app.post("/api/pqc/ml-kem/encapsulate", tags=["Post-Quantum"])
async def mlkem_encapsulate(public_key_hex: str = Form(...), security_level: int = Form(768)):
    try:
        return ml_kem.encapsulate(public_key_hex.strip(), security_level)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Errore ML-KEM incapsulamento: {str(e)}")

@app.post("/api/pqc/ml-kem/decapsulate", tags=["Post-Quantum"])
async def mlkem_decapsulate(secret_key_hex: str = Form(...), ciphertext_hex: str = Form(...), security_level: int = Form(768)):
    try:
        return ml_kem.decapsulate(secret_key_hex.strip(), ciphertext_hex.strip(), security_level)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Errore ML-KEM decapsulamento: {str(e)}")

@app.post("/api/pqc/ml-dsa/keygen", tags=["Post-Quantum"])
async def mldsa_keygen(security_level: int = Form(65)):
    try:
        return ml_dsa.generate_keypair(security_level)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore ML-DSA keygen: {str(e)}")

@app.post("/api/pqc/ml-dsa/sign", tags=["Post-Quantum"])
async def mldsa_sign(secret_key_hex: str = Form(...), message: str = Form(...), security_level: int = Form(65)):
    try:
        return ml_dsa.sign(secret_key_hex.strip(), message, security_level)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Errore ML-DSA firma: {str(e)}")

@app.post("/api/pqc/ml-dsa/verify", tags=["Post-Quantum"])
async def mldsa_verify(public_key_hex: str = Form(...), message: str = Form(...), signature_hex: str = Form(...), security_level: int = Form(65)):
    try:
        return ml_dsa.verify(public_key_hex.strip(), message, signature_hex.strip(), security_level)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Errore ML-DSA verifica: {str(e)}")
