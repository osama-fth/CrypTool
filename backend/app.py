from fastapi import FastAPI, Form, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from crypto_utils import caesar, vigenere, hashutils, aes_file, rsa
import io
import time

app = FastAPI(title="CrypTool API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://0.0.0.0:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/caesar")
async def caesar_api(text: str = Form(...), shift: int = Form(...), decode: bool = Form(False)):
    """
    Cifra o decifra un testo utilizzando il cifrario di Cesare.
    - text: testo in input
    - shift: scorrimento dell'alfabeto (1-25)
    - decode: True per decifrare, False per cifrare
    """
    try:
        result = caesar.decrypt(text, shift) if decode else caesar.encrypt(text, shift)
        return {"result": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore: {str(e)}")

@app.post("/api/caesar/bruteforce")
async def caesar_bruteforce(ciphertext: str = Form(...)):
    """
    Simula un attacco brute force sul cifrario di Cesare.
    Prova tutti i 25 possibili shift e restituisce tutti i risultati.
    - ciphertext: testo cifrato da attaccare
    """
    try:
        start = time.perf_counter()
        results = []
        for s in range(1,26):
            results.append({"shift": s, "plaintext": caesar.decrypt(ciphertext, s)})
        total_ms = round((time.perf_counter() - start), 6)
        return {"total_ms": total_ms, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore durante il brute force: {str(e)}")

@app.post("/api/vigenere")
async def vigenere_api(text: str = Form(...), key: str = Form(...), decode: bool = Form(False)):
    """
    Cifra o decifra un testo utilizzando il cifrario di Vigenère.
    - text: testo in input
    - key: chiave alfabetica (es: "CHIAVE")
    - decode: True per decifrare, False per cifrare
    """
    try:
        if decode:
            result = vigenere.decrypt(text, key)
        else:
            result = vigenere.encrypt(text, key)
        return {"result": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore: {str(e)}")

@app.post("/api/vigenere/dictionaryattack")
async def vigenere_dictionary_attack(text: str = Form(...), dictionary: str = Form(...)):
    """
    Simula un attacco a dizionario sul cifrario di Vigenère.
    Prova tutte le parole del dizionario come possibili chiavi.
    - text: testo cifrato da attaccare
    - dictionary: elenco di chiavi da provare (una per riga)
    """
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
            except:
                continue
               
        total_ms = round((time.perf_counter() - start), 6)  
        return {"total_ms": total_ms, "results": results}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore durante l'attacco: {str(e)}")

@app.post("/api/hash")
async def hash_api(text: str = Form(...), algorithm: str = Form("sha256")):
    """
    Calcola l'hash di un testo utilizzando l'algoritmo specificato.
    - text: testo da hashare
    - algorithm: md5, sha1 o sha256 (default: sha256)
    """
    try:
        result = hashutils.hash(text, algorithm)
        return {"result": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore: {str(e)}")

@app.post("/api/hash/dictionaryattack")
async def hash_dictionary_attack(hash: str = Form(...), algorithm: str = Form("sha256"), dictionary: str = Form(...)):
    """
    Simula un attacco a dizionario su un hash.
    Cerca una parola del dizionario che produca l'hash target.
    - hash: hash target da trovare
    - algorithm: algoritmo usato per l'hash (md5, sha1, sha256)
    - dictionary: elenco di parole da provare (una per riga)
    """
    try:
        start = time.perf_counter()
        results = []
        
        words = [line.strip() for line in dictionary.splitlines() if line.strip()]
        words = list(dict.fromkeys(words))
        
        if not words:
            raise ValueError("Dizionario vuoto")
        
        for key in words:
            if (hashutils.hash(key, algorithm) == hash):
                results.append({"text": key, "hash": hash})
                break
               
        total_ms = round((time.perf_counter() - start), 6)  
        return {"total_ms": total_ms, "results": results}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore durante l'attacco: {str(e)}")

@app.post("/api/hash/bcrypt")
async def bcrypt_multi(password: str = Form(...), rounds1: int = Form(10), rounds2: int = Form(12), rounds3: int = Form(14)):
    """
    Genera 3 hash bcrypt della stessa password con cost factor diversi e misura il tempo di generazione.
    - password: password da hashare
    - rounds1, rounds2, rounds3: cost factor per i 3 hash (default: 10, 12, 14)
    """
    try:
        results = []
        for rounds in (rounds1, rounds2, rounds3):
            t0 = time.perf_counter()
            h = hashutils.bcrypt_hash(password, rounds)
            t_ms = round((time.perf_counter() - t0), 6)
            results.append({"rounds": rounds, "hash": h, "time_ms": t_ms})

        return { "bcrypt": results}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore: {str(e)}")

@app.post("/api/hash/bcrypt-verify")
async def bcrypt_verify_endpoint(password: str = Form(...), hashedPassword: str = Form(...)):
    """
    Verifica se una password corrisponde a un hash bcrypt fornito.
    - password: password in chiaro da verificare
    - hashedPassword: hash bcrypt da confrontare
    Restituisce True se la password corrisponde, False altrimenti.
    """
    try:
        ok = hashutils.bcrypt_verify(password, hashedPassword)
        return {"verified": ok}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore: {str(e)}")

@app.post("/api/aes/encrypt-file")
async def encrypt_file(file: UploadFile = File(...), password: str = Form(...)):
    content = await file.read() 
    encrypted_bytes = aes_file.encrypt_bytes(content, password)
    await file.close()
    return StreamingResponse(
        io.BytesIO(encrypted_bytes),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={file.filename}.enc"}
    )

@app.post("/api/aes/decrypt-file")
async def decrypt_file(file: UploadFile = File(...), password: str = Form(...)):
    content = await file.read()
    decrypted_bytes = aes_file.decrypt_bytes(content, password)
    await file.close()
    original_name = file.filename.replace(".enc", "")
    return StreamingResponse(
        io.BytesIO(decrypted_bytes),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={original_name}"}
    )

@app.post("/api/rsa/generate")
async def generate_keys(key_size: int = Form(2048)):
    private_key, public_key = rsa.generate(key_size)
    return {"private_key": private_key, "public_key": public_key}

@app.post("/api/rsa/encrypt")
async def encrypt_text(public_key: str = Form(...), message: str = Form(...)):
    ciphertext = rsa.encrypt(public_key, message)
    return {"ciphertext": ciphertext}

@app.post("/api/rsa/decrypt")
async def decrypt_text(private_key: str = Form(...), ciphertext: str = Form(...)):
    plaintext = rsa.decrypt(private_key, ciphertext)
    return {"plaintext": plaintext}
