from fastapi import FastAPI, Form, UploadFile, File, Body
from fastapi.responses import StreamingResponse
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
    result = caesar.decrypt(text, shift) if decode else caesar.encrypt(text, shift)
    return {"result": result}

@app.post("/api/caesar/bruteforce")
async def caesar_bruteforce(ciphertext: str = Form(...)):
    start = time.perf_counter()
    results = []
    for s in range(1,26):
        results.append({"shift": s, "plaintext": caesar.decrypt(ciphertext, s)})
    total_ms = round((time.perf_counter() - start), 6)
    return {"total_ms": total_ms, "results": results}

@app.post("/api/vigenere")
async def vigenere_api(text: str = Form(...), key: str = Form(...), decode: bool = Form(False)):
    if decode:
        result = vigenere.decrypt(text, key)
    else:
        result = vigenere.encrypt(text, key)
    return {"result": result}

@app.post("/api/vigenere/dictionaryattack")
async def vigenere_dictionary_attack(text: str = Form(...), dictionary: str = Form(...)):
    start = time.perf_counter()
    results = []
    
    words = [line.strip() for line in dictionary.splitlines() if line.strip()]
    words = list(dict.fromkeys(words))
    
    for key in words:
        decrypted = vigenere.decrypt(text, key)
        results.append({"key": key, "plaintext": decrypted})
           
    total_ms = round((time.perf_counter() - start), 6)  
    return {"total_ms": total_ms, "results": results}

@app.post("/api/hash")
async def hash_api(text: str = Form(...), algorithm: str = Form("sha256")):
    result = hashutils.hash(text, algorithm)
    return {"result": result}

@app.post("/api/hash/dictionaryattack")
async def hash_dictionary_attack(hash: str = Form(...), algorithm: str = Form("sha256"), dictionary: str = Form(...)):
    start = time.perf_counter()
    results = []
    
    words = [line.strip() for line in dictionary.splitlines() if line.strip()]
    words = list(dict.fromkeys(words))
    
    for key in words:
        if (hashutils.hash(key, algorithm) == hash):
            results.append({"text": key, "hash": hash})
            break
           
    total_ms = round((time.perf_counter() - start), 6)  
    return {"total_ms": total_ms, "results": results}

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
