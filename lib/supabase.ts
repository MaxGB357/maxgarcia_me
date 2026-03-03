import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://orxcxmainkmityvhcqsv.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeGN4bWFpbmttaXR5dmhjcXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDk2NjUsImV4cCI6MjA4ODEyNTY2NX0._iJ3VOx9p9NaEgpUkLa7Cijv-95xfJwMYASoDCI1SUs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
