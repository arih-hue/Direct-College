import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Load env variables manually from .env.local
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

console.log("Supabase URL:", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log("Checking colleges...");
  const { data: colleges, error: cErr } = await supabase.from("colleges").select("*").limit(2);
  if (cErr) console.error("Colleges Error:", cErr);
  else console.log("Colleges count:", colleges?.length, "Colleges sample:", colleges);

  console.log("Checking branches...");
  const { data: branches, error: bErr } = await supabase.from("branches").select("*").limit(2);
  if (bErr) console.error("Branches Error:", bErr);
  else console.log("Branches count:", branches?.length, "Branches sample:", branches);

  console.log("Checking cutoffs...");
  const { data: cutoffs, error: cutErr } = await supabase.from("cutoffs").select("*").limit(2);
  if (cutErr) console.error("Cutoffs Error:", cutErr);
  else console.log("Cutoffs count:", cutoffs?.length, "Cutoffs sample:", cutoffs);

  console.log("Checking reviews...");
  const { data: reviews, error: revErr } = await supabase.from("reviews").select("*").limit(2);
  if (revErr) console.error("Reviews Error:", revErr);
  else console.log("Reviews count:", reviews?.length, "Reviews sample:", reviews);
}

check();
