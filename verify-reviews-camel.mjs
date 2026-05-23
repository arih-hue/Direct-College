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
  console.log("--- Testing reviews camelCase and alternative columns ---");
  const cols = [
    "userId", "userName", "user_name", "body", "text", "comment", "review_text",
    "verified", "isVerified", "wouldRecommend", "would_recommend",
    "helpfulCount", "helpful_count", "placementReality", "placement_reality",
    "batch", "branch", "title"
  ];
  for (const col of cols) {
    const { error } = await supabase.from("reviews").select(col).limit(1);
    console.log(`Column '${col}':`, error ? `ERROR: ${error.message}` : "VALID");
  }
}

verify();
