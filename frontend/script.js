document.addEventListener('DOMContentLoaded', function () {
    // API base URL
    const API_BASE_URL = 'http://localhost:8080';

    // Initialize Bootstrap tabs
    const tabElements = document.querySelectorAll('#cryptoTabs button');
    tabElements.forEach(tab => {
        tab.addEventListener('click', (event) => {
            const activeTabId = event.target.id;

            // Hide all result containers when switching tabs
            document.querySelectorAll('.result-container, .bruteforce-result-container, .dictionary-result-container, .hash-dictionary-result-container').forEach(container => {
                container.classList.add('d-none');
            });
        });
    });

    // Caesar cipher form
    const caesarForm = document.getElementById('caesarForm');
    caesarForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const text = document.getElementById('caesarText').value;
        const shift = parseInt(document.getElementById('caesarShift').value);
        const decode = document.getElementById('caesarDecode').checked;

        try {
            const formData = new FormData();
            formData.append('text', text);
            formData.append('shift', shift);
            formData.append('decode', decode);

            const response = await fetch(`${API_BASE_URL}/api/caesar`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            document.getElementById('caesarResult').textContent = data.result;
            document.querySelectorAll('.result-container')[0].classList.remove('d-none');

            showToast('Cifrario di Cesare elaborato con successo');
        } catch (error) {
            console.error('Error:', error);
            showToast('Si è verificato un errore', true);
        }
    });

    // Caesar Bruteforce form
    const caesarBruteforceForm = document.getElementById('caesarBruteforceForm');
    caesarBruteforceForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const text = document.getElementById('caesarBruteforceText').value;

        try {
            const formData = new FormData();
            formData.append('ciphertext', text);

            const response = await fetch(`${API_BASE_URL}/api/caesar/bruteforce`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            const resultsContainer = document.querySelector('.bruteforce-result-container');
            const resultsTableBody = document.getElementById('bruteforceResults');
            const timeElement = document.getElementById('bruteforceTime');

            timeElement.textContent = `Completato in ${data.total_ms} s`;

            resultsTableBody.innerHTML = '';

            data.results.forEach(result => {
                const row = document.createElement('tr');
                const shiftCell = document.createElement('td');
                shiftCell.textContent = result.shift;
                const textCell = document.createElement('td');
                textCell.textContent = result.plaintext;
                row.appendChild(shiftCell);
                row.appendChild(textCell);
                resultsTableBody.appendChild(row);
            });

            resultsContainer.classList.remove('d-none');

            showToast('Simulazione attacco avvenuta con successo');
        } catch (error) {
            console.error('Error:', error);
            showToast('Si è verificato un errore', true);
        }
    });

    // Vigenere cipher form
    const vigenereForm = document.getElementById('vigenereForm');
    vigenereForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const text = document.getElementById('vigenereText').value;
        const key = document.getElementById('vigenereKey').value;
        const decode = document.getElementById('vigenereDecode').checked;

        try {
            const formData = new FormData();
            formData.append('text', text);
            formData.append('key', key);
            formData.append('decode', decode);

            const response = await fetch(`${API_BASE_URL}/api/vigenere`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            document.getElementById('vigenereResult').textContent = data.result;
            document.querySelectorAll('.result-container')[1].classList.remove('d-none');

            showToast('Cifrario di Vigenère elaborato con successo');
        } catch (error) {
            console.error('Error:', error);
            showToast('Si è verificato un errore', true);
        }
    });

    // Vigenere Dictionary Attack form
    const vigenereDictionaryAttackForm = document.getElementById('vigenereDictionaryAttackForm');
    vigenereDictionaryAttackForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const text = document.getElementById('vigenereDictionaryText').value;
        const dictionary = document.getElementById('vigenereDictionary').value;

        try {
            const formData = new FormData();
            formData.append('text', text);
            formData.append('dictionary', dictionary);

            const response = await fetch(`${API_BASE_URL}/api/vigenere/dictionaryattack`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            const resultsContainer = document.querySelector('.dictionary-result-container');
            const resultsTableBody = document.getElementById('dictionaryResults');
            const timeElement = document.getElementById('dictionaryTime');

            timeElement.textContent = `Completato in ${data.total_ms} s`;

            resultsTableBody.innerHTML = '';

            data.results.forEach(result => {
                const row = document.createElement('tr');
                const shiftCell = document.createElement('td');
                shiftCell.textContent = result.key;
                const textCell = document.createElement('td');
                textCell.textContent = result.plaintext;
                row.appendChild(shiftCell);
                row.appendChild(textCell);
                resultsTableBody.appendChild(row);
            });

            resultsContainer.classList.remove('d-none');

            showToast('Simulazione attacco avvenuta con successo');
        } catch (error) {
            console.error('Error:', error);
            showToast('Si è verificato un errore', true);
        }
    });

    // Hash form
    const hashForm = document.getElementById('hashForm');
    hashForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const text = document.getElementById('hashText').value;
        const algorithm = document.getElementById('hashAlgorithm').value;

        try {
            const formData = new FormData();
            formData.append('text', text);
            formData.append('algorithm', algorithm);

            const response = await fetch(`${API_BASE_URL}/api/hash`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            document.getElementById('hashResult').textContent = data.result;
            // Corretto: usa querySelectorAll per prendere il terzo .result-container
            document.querySelectorAll('.result-container')[2].classList.remove('d-none');

            showToast('Hash calcolato con successo');
        } catch (error) {
            console.error('Error:', error);
            showToast('Si è verificato un errore', true);
        }
    });

    // Hash Dictionary Attack form
    const hashDictionaryAttackForm = document.getElementById('hashDictionaryAttackForm');
    hashDictionaryAttackForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const hash = document.getElementById('hashDictionaryText').value.trim();
        const algorithm = document.getElementById('hashDictionaryAttackAlgorithm').value;
        const dictionary = document.getElementById('hashDictionary').value;

        try {
            const formData = new FormData();
            formData.append('hash', hash);
            formData.append('algorithm', algorithm);
            formData.append('dictionary', dictionary);

            const response = await fetch(`${API_BASE_URL}/api/hash/dictionaryattack`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            const resultsContainer = document.querySelector('.hash-dictionary-result-container');
            const resultsDiv = document.getElementById('hashDictionaryResults');
            const timeElement = document.getElementById('hashDictionaryTime');

            timeElement.textContent = `Completato in ${data.total_ms} s`;

            resultsDiv.innerHTML = '';

            if (data.results.length === 0) {
                resultsDiv.innerHTML = `
                    <div class="alert alert-warning mb-0">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        <strong>Nessuna corrispondenza trovata</strong> nel dizionario fornito.
                    </div>
                `;
            } else {
                resultsDiv.innerHTML = `
                    <div class="alert alert-success mb-0">
                        <h6 class="alert-heading">
                            <i class="bi bi-check-circle-fill me-2"></i>Match trovato!
                        </h6>
                        <hr>
                        <p class="mb-1"><strong>Testo originale:</strong></p>
                        <pre class="mb-2 bg-white p-2 border rounded">${data.results[0].text}</pre>
                        <p class="mb-1"><strong>Hash:</strong></p>
                        <pre class="mb-0 bg-white p-2 border rounded" style="word-break: break-all;">${data.results[0].hash}</pre>
                    </div>
                `;
            }

            resultsContainer.classList.remove('d-none');

            showToast('Simulazione attacco avvenuta con successo');
        } catch (error) {
            console.error('Error:', error);
            showToast('Si è verificato un errore', true);
        }
    });

    // File aes encryption
    const encryptFileForm = document.getElementById('encryptFileForm');
    encryptFileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const file = document.getElementById('encryptFile').files[0];
        const password = document.getElementById('encryptPassword').value;

        if (!file) {
            showToast('Seleziona un file', true);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('password', password);

            const response = await fetch(`${API_BASE_URL}/api/aes/encrypt-file`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Errore nella cifratura del file');
            }

            const blob = await response.blob();
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${file.name}.enc`;
            downloadLink.click();

            showToast('File cifrato e scaricato con successo');
        } catch (error) {
            console.error('Error:', error);
            showToast('Si è verificato un errore durante la cifratura', true);
        }
    });

    // File aes decryption
    const decryptFileForm = document.getElementById('decryptFileForm');
    decryptFileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const file = document.getElementById('decryptFile').files[0];
        const password = document.getElementById('decryptPassword').value;

        if (!file) {
            showToast('Seleziona un file', true);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('password', password);

            const response = await fetch(`${API_BASE_URL}/api/aes/decrypt-file`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Errore nella decifratura del file');
            }

            const blob = await response.blob();
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = file.name.replace('.enc', '');
            downloadLink.click();

            showToast('File decifrato e scaricato con successo');
        } catch (error) {
            console.error('Error:', error);
            showToast('Si è verificato un errore durante la decifratura', true);
        }
    });

    // RSA: generazione chiavi
    const rsaKeygenForm = document.getElementById('rsaKeygenForm');
    if (rsaKeygenForm) {
        rsaKeygenForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const keySize = document.getElementById('rsaKeySize').value;

            try {
                const formData = new FormData();
                formData.append('key_size', keySize);

                const response = await fetch(`${API_BASE_URL}/api/rsa/generate`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                document.getElementById('rsaPublicKeyResult').textContent = data.public_key || '';
                document.getElementById('rsaPrivateKeyResult').textContent = data.private_key || '';
                document.getElementById('rsaKeygenResultContainer').classList.remove('d-none');

                showToast('Chiavi RSA generate con successo');
            } catch (error) {
                console.error('Error:', error);
                showToast('Errore durante la generazione delle chiavi', true);
            }
        });
    }

    // RSA: cifratura
    const rsaEncryptForm = document.getElementById('rsaEncryptForm');
    if (rsaEncryptForm) {
        rsaEncryptForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const publicKey = document.getElementById('rsaPublicKey').value.trim();
            const message = document.getElementById('rsaPlaintext').value;

            try {
                const formData = new FormData();
                formData.append('public_key', publicKey);
                formData.append('message', message);

                const response = await fetch(`${API_BASE_URL}/api/rsa/encrypt`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                document.getElementById('rsaEncryptResult').textContent = data.ciphertext || '';
                document.getElementById('rsaEncryptResultContainer').classList.remove('d-none');

                showToast('Testo cifrato con successo');
            } catch (error) {
                console.error('Error:', error);
                showToast('Errore durante la cifratura', true);
            }
        });
    }

    // RSA: decifratura
    const rsaDecryptForm = document.getElementById('rsaDecryptForm');
    if (rsaDecryptForm) {
        rsaDecryptForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const privateKey = document.getElementById('rsaPrivateKey').value.trim();
            const ciphertext = document.getElementById('rsaCiphertext').value;

            try {
                const formData = new FormData();
                formData.append('private_key', privateKey);
                formData.append('ciphertext', ciphertext);

                const response = await fetch(`${API_BASE_URL}/api/rsa/decrypt`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                document.getElementById('rsaDecryptResult').textContent = data.plaintext || '';
                document.getElementById('rsaDecryptResultContainer').classList.remove('d-none');

                showToast('Testo decifrato con successo');
            } catch (error) {
                console.error('Error:', error);
                showToast('Errore durante la decifratura', true);
            }
        });
    }

    // Toast notification helper
    function showToast(message, isError = false) {
        const toast = document.getElementById('resultToast');
        const toastBody = toast.querySelector('.toast-body');

        toastBody.textContent = message;

        if (isError) {
            toast.classList.remove('bg-success', 'text-white');
            toast.classList.add('bg-danger', 'text-white');
        } else {
            toast.classList.remove('bg-danger', 'text-white');
            toast.classList.add('bg-success', 'text-white');
        }

        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
});
