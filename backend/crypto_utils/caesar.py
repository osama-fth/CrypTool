def encrypt(text: str, shift: int) -> str:
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
    return encrypt(text, -shift)
