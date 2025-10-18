import hashlib

def hash(text: str, algorithm: str = "sha256") -> str:
    algorithm = algorithm.lower()
    if algorithm not in ("md5", "sha1", "sha256"):
        raise ValueError("Algoritmo non supportato")
    
    h = hashlib.new(algorithm)
    h.update(text.encode("utf-8"))
    return h.hexdigest()
