document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = window.location.origin.includes(':5173') ? 'http://localhost:8080' : '';

    // ==========================================
    // SIDEBAR SINGLE VIEW SWITCHER (NO SCROLL)
    // ==========================================
    const navButtons = document.querySelectorAll('.nav-item-btn');
    const toolViews = document.querySelectorAll('.tool-view');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetViewId = btn.getAttribute('data-view');
            navButtons.forEach(b => b.classList.remove('active'));
            toolViews.forEach(v => v.classList.remove('active'));

            btn.classList.add('active');
            const target = document.getElementById(targetViewId);
            if (target) {
                target.classList.add('active');
            }
        });
    });

    // ==========================================
    // 1. CESARE
    // ==========================================
    const caesarForm = document.getElementById('caesarForm');
    if (caesarForm) {
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

                const response = await fetch(`${API_BASE_URL}/api/caesar`, { method: 'POST', body: formData });
                const data = await response.json();
                document.getElementById('caesarResult').textContent = data.result;
                document.querySelector('#view-caesar .result-container').classList.remove('d-none');
                if (!decode) {
                    const bruteInput = document.getElementById('caesarCiphertext');
                    if (bruteInput) bruteInput.value = data.result;
                }
                showToast('Operazione Cesare completata');
            } catch (error) {
                console.error('[Caesar Error]', error);
                showToast('Errore Cesare', true);
            }
        });
    }

    const caesarBruteforceForm = document.getElementById('caesarBruteforceForm');
    if (caesarBruteforceForm) {
        caesarBruteforceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = document.getElementById('caesarCiphertext').value;

            try {
                const formData = new FormData();
                formData.append('ciphertext', text);

                const response = await fetch(`${API_BASE_URL}/api/caesar/bruteforce`, { method: 'POST', body: formData });
                const data = await response.json();

                const resultsContainer = document.querySelector('#view-caesar .bruteforce-result-container');
                const resultsContainerDiv = document.getElementById('caesarBruteforceResults');
                const timeElement = document.getElementById('caesarBruteforceTime');

                timeElement.textContent = `${data.total_ms || data.total_seconds} s`;
                resultsContainerDiv.innerHTML = '';
                const table = document.createElement('table');
                table.className = 'table table-sm table-bordered mb-0';
                table.innerHTML = '<thead><tr><th>Shift</th><th>Testo</th></tr></thead>';
                const tbody = document.createElement('tbody');

                data.results.forEach(result => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td class="font-mono text-primary">+${result.shift}</td><td class="font-mono">${result.plaintext}</td>`;
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);
                resultsContainerDiv.appendChild(table);
                resultsContainer.classList.remove('d-none');
                showToast('Brute force completato');
            } catch (error) {
                console.error('[Caesar Bruteforce Error]', error);
                showToast('Errore brute force', true);
            }
        });
    }

    // ==========================================
    // 2. VIGENERE
    // ==========================================
    const vigenereForm = document.getElementById('vigenereForm');
    if (vigenereForm) {
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

                const response = await fetch(`${API_BASE_URL}/api/vigenere`, { method: 'POST', body: formData });
                const data = await response.json();
                document.getElementById('vigenereResult').textContent = data.result;
                document.querySelector('#view-vigenere .result-container').classList.remove('d-none');
                if (!decode) {
                    const attackInput = document.getElementById('vigenereAttackText');
                    if (attackInput) attackInput.value = data.result;
                }
                showToast('Operazione Vigenère completata');
            } catch (error) {
                console.error('[Vigenere Error]', error);
                showToast('Errore Vigenère', true);
            }
        });
    }

    const vigenereDictionaryForm = document.getElementById('vigenereDictionaryForm');
    if (vigenereDictionaryForm) {
        vigenereDictionaryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = document.getElementById('vigenereAttackText').value;
            const dictionary = document.getElementById('vigenereDictionary').value;

            try {
                const formData = new FormData();
                formData.append('text', text);
                formData.append('dictionary', dictionary);

                const response = await fetch(`${API_BASE_URL}/api/vigenere/dictionaryattack`, { method: 'POST', body: formData });
                const data = await response.json();

                const resultsContainer = document.querySelector('#view-vigenere .dictionary-result-container');
                const resultsTableBody = document.getElementById('vigenereDictionaryResults');
                const timeElement = document.getElementById('vigenereAttackTime');

                timeElement.textContent = `${data.total_ms || data.total_seconds} s`;
                resultsTableBody.innerHTML = '';
                const table = document.createElement('table');
                table.className = 'table table-sm table-bordered mb-0';
                table.innerHTML = '<thead><tr><th>Chiave</th><th>Plaintext</th></tr></thead>';
                const tbody = document.createElement('tbody');

                data.results.forEach(result => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td class="font-mono text-primary">${result.key}</td><td class="font-mono">${result.plaintext}</td>`;
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);
                resultsTableBody.appendChild(table);
                resultsContainer.classList.remove('d-none');
                showToast('Dizionario Vigenère completato');
            } catch (error) {
                console.error('[Vigenere Attack Error]', error);
                showToast('Errore attacco dizionario', true);
            }
        });
    }

    // ==========================================
    // 3. HASH
    // ==========================================
    const hashForm = document.getElementById('hashForm');
    if (hashForm) {
        hashForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = document.getElementById('hashText').value;
            const algorithm = document.getElementById('hashAlgorithm').value;

            try {
                const formData = new FormData();
                formData.append('text', text);
                formData.append('algorithm', algorithm);

                const response = await fetch(`${API_BASE_URL}/api/hash`, { method: 'POST', body: formData });
                const data = await response.json();
                document.getElementById('hashResult').textContent = data.result;
                document.querySelector('#view-hash .result-container').classList.remove('d-none');
                const targetInput = document.getElementById('hashTarget');
                if (targetInput) targetInput.value = data.result;
                const targetAlgo = document.getElementById('hashAttackAlgorithm');
                if (targetAlgo) targetAlgo.value = algorithm;
                showToast('Hash calcolato');
            } catch (error) {
                console.error('[Hash Error]', error);
                showToast('Errore calcolo hash', true);
            }
        });
    }

    const hashDictionaryForm = document.getElementById('hashDictionaryForm');
    if (hashDictionaryForm) {
        hashDictionaryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const hash = document.getElementById('hashTarget').value.trim();
            const algorithm = document.getElementById('hashAttackAlgorithm').value;
            const dictionary = document.getElementById('hashDictionary').value;

            try {
                const formData = new FormData();
                formData.append('hash', hash);
                formData.append('algorithm', algorithm);
                formData.append('dictionary', dictionary);

                const response = await fetch(`${API_BASE_URL}/api/hash/dictionaryattack`, { method: 'POST', body: formData });
                const data = await response.json();

                const resultsContainer = document.querySelector('#view-hash .hash-dictionary-result-container');
                const resultsDiv = document.getElementById('hashDictionaryResults');
                const timeElement = document.getElementById('hashAttackTime');

                timeElement.textContent = `${data.total_ms || data.total_seconds} s`;
                resultsDiv.innerHTML = '';

                if (data.results.length === 0) {
                    resultsDiv.innerHTML = '<div class="alert alert-warning mb-0 small">Nessuna corrispondenza trovata.</div>';
                } else {
                    resultsDiv.innerHTML = `
                        <div class="alert alert-success mb-0 small">
                            <strong>Testo trovato:</strong> <span class="font-mono text-success">${data.results[0].text}</span><br>
                            <small class="text-muted font-mono">${data.results[0].hash}</small>
                        </div>
                    `;
                }
                resultsContainer.classList.remove('d-none');
                showToast('Attacco hash completato');
            } catch (error) {
                console.error('[Hash Attack Error]', error);
                showToast('Errore ricerca hash', true);
            }
        });
    }

    // ==========================================
    // 4. BCRYPT
    // ==========================================
    const bcryptForm = document.getElementById('bcryptForm');
    if (bcryptForm) {
        bcryptForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('bcryptPassword').value;
            const rounds1 = parseInt(document.getElementById('bcryptRounds1').value);
            const rounds2 = parseInt(document.getElementById('bcryptRounds2').value);
            const rounds3 = parseInt(document.getElementById('bcryptRounds3').value);

            try {
                const formData = new FormData();
                formData.append('password', password);
                formData.append('rounds1', rounds1);
                formData.append('rounds2', rounds2);
                formData.append('rounds3', rounds3);

                const response = await fetch(`${API_BASE_URL}/api/hash/bcrypt`, { method: 'POST', body: formData });
                const data = await response.json();

                const resultsContainer = document.getElementById('bcryptResultsContainer');
                const resultsTableBody = document.getElementById('bcryptResults');

                resultsTableBody.innerHTML = '';
                const table = document.createElement('table');
                table.className = 'table table-sm table-bordered mb-0';
                table.innerHTML = '<thead><tr><th>Rounds</th><th>Tempo</th><th>Hash</th></tr></thead>';
                const tbody = document.createElement('tbody');

                data.bcrypt.forEach(result => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="font-mono">${result.rounds}</td>
                        <td class="font-mono text-primary">${result.time_ms} s</td>
                        <td><code class="font-mono text-muted" style="font-size:0.75rem; word-break:break-all;">${result.hash}</code></td>
                    `;
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);
                resultsTableBody.appendChild(table);
                resultsContainer.classList.remove('d-none');
                if (data.bcrypt && data.bcrypt.length > 0) {
                    const verifyHashInput = document.getElementById('bcryptVerifyHash');
                    if (verifyHashInput) verifyHashInput.value = data.bcrypt[0].hash;
                    const verifyPwInput = document.getElementById('bcryptVerifyPassword');
                    if (verifyPwInput) verifyPwInput.value = password;
                }
                showToast('Bcrypt calcolato');
            } catch (error) {
                console.error('[Bcrypt Error]', error);
                showToast('Errore bcrypt', true);
            }
        });
    }

    const bcryptVerifyForm = document.getElementById('bcryptVerifyForm');
    if (bcryptVerifyForm) {
        bcryptVerifyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('bcryptVerifyPassword').value;
            const hashedPassword = document.getElementById('bcryptVerifyHash').value.trim();

            try {
                const formData = new FormData();
                formData.append('password', password);
                formData.append('hashedPassword', hashedPassword);

                const response = await fetch(`${API_BASE_URL}/api/hash/bcrypt-verify`, { method: 'POST', body: formData });
                const data = await response.json();

                const resultsContainer = document.getElementById('bcryptVerifyResultContainer');
                const resultsDiv = document.getElementById('bcryptVerifyResult');

                if (data.verified) {
                    resultsDiv.innerHTML = '<div class="alert alert-success mb-0 small">Password corretta!</div>';
                } else {
                    resultsDiv.innerHTML = '<div class="alert alert-danger mb-0 small">Password NON corrispondente.</div>';
                }
                resultsContainer.classList.remove('d-none');
                showToast(data.verified ? 'Password verificata' : 'Password non valida', !data.verified);
            } catch (error) {
                console.error('[Bcrypt Verify Error]', error);
                showToast('Errore verifica bcrypt', true);
            }
        });
    }

    // ==========================================
    // 5. AES
    // ==========================================
    const encryptFileForm = document.getElementById('encryptFileForm');
    if (encryptFileForm) {
        encryptFileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const file = document.getElementById('encryptFile').files[0];
            const password = document.getElementById('encryptPassword').value;
            if (!file) return;

            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('password', password);

                const response = await fetch(`${API_BASE_URL}/api/aes/encrypt-file`, { method: 'POST', body: formData });
                if (!response.ok) throw new Error('Cifratura fallita');

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${file.name}.enc`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
                showToast('File cifrato scaricato');
            } catch (error) {
                console.error('[AES Encrypt Error]', error);
                showToast('Errore cifratura file', true);
            }
        });
    }

    const decryptFileForm = document.getElementById('decryptFileForm');
    if (decryptFileForm) {
        decryptFileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const file = document.getElementById('decryptFile').files[0];
            const password = document.getElementById('decryptPassword').value;
            if (!file) return;

            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('password', password);

                const response = await fetch(`${API_BASE_URL}/api/aes/decrypt-file`, { method: 'POST', body: formData });
                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.detail || 'Decifratura fallita');
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name.replace('.enc', '');
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
                showToast('File decifrato scaricato');
            } catch (error) {
                console.error('[AES Decrypt Error]', error);
                showToast(error.message || 'Errore decifratura file', true);
            }
        });
    }

    // ==========================================
    // 6. RSA
    // ==========================================
    const btnGenerateRsa = document.getElementById('btnGenerateRsa');
    if (btnGenerateRsa) {
        btnGenerateRsa.addEventListener('click', async () => {
            const keySize = document.getElementById('rsaKeySize').value;
            try {
                const formData = new FormData();
                formData.append('key_size', keySize);

                const response = await fetch(`${API_BASE_URL}/api/rsa/generate`, { method: 'POST', body: formData });
                const data = await response.json();

                document.getElementById('rsaPublicKey').value = data.public_key || '';
                document.getElementById('rsaPrivateKey').value = data.private_key || '';
                showToast(`Chiavi RSA (${keySize} bit) generate`);
            } catch (error) {
                console.error('[RSA Keygen Error]', error);
                showToast('Errore generazione RSA', true);
            }
        });
    }

    const rsaEncryptForm = document.getElementById('rsaEncryptForm');
    if (rsaEncryptForm) {
        rsaEncryptForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const publicKey = document.getElementById('rsaPublicKey').value.trim();
            const message = document.getElementById('rsaMessage').value;

            try {
                const formData = new FormData();
                formData.append('public_key', publicKey);
                formData.append('message', message);

                const response = await fetch(`${API_BASE_URL}/api/rsa/encrypt`, { method: 'POST', body: formData });
                const data = await response.json();
                document.getElementById('rsaEncryptResult').textContent = data.ciphertext || '';
                document.getElementById('rsaEncryptResultContainer').classList.remove('d-none');
                const decryptCipher = document.getElementById('rsaCiphertext');
                if (decryptCipher && data.ciphertext) decryptCipher.value = data.ciphertext;
                showToast('Testo cifrato con RSA');
            } catch (error) {
                console.error('[RSA Encrypt Error]', error);
                showToast('Errore cifratura RSA', true);
            }
        });
    }

    const rsaDecryptForm = document.getElementById('rsaDecryptForm');
    if (rsaDecryptForm) {
        rsaDecryptForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const privateKey = document.getElementById('rsaPrivateKey').value.trim();
            const ciphertext = document.getElementById('rsaCiphertext').value.trim();

            try {
                const formData = new FormData();
                formData.append('private_key', privateKey);
                formData.append('ciphertext', ciphertext);

                const response = await fetch(`${API_BASE_URL}/api/rsa/decrypt`, { method: 'POST', body: formData });
                const data = await response.json();
                document.getElementById('rsaDecryptResult').textContent = data.plaintext || '';
                document.getElementById('rsaDecryptResultContainer').classList.remove('d-none');
                showToast('Testo decifrato');
            } catch (error) {
                console.error('[RSA Decrypt Error]', error);
                showToast('Errore decifratura RSA', true);
            }
        });
    }

    // ==========================================
    // 7. BB84
    // ==========================================
    const bb84Form = document.getElementById('bb84Form');
    if (bb84Form) {
        bb84Form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const numBits = document.getElementById('bb84Bits').value;
            const evePresent = document.getElementById('bb84Eve').checked;

            try {
                const formData = new FormData();
                formData.append('num_bits', numBits);
                formData.append('eve_present', evePresent);

                const response = await fetch(`${API_BASE_URL}/api/quantum/bb84`, { method: 'POST', body: formData });
                const data = await response.json();

                const container = document.getElementById('bb84ResultContainer');
                const alertStatus = document.getElementById('bb84AlertStatus');
                const qberBadge = document.getElementById('bb84QberBadge');
                const table = document.getElementById('bb84Table');
                const sharedKeyPre = document.getElementById('bb84SharedKey');

                qberBadge.textContent = `QBER: ${(data.error_rate * 100).toFixed(1)}% (${data.error_count} errori)`;

                if (data.eve_detected) {
                    alertStatus.className = 'alert alert-danger small';
                    alertStatus.innerHTML = `<strong>Spia rilevata!</strong> QBER ${(data.error_rate * 100).toFixed(1)}%. Chiave scartata.`;
                    sharedKeyPre.textContent = "[SCARTATA]";
                } else {
                    alertStatus.className = 'alert alert-success small';
                    alertStatus.innerHTML = `<strong>Canale sicuro.</strong> QBER ${(data.error_rate * 100).toFixed(1)}%.`;
                    sharedKeyPre.textContent = data.shared_key_hex || "[Nessun bit utile]";
                }

                let thead = '<thead><tr><th>#</th>';
                for (let i = 0; i < data.num_bits; i++) thead += `<th>${i+1}</th>`;
                thead += '</tr></thead>';

                let rowAlice = '<tr><td><strong>Alice Base</strong></td>';
                let rowBob = '<tr><td><strong>Bob Base</strong></td>';
                let rowMatch = '<tr><td><strong>Match</strong></td>';

                for (let i = 0; i < data.num_bits; i++) {
                    const match = data.matching_indices.includes(i);
                    const bg = match ? 'table-success' : 'text-muted';
                    rowAlice += `<td class="${bg}">${data.alice_bases[i]}</td>`;
                    rowBob += `<td class="${bg}">${data.bob_bases[i]}</td>`;
                    rowMatch += `<td class="${bg}">${match ? '✓' : '✗'}</td>`;
                }

                table.innerHTML = thead + `<tbody>${rowAlice}</tr>${rowBob}</tr>${rowMatch}</tr></tbody>`;
                container.classList.remove('d-none');
                showToast('Simulazione BB84 completata');
            } catch (err) {
                console.error('[BB84 Error]', err);
                showToast('Errore BB84', true);
            }
        });
    }

    // ==========================================
    // 8. SHOR
    // ==========================================
    const shorForm = document.getElementById('shorForm');
    if (shorForm) {
        shorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const bits = document.getElementById('shorBits').value;
            const container = document.getElementById('shorResultContainer');

            try {
                const formData = new FormData();
                formData.append('rsa_bits', bits);

                const response = await fetch(`${API_BASE_URL}/api/quantum/shor`, { method: 'POST', body: formData });
                const data = await response.json();

                document.getElementById('shorSummaryText').innerHTML = 
                    `Fattorizzato N = <strong>${data.n}</strong> in p = <strong>${data.true_p}</strong> e q = <strong>${data.true_q}</strong>. Chiave d = <strong>${data.recovered_private_key_d}</strong> in ${data.elapsed_seconds}s.`;

                const stepsDiv = document.getElementById('shorStepsList');
                stepsDiv.innerHTML = '';
                data.steps.forEach(s => {
                    const stepItem = document.createElement('div');
                    stepItem.className = 'border-bottom py-1';
                    stepItem.innerHTML = `<strong>${s.title}</strong>: <span class="text-muted">${s.details}</span>`;
                    stepsDiv.appendChild(stepItem);
                });

                document.getElementById('shorCircuit').textContent = data.circuit_diagram.trim();
                container.classList.remove('d-none');
                showToast('Attacco Shor completato');
            } catch (err) {
                console.error('[Shor Error]', err);
                showToast('Errore Shor', true);
            }
        });
    }

    // ==========================================
    // 9. ML-KEM (DEBUG LOG INCLUSI)
    // ==========================================
    let currentMlkemLevel = 768;
    const btnMlkemKeygen = document.getElementById('btnMlkemKeygen');
    const btnMlkemEnc = document.getElementById('btnMlkemEncapsulate');
    const btnMlkemDec = document.getElementById('btnMlkemDecapsulate');

    if (btnMlkemKeygen) {
        btnMlkemKeygen.addEventListener('click', async () => {
            currentMlkemLevel = parseInt(document.getElementById('mlkemLevel').value);
            console.log('[ML-KEM] Inizio Keygen con livello:', currentMlkemLevel);

            const formData = new FormData();
            formData.append('security_level', currentMlkemLevel);

            try {
                const res = await fetch(`${API_BASE_URL}/api/pqc/ml-kem/keygen`, { method: 'POST', body: formData });
                console.log('[ML-KEM] Risposta HTTP Keygen status:', res.status);
                if (!res.ok) {
                    const errBody = await res.text();
                    throw new Error(`HTTP ${res.status}: ${errBody}`);
                }
                const data = await res.json();
                console.log('[ML-KEM] Dati ricevuti da Keygen:', data);

                document.getElementById('mlkemPk').value = data.public_key_hex || '';
                document.getElementById('mlkemSk').value = data.secret_key_hex || '';
                btnMlkemEnc.disabled = false;
                showToast('ML-KEM: Chiavi generate con successo');
            } catch (err) {
                console.error('[ML-KEM Keygen Error]', err);
                showToast('Errore generazione ML-KEM', true);
            }
        });
    }

    if (btnMlkemEnc) {
        btnMlkemEnc.addEventListener('click', async () => {
            const pk = document.getElementById('mlkemPk').value.trim();
            console.log('[ML-KEM] Inizio Encapsulate con PK (lunghezza):', pk.length);

            const formData = new FormData();
            formData.append('public_key_hex', pk);
            formData.append('security_level', currentMlkemLevel);

            try {
                const res = await fetch(`${API_BASE_URL}/api/pqc/ml-kem/encapsulate`, { method: 'POST', body: formData });
                console.log('[ML-KEM] Risposta HTTP Encapsulate status:', res.status);
                if (!res.ok) {
                    const errBody = await res.text();
                    throw new Error(`HTTP ${res.status}: ${errBody}`);
                }
                const data = await res.json();
                console.log('[ML-KEM] Dati ricevuti da Encapsulate:', data);

                document.getElementById('mlkemCt').value = data.ciphertext_hex || '';
                document.getElementById('mlkemSsBob').value = data.shared_secret_hex || '';
                btnMlkemDec.disabled = false;
                showToast('ML-KEM: Segreto incapsulato');
            } catch (err) {
                console.error('[ML-KEM Encapsulate Error]', err);
                showToast('Errore incapsulamento ML-KEM', true);
            }
        });
    }

    if (btnMlkemDec) {
        btnMlkemDec.addEventListener('click', async () => {
            const sk = document.getElementById('mlkemSk').value.trim();
            const ct = document.getElementById('mlkemCt').value.trim();
            const ssBob = document.getElementById('mlkemSsBob').value.trim();
            console.log('[ML-KEM] Inizio Decapsulate con SK e CT');

            const formData = new FormData();
            formData.append('secret_key_hex', sk);
            formData.append('ciphertext_hex', ct);
            formData.append('security_level', currentMlkemLevel);

            try {
                const res = await fetch(`${API_BASE_URL}/api/pqc/ml-kem/decapsulate`, { method: 'POST', body: formData });
                console.log('[ML-KEM] Risposta HTTP Decapsulate status:', res.status);
                if (!res.ok) {
                    const errBody = await res.text();
                    throw new Error(`HTTP ${res.status}: ${errBody}`);
                }
                const data = await res.json();
                console.log('[ML-KEM] Dati ricevuti da Decapsulate:', data);

                document.getElementById('mlkemSsAlice').value = data.shared_secret_hex || '';
                const statusDiv = document.getElementById('mlkemMatchStatus');
                statusDiv.classList.remove('d-none');

                if (data.shared_secret_hex === ssBob) {
                    statusDiv.className = 'alert alert-success p-2 small mb-0';
                    statusDiv.innerHTML = 'Segreti di Alice e Bob corrispondono perfettamente!';
                } else {
                    statusDiv.className = 'alert alert-danger p-2 small mb-0';
                    statusDiv.innerHTML = 'I segreti non corrispondono!';
                }
                showToast('ML-KEM: Decapsulamento completato');
            } catch (err) {
                console.error('[ML-KEM Decapsulate Error]', err);
                showToast('Errore decapsulamento ML-KEM', true);
            }
        });
    }

    // ==========================================
    // 10. ML-DSA (DEBUG LOG INCLUSI)
    // ==========================================
    let currentMldsaLevel = 65;
    let mldsaPk = '';
    let mldsaSk = '';
    const btnMldsaKeygen = document.getElementById('btnMldsaKeygen');
    const btnMldsaSign = document.getElementById('btnMldsaSign');
    const btnMldsaVerify = document.getElementById('btnMldsaVerify');

    if (btnMldsaKeygen) {
        btnMldsaKeygen.addEventListener('click', async () => {
            currentMldsaLevel = parseInt(document.getElementById('mldsaLevel').value);
            console.log('[ML-DSA] Inizio Keygen con livello:', currentMldsaLevel);

            const formData = new FormData();
            formData.append('security_level', currentMldsaLevel);

            try {
                const res = await fetch(`${API_BASE_URL}/api/pqc/ml-dsa/keygen`, { method: 'POST', body: formData });
                console.log('[ML-DSA] Risposta HTTP Keygen status:', res.status);
                if (!res.ok) {
                    const errBody = await res.text();
                    throw new Error(`HTTP ${res.status}: ${errBody}`);
                }
                const data = await res.json();
                console.log('[ML-DSA] Dati ricevuti da Keygen:', data);

                mldsaPk = data.public_key_hex || '';
                mldsaSk = data.secret_key_hex || '';
                document.getElementById('mldsaPk').value = mldsaPk;
                const skInput = document.getElementById('mldsaSk');
                if (skInput) skInput.value = mldsaSk;
                btnMldsaSign.disabled = false;
                showToast('ML-DSA: Chiavi generate con successo');
            } catch (err) {
                console.error('[ML-DSA Keygen Error]', err);
                showToast('Errore generazione ML-DSA', true);
            }
        });
    }

    if (btnMldsaSign) {
        btnMldsaSign.addEventListener('click', async () => {
            const message = document.getElementById('mldsaMessage').value;
            const skToUse = (document.getElementById('mldsaSk')?.value || mldsaSk).trim();
            console.log('[ML-DSA] Inizio Firma con messaggio:', message);

            const formData = new FormData();
            formData.append('secret_key_hex', skToUse);
            formData.append('message', message);
            formData.append('security_level', currentMldsaLevel);

            try {
                const res = await fetch(`${API_BASE_URL}/api/pqc/ml-dsa/sign`, { method: 'POST', body: formData });
                console.log('[ML-DSA] Risposta HTTP Sign status:', res.status);
                if (!res.ok) {
                    const errBody = await res.text();
                    throw new Error(`HTTP ${res.status}: ${errBody}`);
                }
                const data = await res.json();
                console.log('[ML-DSA] Dati ricevuti da Sign:', data);

                document.getElementById('mldsaSignature').value = data.signature_hex || '';
                document.getElementById('mldsaVerifyMessage').value = message;
                btnMldsaVerify.disabled = false;
                showToast('ML-DSA: Messaggio firmato');
            } catch (err) {
                console.error('[ML-DSA Sign Error]', err);
                showToast('Errore firma ML-DSA', true);
            }
        });
    }

    if (btnMldsaVerify) {
        btnMldsaVerify.addEventListener('click', async () => {
            const message = document.getElementById('mldsaVerifyMessage').value;
            const signature = document.getElementById('mldsaSignature').value.trim();
            const pkToUse = (document.getElementById('mldsaPk')?.value || mldsaPk).trim();
            console.log('[ML-DSA] Inizio Verifica firma');

            const formData = new FormData();
            formData.append('public_key_hex', pkToUse);
            formData.append('message', message);
            formData.append('signature_hex', signature);
            formData.append('security_level', currentMldsaLevel);

            try {
                const res = await fetch(`${API_BASE_URL}/api/pqc/ml-dsa/verify`, { method: 'POST', body: formData });
                console.log('[ML-DSA] Risposta HTTP Verify status:', res.status);
                if (!res.ok) {
                    const errBody = await res.text();
                    throw new Error(`HTTP ${res.status}: ${errBody}`);
                }
                const data = await res.json();
                console.log('[ML-DSA] Dati ricevuti da Verify:', data);

                const resultDiv = document.getElementById('mldsaVerifyResult');
                resultDiv.classList.remove('d-none');

                if (data.valid) {
                    resultDiv.className = 'alert alert-success small mb-0';
                    resultDiv.innerHTML = 'Firma VALIDA e autentica.';
                } else {
                    resultDiv.className = 'alert alert-danger small mb-0';
                    resultDiv.innerHTML = 'Firma NON valida.';
                }
                showToast(data.valid ? 'Firma valida' : 'Firma non valida', !data.valid);
            } catch (err) {
                console.error('[ML-DSA Verify Error]', err);
                showToast('Errore verifica ML-DSA', true);
            }
        });
    }

    // TOAST HELPER
    function showToast(message, isError = false) {
        const toast = document.getElementById('resultToast');
        if (!toast) return;
        const toastBody = toast.querySelector('.toast-body');
        toastBody.textContent = message;

        toast.classList.remove('bg-danger', 'bg-success', 'text-white');
        if (isError) {
            toast.classList.add('bg-danger', 'text-white');
        } else {
            toast.classList.add('bg-success', 'text-white');
        }

        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
});
