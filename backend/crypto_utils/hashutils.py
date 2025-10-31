import hashlib, bcrypt

def hash(text: str, algorithm: str = "sha256") -> str:
    algorithm = algorithm.lower()
    if algorithm not in ("md5", "sha1", "sha256"):
        raise ValueError("Algoritmo non supportato")
    
    h = hashlib.new(algorithm)
    h.update(text.encode("utf-8"))
    return h.hexdigest()

def bcrypt_hash(password: str, rounds: int = 12) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds)).decode("utf-8")

def bcrypt_verify(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
