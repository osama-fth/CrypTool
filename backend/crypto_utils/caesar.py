def encrypt(text: str, shift: int) -> str:
    """
    Cifra un testo con il cifrario di Cesare.
    Solleva ValueError se shift non è valido.
    """

    if not (1 <= shift <= 25):
        raise ValueError("Shift deve essere compreso tra 1 e 25")
    
    result = ""
    for ch in text:
        if ch.islower():
            result += chr((ord(ch) - ord('a') + shift) % 26 + ord('a'))
        elif ch.isupper():
            result += chr((ord(ch) - ord('A') + shift) % 26 + ord('A'))
        elif ch.isdigit():
            result += chr((ord(ch) - ord('0') + shift) % 10 + ord('0'))
        else:
            result += ch
    return result

def decrypt(text: str, shift: int) -> str:
    """
    Decifra un testo con il cifrario di Cesare.
    Solleva ValueError se shift non è valido.
    """
   
    if not (1 <= shift <= 25):
        raise ValueError("Shift deve essere compreso tra 1 e 25")
    
    return encrypt(text, 26 - shift)
