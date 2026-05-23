import { readFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf8");
const env = {};
for (const line of envContent.split("\n")) {
  if (line.trim() && !line.startsWith("#")) {
    const [key, ...value] = line.split("=");
    env[key.trim()] = value.join("=").trim();
  }
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function fetchOpenAPI() {
  const url = `${supabaseUrl}/rest/v1/`;
  const response = await fetch(url, {
    headers: {
      "apikey": supabaseAnonKey,
      "Authorization": `Bearer ${supabaseAnonKey}`
    }
  });
  const data = await response.json();
  console.log(data);
}

fetchOpenAPI();
