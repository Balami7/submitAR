import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('Supabase is not configured: set SUPABASE_URL and SUPABASE_ANON_KEY');
    }
    supabase = createClient(url, key);
  }
  return supabase;
}

export async function uploadFile(file: File, folder: string): Promise<string> {
  const supabase = getSupabase();
  const ext = file.name.split('.').pop();
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET!)
    .upload(filename, file, { upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: { publicUrl } } = supabase.storage
    .from(process.env.SUPABASE_BUCKET!)
    .getPublicUrl(data.path);

  return publicUrl;
}