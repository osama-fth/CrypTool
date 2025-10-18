def char_to_shift(ch: str) -> int:
    if ch.isalpha():
        return ord(ch.lower()) - ord('a')
    return 0 

def encrypt(text: str, key: str) -> str:
    result = ""
    key = key.lower()
    ki = 0
    for ch in text:
        if ch.islower():
            shift = char_to_shift(key[ki % len(key)])
            result += chr((ord(ch) - ord('a') + shift) % 26 + ord('a'))
            ki += 1
        elif ch.isupper():
            shift = char_to_shift(key[ki % len(key)])
            result += chr((ord(ch) - ord('A') + shift) % 26 + ord('A'))
            ki += 1
        elif ch.isdigit():
            shift = char_to_shift(key[ki % len(key)]) % 10
            result += chr((ord(ch) - ord('0') + shift) % 10 + ord('0'))
            ki += 1
        else:
            result += ch
    return result

def decrypt(text: str, key: str) -> str:
    result = ""
    key = key.lower()
    ki = 0
    for ch in text:
        if ch.islower():
            shift = char_to_shift(key[ki % len(key)])
            result += chr((ord(ch) - ord('a') - shift) % 26 + ord('a'))
            ki += 1
        elif ch.isupper():
            shift = char_to_shift(key[ki % len(key)])
            result += chr((ord(ch) - ord('A') - shift) % 26 + ord('A'))
            ki += 1
        elif ch.isdigit():
            shift = char_to_shift(key[ki % len(key)]) % 10
            result += chr((ord(ch) - ord('0') - shift) % 10 + ord('0'))
            ki += 1
        else:
            result += ch
    return result
