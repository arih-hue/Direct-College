import { createClient } from "@supabase/supabase-js";
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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkColumns() {
  console.log("Querying branches with invalid column...");
  const { error: bErr } = await supabase.from("branches").select("non_existent_column").limit(1);
  console.log("Branches Error:\n", bErr?.message);

  console.log("Querying cutoffs with invalid column...");
  const { error: cErr } = await supabase.from("cutoffs").select("non_existent_column").limit(1);
  console.log("Cutoffs Error:\n", cErr?.message);

  console.log("Querying reviews with invalid column...");
  const { error: rErr } = await supabase.from("reviews").select("non_existent_column").limit(1);
  console.log("Reviews Error:\n", rErr?.message);
}

checkColumns();
