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

async function testReviews() {
  const cols = [
    "user_id", "userId", "userName", "user_name", "userName",
    "collegeId", "college_id", "isVerified", "is_verified",
    "createdAt", "created_at", "updatedAt", "updated_at",
    "title", "body", "content", "placementReality", "placement_reality",
    "wouldRecommend", "would_recommend", "helpfulCount", "helpful_count",
    "batch", "branch", "rating", "pros", "cons"
  ];
  
  console.log("Testing columns on reviews table:");
  for (const col of cols) {
    const { error } = await supabase.from("reviews").select(col).limit(1);
    if (!error) {
      console.log(`  - ${col}: VALID`);
    } else {
      console.log(`  - ${col}: INVALID (${error.message})`);
    }
  }
}

testReviews();
