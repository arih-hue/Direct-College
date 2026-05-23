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

async function verify() {
  console.log("--- Testing branches columns ---");
  const branchCols = ["id", "college_id", "name", "code", "degree", "created_at", "updated_at"];
  for (const col of branchCols) {
    const { error } = await supabase.from("branches").select(col).limit(1);
    console.log(`Column '${col}':`, error ? `ERROR: ${error.message}` : "VALID");
  }

  console.log("\n--- Testing cutoffs columns ---");
  const cutoffCols = ["id", "college_id", "branch_id", "year", "exam", "category", "round", "opening_rank", "closing_rank", "created_at"];
  for (const col of cutoffCols) {
    const { error } = await supabase.from("cutoffs").select(col).limit(1);
    console.log(`Column '${col}':`, error ? `ERROR: ${error.message}` : "VALID");
  }

  console.log("\n--- Testing reviews columns ---");
  const reviewCols = ["id", "college_id", "user_id", "user_name", "rating", "title", "body", "content", "pros", "cons", "is_verified", "created_at", "updated_at"];
  for (const col of reviewCols) {
    const { error } = await supabase.from("reviews").select(col).limit(1);
    console.log(`Column '${col}':`, error ? `ERROR: ${error.message}` : "VALID");
  }
}

verify();
