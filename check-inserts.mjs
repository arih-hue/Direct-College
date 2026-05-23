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

async function checkInserts() {
  console.log("Testing Branch insert...");
  const { data: bData, error: bErr } = await supabase.from("branches").insert({
    id: "test-branch",
    college_id: "2b2f5358-6839-4e06-bd78-7966d6385daa", // NIT Trichy
    name: "Computer Science and Engineering",
    code: "CSE",
    degree: "B.Tech"
  }).select();
  if (bErr) {
    console.error("Branch Insert Error:", bErr);
  } else {
    console.log("Branch Insert Success! Returned:", bData);
  }

  console.log("Testing Cutoff insert...");
  const { data: cData, error: cErr } = await supabase.from("cutoffs").insert({
    id: "test-cutoff",
    college_id: "2b2f5358-6839-4e06-bd78-7966d6385daa",
    branch_id: "test-branch",
    year: 2024,
    exam: "JEE Main",
    category: "General",
    round: "Round 1",
    opening_rank: 1000,
    closing_rank: 5000
  }).select();
  if (cErr) {
    console.error("Cutoff Insert Error:", cErr);
  } else {
    console.log("Cutoff Insert Success! Returned:", cData);
  }

  console.log("Testing Review insert...");
  const { data: rData, error: rErr } = await supabase.from("reviews").insert({
    id: "test-review",
    college_id: "2b2f5358-6839-4e06-bd78-7966d6385daa",
    user_name: "John Doe",
    rating: 5,
    title: "Awesome college!",
    content: "NIT Trichy is outstanding.",
    pros: ["Academics", "Campus"],
    cons: ["Hot weather"],
    placement_reality: "Very high placement",
    would_recommend: true,
    helpful_count: 10
  }).select();
  if (rErr) {
    console.error("Review Insert Error:", rErr);
  } else {
    console.log("Review Insert Success! Returned:", rData);
  }

  // Cleanup test rows
  console.log("Cleaning up...");
  await supabase.from("reviews").delete().eq("id", "test-review");
  await supabase.from("cutoffs").delete().eq("id", "test-cutoff");
  await supabase.from("branches").delete().eq("id", "test-branch");
  console.log("Done!");
}

checkInserts();
