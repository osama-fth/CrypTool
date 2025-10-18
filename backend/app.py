from fastapi import FastAPI, Form
from crypto_utils import caesar, vigenere

app = FastAPI(title="CrypTool API")

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
