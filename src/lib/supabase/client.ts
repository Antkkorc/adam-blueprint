import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function getBrowserClient(): SupabaseClient {
  if (!browserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("Supabase environment variables are not configured.");
    }
    browserClient = createBrowserClient(url, key);
  }
  return browserClient;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, property, receiver) {
    const value = Reflect.get(getBrowserClient(), property, receiver);
    return typeof value === "function" ? value.bind(getBrowserClient()) : value;
  },
});

export function createClient() {
  return supabase;
}