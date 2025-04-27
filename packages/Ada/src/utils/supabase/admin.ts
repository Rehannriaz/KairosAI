import {createClient as supabaseClient} from '@supabase/supabase-js';

export function createAdminClient() {
    return supabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!
    );
}
