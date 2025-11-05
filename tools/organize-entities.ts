#!/usr/bin/env ts-node

/**
 * organize-entities.ts
 * Moves all entity files from src/modules/ into
 * their own module/entity folders automatically.
 */

import fs from "fs-extra";
import path from "path";
import { globSync } from "glob";


const srcDir = "src/modules";

async function organizeEntities() {
  console.log("🔍 Searching for entity files...");

  const files = globSync(`${srcDir}/entities/*.entity.ts`);
  if (files.length === 0) {
    console.log("⚠️ No top-level entity files found in src/modules/");
    return;
  }

  for (const file of files) {
    const base = path.basename(file, ".ts"); // e.g. "products.entity"
    const name = base.replace(".entity", ""); // e.g. "products"
    const moduleName = name.endsWith("s") ? name : `${name}s`; // pluralize folder
    const targetDir = path.join(srcDir, moduleName, "entities");

    fs.ensureDirSync(targetDir);

    const targetFile = path.join(targetDir, `${name}.entity.ts`);
    fs.renameSync(file, targetFile);

    console.log(`✅ Moved ${file} → ${targetFile}`);
  }

  console.log("🎉 All entity files organized successfully!");
}

organizeEntities().catch((err) => console.error("❌ Error:", err));
