import { createClient } from '@supabase/supabase-js'

// La URL de tu proyecto que vimos en la pantalla anterior
const supabaseUrl = 'https://tiwohfouzxorjavdflwv.supabase.co'

// Tu Publishable Key pública de la pestaña API Keys
const supabaseKey = 'sb_publishable_o07muYoQ9wUPE5IpOwTE-A_d-GOn0N4'

export const supabase = createClient(supabaseUrl, supabaseKey)