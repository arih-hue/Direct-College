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

async function checkSchema() {
  console.log("Fetching schema info via SQL queries...");

  // Querying table structure using rpc or public views
  // Let's fetch one row from each table and print keys
  const tables = ["colleges", "branches", "cutoffs", "reviews", "mentors", "deadlines", "resources", "seniors"];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("*").limit(1);
    if (error) {
      console.log(`Table '${table}' error or not found:`, error.message);
    } else {
      console.log(`Table '${table}' exists. Columns:`, data.length > 0 ? Object.keys(data[0]) : "(empty table)");
    }
  }
}

checkSchema();
