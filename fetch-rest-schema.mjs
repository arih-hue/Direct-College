import { readFileSync, writeFileSync } from "fs";

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

async function fetchSchema() {
  const url = `${supabaseUrl}/rest/v1/`;
  console.log("Fetching OpenAPI schema from:", url);
  const res = await fetch(url, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  });
  if (!res.ok) {
    console.error("Failed to fetch:", res.status, await res.text());
    return;
  }
  const schema = await res.json();
  writeFileSync("supabase-openapi.json", JSON.stringify(schema, null, 2));
  console.log("Wrote schema to supabase-openapi.json");

  // Print tables and their columns
  const definitions = schema.definitions || {};
  for (const [tableName, definition] of Object.entries(definitions)) {
    console.log(`\nTable: ${tableName}`);
    const properties = definition.properties || {};
    for (const [colName, colDef] of Object.entries(properties)) {
      console.log(`  - ${colName}: ${colDef.type} (${colDef.format || ""})`);
    }
  }
}

fetchSchema();
