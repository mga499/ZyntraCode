// Initialisation Supabase
const { createClient } = supabase;
const supabaseClient = createClient(
    'https://nvvpvwqcjqujyzvdimix.supabase.co',
    'sb_publishable_7oQ8rUh7OCE0Uo-DUwSUcw_CKOPnCU4'
);

// Injection du CSS du menu profil
const style = document.createElement('style');
style.textContent = `
    #profil-btn {
        position: fixed;
        top: 15px;
        right: 15px;
        z-index: 2000;
        display: none;
        align-items: center;
        gap: 8px;
        background: #1a1a1a;
        border: 1px solid rgb(21, 213, 168);
        border-radius: 25px;
        padding: 6px 14px 6px 8px;
        cursor: pointer;
        transition: 0.2s;
    }
    #profil-btn:hover {
        background: #2a2a2a;
        box-shadow: 0 0 10px rgba(21, 213, 168, 0.3);
    }
    #profil-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgb(21, 213, 168);
        color: black;
        font-weight: bold;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    #profil-nom {
        color: white;
        font-size: 13px;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    #profil-dropdown {
        position: fixed;
        top: 55px;
        right: 15px;
        z-index: 2000;
        background: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 12px;
        padding: 8px;
        min-width: 180px;
        display: none;
        box-shadow: 0 8px 30px rgba(0,0,0,0.5);
    }
    #profil-dropdown.visible {
        display: block;
    }
    #profil-dropdown a,
    #profil-dropdown button {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 10px 12px;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-size: 14px;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: 0.2s;
        text-align: left;
        font-family: Arial, Helvetica, sans-serif;
    }
    #profil-dropdown a:hover,
    #profil-dropdown button:hover {
        background: #2a2a2a;
        color: rgb(21, 213, 168);
    }
    #profil-dropdown .separateur {
        height: 1px;
        background: #2a2a2a;
        margin: 6px 0;
    }
    #profil-dropdown .deco {
        color: #ff4d4d !important;
    }
    #profil-dropdown .deco:hover {
        background: rgba(255,77,77,0.1) !important;
        color: #ff4d4d !important;
    }

    /* MOBILE */
    @media (max-width: 768px) {
        #profil-btn {
            top: 15px !important;
            right: 15px !important;
            padding: 4px 10px 4px 6px !important;
            gap: 5px !important;
        }
        #profil-avatar {
            width: 22px !important;
            height: 22px !important;
            font-size: 11px !important;
        }
        #profil-nom {
            max-width: 55px !important;
            font-size: 11px !important;
        }
        #profil-dropdown {
            top: 50px !important;
            right: 15px !important;
            min-width: 160px !important;
        }
    }
`;
document.head.appendChild(style);

// Injection du HTML du menu profil
const profilBtn = document.createElement('div');
profilBtn.id = 'profil-btn';
profilBtn.innerHTML = `
    <div id="profil-avatar">?</div>
    <span id="profil-nom">Chargement...</span>
`;
document.body.appendChild(profilBtn);

const dropdown = document.createElement('div');
dropdown.id = 'profil-dropdown';
dropdown.innerHTML = `
    <a href="dashboard.html">👤 Mon profil</a>
    <a href="parametres.html">⚙️ Paramètres</a>
    <div class="separateur"></div>
    <button class="deco" onclick="deconnexion()">🚪 Se déconnecter</button>
`;
document.body.appendChild(dropdown);

// Afficher le menu si connecté
async function initProfilMenu() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user) {
        const username = user.user_metadata?.username || user.email.split('@')[0];
        const initiale = username[0].toUpperCase();

        document.getElementById('profil-avatar').textContent = initiale;
        document.getElementById('profil-nom').textContent = username;
        document.getElementById('profil-btn').style.display = 'flex';
    }
}

// Ouvrir/fermer le dropdown
document.getElementById('profil-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('visible');
});

// Fermer en cliquant ailleurs
document.addEventListener('click', () => {
    dropdown.classList.remove('visible');
});

// Déconnexion
async function deconnexion() {
    await supabaseClient.auth.signOut();
    window.location.href = 'index.html';
}

initProfilMenu();
