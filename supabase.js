// ========================================
// REMPLACE CES DEUX VALEURS PAR LES TIENNES
// Settings → API dans ton dashboard Supabase
// ========================================
const SUPABASE_URL = 'https://TON_ID.supabase.co';
const SUPABASE_ANON_KEY = 'TA_CLE_PUBLIQUE_ANON';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
