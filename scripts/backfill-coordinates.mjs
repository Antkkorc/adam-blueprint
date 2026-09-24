import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}

function getLocation(row) {
  return [row.location, row.suburb, row.city, "Botswana"].filter(Boolean).join(", ");
}

async function findCoordinates(location) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "bw");
  url.searchParams.set("q", location);

  const response = await fetch(url, {
    headers: { "user-agent": "adam-blueprint-coordinate-backfill/1.0" },
  });
  if (!response.ok) throw new Error(`Geocoding failed with HTTP ${response.status}.`);

  const results = await response.json();
  if (!Array.isArray(results) || !results[0]?.lat || !results[0]?.lon) return null;
  return { latitude: Number(results[0].lat), longitude: Number(results[0].lon) };
}

async function backfillTable(db, table) {
  const { data: rows, error } = await db
    .from(table)
    .select(table === "properties"
      ? "id,location,city,suburb,latitude,longitude"
      : "id,location,latitude,longitude")
    .or("latitude.is.null,longitude.is.null");
  if (error) throw new Error(`Could not read ${table}: ${error.message}`);

  let updated = 0;
  let skipped = 0;
  for (const row of rows ?? []) {
    const location = getLocation(row);
    if (!location) {
      skipped++;
      continue;
    }

    const coordinates = await findCoordinates(location);
    if (!coordinates) {
      console.warn(`[${table}] No match for ${location}`);
      skipped++;
      continue;
    }

    if (process.argv.includes("--apply")) {
      const { error: updateError } = await db
        .from(table)
        .update(coordinates)
        .eq("id", row.id);
      if (updateError) throw new Error(`Could not update ${table}/${row.id}: ${updateError.message}`);
    }

    console.log(`[${table}] ${process.argv.includes("--apply") ? "Updated" : "Would update"} ${row.id}: ${coordinates.latitude}, ${coordinates.longitude}`);
    updated++;
    await new Promise((resolve) => setTimeout(resolve, 1100));
  }

  return { updated, skipped };
}

loadLocalEnv();

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) {
  throw new Error("Set SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running the backfill.");
}

const db = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
const mode = process.argv.includes("--apply") ? "apply" : "dry-run";
console.log(`Coordinate backfill mode: ${mode}. Use --apply to write changes.`);

for (const table of ["properties", "property_submissions"]) {
  const result = await backfillTable(db, table);
  console.log(`${table}: ${result.updated} matched, ${result.skipped} skipped.`);
}
