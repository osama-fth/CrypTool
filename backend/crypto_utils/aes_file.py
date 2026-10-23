from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

def _derive_key(password: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    return kdf.derive(password.encode())

def encrypt_bytes(data: bytes, password: str) -> bytes:
    salt = os.urandom(16)
    key = _derive_key(password, salt)
    nonce = os.urandom(12)  # 96-bit nonce standard per AES-GCM
    aesgcm = AESGCM(key)
    ciphertext_and_tag = aesgcm.encrypt(nonce, data, None)
    return salt + nonce + ciphertext_and_tag

def decrypt_bytes(data: bytes, password: str) -> bytes:
    if len(data) < 28:
        raise ValueError("File cifrato corrotto o formato non valido.")
    salt = data[:16]
    nonce = data[16:28]
    ciphertext_and_tag = data[28:]
    key = _derive_key(password, salt)
    aesgcm = AESGCM(key)
    try:
        return aesgcm.decrypt(nonce, ciphertext_and_tag, None)
    except Exception as e:
        raise ValueError("Decifratura fallita: password errata o file manomesso/corrotto.")
