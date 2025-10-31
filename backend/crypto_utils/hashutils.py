import hashlib
import bcrypt

def hash(text: str, algorithm: str = "sha256") -> str:
    """
    Calcola l'hash di un testo.
    Solleva ValueError se l'algoritmo non è supportato.
    """
    algorithm = algorithm.lower()
    
    if algorithm not in ["md5", "sha1", "sha256"]:
        raise ValueError(f"Algoritmo non supportato: {algorithm}. Usa md5, sha1 o sha256")
    
    try:
        if algorithm == "md5":
            return hashlib.md5(text.encode()).hexdigest()
        elif algorithm == "sha1":
            return hashlib.sha1(text.encode()).hexdigest()
        elif algorithm == "sha256":
            return hashlib.sha256(text.encode()).hexdigest()
    except Exception as e:
        raise RuntimeError(f"Errore durante il calcolo dell'hash: {str(e)}")

def bcrypt_hash(password: str, rounds: int = 12) -> str:
    """
    Genera un hash bcrypt.
    Solleva ValueError se rounds non è valido.
    """
    
    if not (4 <= rounds <= 31):
        raise ValueError("Rounds deve essere compreso tra 4 e 31")
    
    try:
        salt = bcrypt.gensalt(rounds=rounds)
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    except Exception as e:
        raise RuntimeError(f"Errore durante la generazione dell'hash bcrypt: {str(e)}")

def bcrypt_verify(password: str, hashed_password: str) -> bool:
    """
    Verifica una password contro un hash bcrypt.
    Solleva ValueError se l'hash non è valido.
    """
    if not hashed_password or not isinstance(hashed_password, str):
        raise ValueError("Hash bcrypt non valido")
    if not hashed_password.startswith(('$2a$', '$2b$', '$2y$')):
        raise ValueError("Formato hash bcrypt non valido (deve iniziare con $2a$, $2b$ o $2y$)")
    
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception as e:
        raise RuntimeError(f"Errore durante la verifica dell'hash bcrypt: {str(e)}")
