#!/usr/bin/env ts-node
import fs from "fs-extra";
import path from "path";
import { globSync } from "glob";
import pluralize from "pluralize";

const RAW_DIR = "src/modules/entities";
const MODULES_DIR = "src/modules";

async function main() {
  console.log("📦 Organizing entities into /src/modules/<plural>/entities/...");

  const files = globSync(`${RAW_DIR}/*.ts`);
  if (files.length === 0) {
    console.log("⚠️  No raw entities found in src/entities_raw");
    return;
  }

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const m = content.match(/export\s+class\s+(\w+)/);
    if (!m) {
      console.log(`  ⚠️  Skip (no class): ${file}`);
      continue;
    }

    const className = m[1]; // e.g. Customer
    const singular = pluralize.singular(className).toLowerCase(); // "customer"
    const plural = pluralize.plural(singular).toLowerCase();       // "customers"

    const moduleDir = path.join(MODULES_DIR, plural);
    const entitiesDir = path.join(moduleDir, "entities");
    fs.ensureDirSync(entitiesDir);

    const targetFile = path.join(entitiesDir, `${singular}.entity.ts`);

    fs.moveSync(file, targetFile, { overwrite: true });

    console.log(`  ➕ ${className} → ${targetFile}`);
  }

  console.log("✅ Entity organization complete.");
}

main().catch(err => {
  console.error("❌ Error in organize-entities:", err);
});
