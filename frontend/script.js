document.addEventListener('DOMContentLoaded', function () {
    // API base URL
    const API_BASE_URL = 'http://localhost:8080';

    // Initialize Bootstrap tabs
    const tabElements = document.querySelectorAll('#cryptoTabs button');
    tabElements.forEach(tab => {
        tab.addEventListener('click', (event) => {
            const activeTabId = event.target.id;

            // Hide all result containers when switching tabs
            document.querySelectorAll('.result-container, .bruteforce-result-container, .dictionary-result-container').forEach(container => {
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
            document.querySelector('#caesar .result-container').classList.remove('d-none');

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
            document.querySelector('#vigenere .result-container').classList.remove('d-none');

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
            document.querySelector('#hash .result-container').classList.remove('d-none');

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
            const resultsTableBody = document.getElementById('hashDictionaryResults');
            const timeElement = document.getElementById('hashDictionaryTime');

            timeElement.textContent = `Completato in ${data.total_ms} s`;

            resultsTableBody.innerHTML = '';

            if (data.results.length === 0) {
                const row = document.createElement('tr');
                const messageCell = document.createElement('td');
                messageCell.textContent = 'Nessuna corrispondenza trovata';
                messageCell.colSpan = 2;
                messageCell.className = 'text-center';
                row.appendChild(messageCell);
                resultsTableBody.appendChild(row);
            } else {
                data.results.forEach(result => {
                    const row = document.createElement('tr');
                    const textCell = document.createElement('td');
                    textCell.textContent = result.text;
                    const hashCell = document.createElement('td');
                    hashCell.textContent = result.hash;
                    row.appendChild(textCell);
                    row.appendChild(hashCell);
                    resultsTableBody.appendChild(row);
                });
            }

            resultsContainer.classList.remove('d-none');

            showToast('Simulazione attacco avvenuta con successo');
        } catch (error) {
            console.error('Error:', error);
            showToast('Si è verificato un errore', true);
        }
    });

    // File encryption
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

            const response = await fetch(`${API_BASE_URL}/api/encrypt-file`, {
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

    // File decryption
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

            const response = await fetch(`${API_BASE_URL}/api/decrypt-file`, {
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
