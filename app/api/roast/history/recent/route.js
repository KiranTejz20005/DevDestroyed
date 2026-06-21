import { createClient } from '@supabase/supabase-js';

export async function GET(req) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: roasts, error } = await supabase
      .from('roasts')
      .select('username, avatar, updated_at, roast, strength, weakness, love_life, life_purpose')
      .not('roast', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true, data: roasts }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error('Error fetching history:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
