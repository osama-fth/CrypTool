from fastapi import FastAPI, Form, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from crypto_utils import caesar, vigenere, hashutils, aes_file
import io

app = FastAPI(title="CrypTool API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

@app.post("/api/caesar")
async def caesar_api(text: str = Form(...), shift: int = Form(...), decode: bool = Form(False)):
    if decode:
        result = caesar.decrypt(text, shift)
    else:
        result = caesar.encrypt(text, shift)
    return {"result": result}

@app.post("/api/vigenere")
async def vigenere_api(text: str = Form(...), key: str = Form(...), decode: bool = Form(False)):
    if decode:
        result = vigenere.decrypt(text, key)
    else:
        result = vigenere.encrypt(text, key)
    return {"result": result}

@app.post("/api/hash")
async def hash_api(text: str = Form(...), algorithm: str = Form("sha256")):
    result = hashutils.hash(text, algorithm)
    return {"result": result}

@app.post("/api/encrypt-file")
async def encrypt_file(file: UploadFile = File(...), password: str = Form(...)):
    content = await file.read() 
    encrypted_bytes = aes_file.encrypt_bytes(content, password)
    await file.close()
    return StreamingResponse(
        io.BytesIO(encrypted_bytes),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={file.filename}.enc"}
    )

@app.post("/api/decrypt-file")
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
