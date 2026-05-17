// ================================================
// SYSTÈME DE NOTIFICATIONS PUSH - ZyntraCode
// Ajoute sur toutes tes pages :
// <script src="notifications.js"></script>
// ================================================

const VAPID_KEY = 'BIucxx8QAshRVFx47cMEjnnqEcammCSHFLsw1NQKrgSd2lsMQttkRA6pej27yckCjCYXCwaWRZpXBLEDo-YxPdQ';

// Charger Firebase
const scriptApp = document.createElement('script');
scriptApp.src = 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js';
document.head.appendChild(scriptApp);

scriptApp.onload = () => {
    const scriptMsg = document.createElement('script');
    scriptMsg.src = 'https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js';
    document.head.appendChild(scriptMsg);

    scriptMsg.onload = () => {
        firebase.initializeApp({
            apiKey: "AIzaSyAUOR7OnrLZgTt82APHGaal4ktHPqgFdq8",
            authDomain: "zyntracode-9837f.firebaseapp.com",
            projectId: "zyntracode-9837f",
            storageBucket: "zyntracode-9837f.firebasestorage.app",
            messagingSenderId: "1098824016756",
            appId: "1:1098824016756:web:e00cb1e8cade87e71d0221"
        });

        const messaging = firebase.messaging();

        // Enregistrer le service worker
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then(registration => {
                messaging.useServiceWorker(registration);
                demanderPermission(messaging);
            })
            .catch(err => console.log('SW error:', err));

        // Recevoir notifications en premier plan
        messaging.onMessage(payload => {
            afficherNotifInApp(payload.notification);
        });
    };
};

async function demanderPermission(messaging) {
    // Ne demander que si pas encore accepté
    if (Notification.permission === 'granted') {
        getToken(messaging);
        return;
    }
    if (Notification.permission === 'denied') return;

    // Afficher une demande sympa avant le popup navigateur
    afficherDemandeNotif(messaging);
}

function afficherDemandeNotif(messaging) {
    // Ne pas afficher si déjà vu
    if (localStorage.getItem('notif_demande_vue')) return;

    const style = document.createElement('style');
    style.textContent = `
        #demande-notif {
            position: fixed; bottom: 20px; left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            background: #1a1a1a;
            border: 1px solid rgb(21,213,168);
            border-radius: 14px;
            padding: 18px 22px;
            max-width: 380px; width: 90%;
            box-shadow: 0 8px 30px rgba(0,0,0,0.6);
            animation: slideUp 0.4s ease;
            font-family: Arial, sans-serif;
        }
        @keyframes slideUp {
            from { opacity:0; transform: translateX(-50%) translateY(20px); }
            to   { opacity:1; transform: translateX(-50%) translateY(0); }
        }
        #demande-notif .dn-titre {
            color: rgb(21,213,168); font-size: 15px;
            font-weight: bold; margin-bottom: 8px;
        }
        #demande-notif .dn-texte {
            color: #aaa; font-size: 13px;
            line-height: 1.6; margin-bottom: 15px;
        }
        #demande-notif .dn-btns {
            display: flex; gap: 8px;
        }
        #demande-notif .dn-oui {
            flex: 1; padding: 9px;
            background: rgb(21,213,168); color: black;
            border: none; border-radius: 8px;
            font-size: 13px; font-weight: bold;
            cursor: pointer; transition: 0.2s;
        }
        #demande-notif .dn-oui:hover { background: #12c9a0; }
        #demande-notif .dn-non {
            padding: 9px 14px;
            background: transparent; color: #aaa;
            border: 1px solid #2a2a2a; border-radius: 8px;
            font-size: 13px; cursor: pointer; transition: 0.2s;
        }
        #demande-notif .dn-non:hover { border-color: #aaa; color: white; }
    `;
    document.head.appendChild(style);

    const div = document.createElement('div');
    div.id = 'demande-notif';
    div.innerHTML = `
        <div class="dn-titre">🔔 Activer les notifications</div>
        <div class="dn-texte">Reçois les dernières nouvelles de ZyntraCode directement sur ton téléphone !</div>
        <div class="dn-btns">
            <button class="dn-oui" onclick="accepterNotifs()">✅ Oui, j'active</button>
            <button class="dn-non" onclick="refuserNotifs()">Non merci</button>
        </div>
    `;
    document.body.appendChild(div);

    window._messaging = messaging;
}

window.accepterNotifs = async function() {
    localStorage.setItem('notif_demande_vue', '1');
    document.getElementById('demande-notif')?.remove();
    const permission = await Notification.requestPermission();
    if (permission === 'granted') getToken(window._messaging);
};

window.refuserNotifs = function() {
    localStorage.setItem('notif_demande_vue', '1');
    document.getElementById('demande-notif')?.remove();
};

async function getToken(messaging) {
    try {
        const token = await messaging.getToken({ vapidKey: VAPID_KEY });
        if (token) {
            localStorage.setItem('fcm_token', token);
            console.log('Token FCM:', token);
        }
    } catch (err) {
        console.log('Erreur token:', err);
    }
}

// Notification in-app (quand le site est ouvert)
function afficherNotifInApp(notif) {
    const style = document.createElement('style');
    style.textContent = `
        #notif-inapp {
            position: fixed; top: 20px; right: 20px;
            z-index: 9999;
            background: #1a1a1a;
            border: 1px solid rgb(21,213,168);
            border-radius: 12px;
            padding: 15px 18px;
            max-width: 300px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.5);
            animation: slideIn 0.3s ease;
            font-family: Arial, sans-serif;
            cursor: pointer;
        }
        #notif-inapp:hover { background: #222; }
        #notif-inapp .ni-titre { color: rgb(21,213,168); font-size: 14px; font-weight: bold; margin-bottom: 5px; }
        #notif-inapp .ni-body { color: #aaa; font-size: 13px; }
    `;
    document.head.appendChild(style);

    const div = document.createElement('div');
    div.id = 'notif-inapp';
    div.innerHTML = `
        <div class="ni-titre">🔔 ${notif.title}</div>
        <div class="ni-body">${notif.body}</div>
    `;
    div.onclick = () => div.remove();
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 5000);
}
