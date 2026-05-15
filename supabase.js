// ========================================
// REMPLACE CES DEUX VALEURS PAR LES TIENNES
// Settings → API dans ton dashboard Supabase
// ========================================
const SUPABASE_URL = 'https://nvvpvwqcjqujyzvdimix.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'sb_publishable_7oQ8rUh7OCE0Uo-DUwSUcw_CKOPnCU4';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
