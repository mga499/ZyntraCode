// ================================================
// SYSTÈME DE MISE À JOUR - ZyntraCode
// Ajoute sur toutes tes pages avant </body> :
// <script src="mise-a-jour.js"></script>
// ================================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(registration => {

        // Vérifier les mises à jour toutes les 60 secondes
        setInterval(() => registration.update(), 60000);

        // Détecter une nouvelle version disponible
        registration.addEventListener('updatefound', () => {
            const nouveauSW = registration.installing;

            nouveauSW.addEventListener('statechange', () => {
                if (nouveauSW.state === 'installed' && navigator.serviceWorker.controller) {
                    // Nouvelle version disponible !
                    afficherNotifMiseAJour(registration);
                }
            });
        });

    }).catch(err => console.log('[MAJ] Erreur SW :', err));
}

function afficherNotifMiseAJour(registration) {
    // Injecter le CSS
    const style = document.createElement('style');
    style.textContent = `
        #notif-maj {
            position: fixed;
            bottom: 20px; left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            background: #1a1a1a;
            border: 1px solid rgb(21, 213, 168);
            border-radius: 14px;
            padding: 18px 22px;
            max-width: 380px; width: 90%;
            box-shadow: 0 8px 30px rgba(0,0,0,0.6);
            font-family: Arial, sans-serif;
            animation: slideUp 0.4s ease;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        @keyframes slideUp {
            from { opacity:0; transform: translateX(-50%) translateY(20px); }
            to   { opacity:1; transform: translateX(-50%) translateY(0); }
        }
        #notif-maj .maj-icone {
            font-size: 28px; flex-shrink: 0;
        }
        #notif-maj .maj-texte { flex: 1; }
        #notif-maj .maj-titre {
            color: rgb(21, 213, 168);
            font-size: 14px; font-weight: bold;
            margin-bottom: 4px;
        }
        #notif-maj .maj-desc {
            color: #aaa; font-size: 12px;
        }
        #notif-maj .maj-btns {
            display: flex; flex-direction: column;
            gap: 6px; flex-shrink: 0;
        }
        #notif-maj .btn-maj {
            padding: 8px 14px;
            background: rgb(21, 213, 168); color: black;
            border: none; border-radius: 8px;
            font-size: 12px; font-weight: bold;
            cursor: pointer; transition: 0.2s;
            white-space: nowrap;
        }
        #notif-maj .btn-maj:hover { background: #12c9a0; }
        #notif-maj .btn-ignorer {
            padding: 6px 14px;
            background: transparent; color: #555;
            border: 1px solid #2a2a2a; border-radius: 8px;
            font-size: 12px; cursor: pointer; transition: 0.2s;
            white-space: nowrap;
        }
        #notif-maj .btn-ignorer:hover { color: #aaa; border-color: #aaa; }
    `;
    document.head.appendChild(style);

    // Injecter le HTML
    const notif = document.createElement('div');
    notif.id = 'notif-maj';
    notif.innerHTML = `
        <div class="maj-icone">🔄</div>
        <div class="maj-texte">
            <div class="maj-titre">Mise à jour disponible !</div>
            <div class="maj-desc">Une nouvelle version de ZyntraCode est prête.</div>
        </div>
        <div class="maj-btns">
            <button class="btn-maj" onclick="installerMaj()">Mettre à jour</button>
            <button class="btn-ignorer" onclick="ignorerMaj()">Plus tard</button>
        </div>
    `;
    document.body.appendChild(notif);

    // Fonction pour installer la mise à jour
    window.installerMaj = function() {
        if (registration.waiting) {
            registration.waiting.postMessage('SKIP_WAITING');
        }
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
        });
        notif.remove();
    };

    window.ignorerMaj = function() {
        notif.style.opacity = '0';
        notif.style.transition = '0.3s';
        setTimeout(() => notif.remove(), 300);
    };
}
