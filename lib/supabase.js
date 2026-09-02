import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wcojyjcsfcaguvyhvtio.supabase.co";
const supabasePublishableKey = "sb_publishable_ScR84lw4eJ5aLghKh-2_WA_CR0_9M3o";

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
