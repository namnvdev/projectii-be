#!/usr/bin/env ts-node
import fs from "fs-extra";
import path from "path";
import { globSync } from "glob";

console.log("🔎 Scanning for invalid timestamp defaults...");

const files = globSync("src/modules/**/entities/*.entity.ts");

for (const file of files) {
  let src = fs.readFileSync(file, "utf8");
  let updated = src;

  //
  // 1. Fix "'current_timestamp(6)'" → CURRENT_TIMESTAMP(6)
  //
  updated = updated.replace(
    /default:\s*\(\)\s*=>\s*"'current_timestamp\((\d)\)'"/g,
    `default: () => "CURRENT_TIMESTAMP($1)"`
  );

  //
  // 2. Fix "'current_timestamp'" → CURRENT_TIMESTAMP
  //
  updated = updated.replace(
    /default:\s*\(\)\s*=>\s*"'current_timestamp'"/g,
    `default: () => "CURRENT_TIMESTAMP"`
  );

  //
  // 3. Fix default: '' or "" → remove invalid default
  //
  updated = updated.replace(
    /default:\s*['"]{2}/g,
    ""
  );

  //
  // 4. Fix weird ''"'' combinations
  //
  updated = updated.replace(
    /default:\s*\(\)\s*=>\s*['"]''['"]/g,
    ""
  );

  if (updated !== src) {
    fs.writeFileSync(file, updated);
    console.log(`✔ Fixed defaults in ${file}`);
  }
}

console.log("✅ Timestamp defaults fixed.");
