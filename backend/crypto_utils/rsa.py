from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes, serialization
import base64

def generate(key_size: int) -> (str, str):
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=key_size)
    public_key = private_key.public_key()

    priv_pem = private_key.private_bytes(
        serialization.Encoding.PEM,
        serialization.PrivateFormat.PKCS8,
        serialization.NoEncryption()
    ).decode()

    pub_pem = public_key.public_bytes(
        serialization.Encoding.PEM,
        serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode()

    return priv_pem, pub_pem

def encrypt(pub_pem: str, message: str) -> str:
    pub_pem = pub_pem.replace("\\n", "\n").strip()
    public_key = serialization.load_pem_public_key(pub_pem.encode())
    ciphertext = public_key.encrypt(
        message.encode(),
        padding.OAEP(
            mgf=padding.MGF1(hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return base64.b64encode(ciphertext).decode()

def decrypt(priv_pem: str, ciphertext_b64: str) -> str:
    priv_pem = priv_pem.replace("\\n", "\n").strip()
    private_key = serialization.load_pem_private_key(priv_pem.encode(), password=None)
    ciphertext = base64.b64decode(ciphertext_b64.encode())
    plaintext = private_key.decrypt(
        ciphertext,
        padding.OAEP(
            mgf=padding.MGF1(hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return plaintext.decode()
