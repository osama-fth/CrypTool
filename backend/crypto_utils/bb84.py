"""
Modulo di simulazione del protocollo BB84 (Quantum Key Distribution).
Dimostra lo scambio quantistico di chiavi tra Alice e Bob con rilevazione di intercettazioni (Eve)
basato sul principio di indeterminazione di Heisenberg e sul teorema di no-cloning.
"""
import random
from typing import Dict, Any, List

def simulate_bb84(num_bits: int = 32, eve_present: bool = False) -> Dict[str, Any]:
    if not (8 <= num_bits <= 128):
        raise ValueError("Il numero di bit deve essere compreso tra 8 e 128")

    # 1. Alice sceglie bit casuali e basi casuali ('+' = standard/computational Z, 'x' = diagonale X)
    alice_bits = [random.randint(0, 1) for _ in range(num_bits)]
    alice_bases = [random.choice(['+', 'x']) for _ in range(num_bits)]

    bob_bases = [random.choice(['+', 'x']) for _ in range(num_bits)]
    bob_measurements = []
    eve_bases = []
    eve_measurements = []

    # 2. Trasmissione quantistica (fotoni polarizzati)
    for i in range(num_bits):
        bit_sent = alice_bits[i]
        basis_sent = alice_bases[i]

        # Se Eve intercetta (Man-in-the-Middle)
        if eve_present:
            e_base = random.choice(['+', 'x'])
            eve_bases.append(e_base)
            if e_base == basis_sent:
                e_bit = bit_sent
            else:
                # Base errata: collasso casuale
                e_bit = random.randint(0, 1)
            eve_measurements.append(e_bit)

            # Eve ritrasmette il fotone a Bob usando la sua base di misura
            state_bit = e_bit
            state_base = e_base
        else:
            state_bit = bit_sent
            state_base = basis_sent

        # Bob misura il fotone nella sua base
        if bob_bases[i] == state_base:
            bob_measurements.append(state_bit)
        else:
            # Base diversa: risultato 0 o 1 con probabilità 50%
            bob_measurements.append(random.randint(0, 1))

    # 3. Canale pubblico classico: confronto delle basi (Sifting)
    matching_indices = [i for i in range(num_bits) if alice_bases[i] == bob_bases[i]]

    alice_sifted = [alice_bits[i] for i in matching_indices]
    bob_sifted = [bob_measurements[i] for i in matching_indices]

    # 4. Calcolo del QBER (Quantum Bit Error Rate)
    errors = sum(1 for a, b in zip(alice_sifted, bob_sifted) if a != b)
    total_sifted = len(alice_sifted)
    error_rate = round((errors / total_sifted) if total_sifted > 0 else 0.0, 4)

    # In BB84, se il QBER supera una certa soglia (tipicamente ~11%), si presume la presenza di Eve
    eve_detected = error_rate > 0.11 or (eve_present and errors > 0)

    # Se non c'è Eve (o non è rilevata), i bit corretti formano la chiave
    shared_key_bits = [str(b) for a, b in zip(alice_sifted, bob_sifted) if a == b]
    shared_key_hex = hex(int("".join(shared_key_bits), 2))[2:] if shared_key_bits else ""

    steps = [
        {
            "step": 1,
            "title": "Preparazione quantistica di Alice",
            "description": f"Alice ha generato {num_bits} bit casuali e selezionato per ciascuno una base di polarizzazione (+ o x)."
        },
        {
            "step": 2,
            "title": "Canale quantistico" + (" (Intercettazione di Eve attiva!)" if eve_present else " (Canale sicuro)"),
            "description": "Eve ha misurato e ricodificato i fotoni alterandone lo stato quantistico." if eve_present else "I singoli fotoni viaggiano senza disturbi fino a Bob."
        },
        {
            "step": 3,
            "title": "Misura di Bob",
            "description": f"Bob misura ogni fotone scegliendo basi casuali in modo indipendente."
        },
        {
            "step": 4,
            "title": "Setacciamento (Sifting) su canale pubblico",
            "description": f"Alice e Bob confrontano pubblicamente solo le basi. {total_sifted} su {num_bits} basi coincidevano ({(total_sifted/num_bits*100):.1f}%)."
        },
        {
            "step": 5,
            "title": "Stima del tasso d'errore (QBER)",
            "description": f"Tasso di errore riscontrato: {(error_rate*100):.1f}%. Soglia di allarme teorica: 11%. {'ALLARME EVE RILEVATA: Comunicazione scartata!' if eve_detected else 'Nessuna spia rilevata: Chiave valida.'}"
        }
    ]

    return {
        "num_bits": num_bits,
        "eve_present": eve_present,
        "alice_bits": alice_bits,
        "alice_bases": alice_bases,
        "bob_bases": bob_bases,
        "bob_measurements": bob_measurements,
        "eve_bases": eve_bases if eve_present else [],
        "eve_measurements": eve_measurements if eve_present else [],
        "matching_indices": matching_indices,
        "alice_sifted": "".join(map(str, alice_sifted)),
        "bob_sifted": "".join(map(str, bob_sifted)),
        "error_count": errors,
        "error_rate": error_rate,
        "eve_detected": eve_detected,
        "shared_key_hex": shared_key_hex if not eve_detected else "CHIAVE_COMPROMESSA_SCARTATA",
        "steps": steps
    }

