#!/usr/bin/env ts-node
import { execSync } from "child_process";
import {glob} from "glob";
import fs from "fs-extra";
import path from "path";
import { rename } from "fs";
import pluralize from "pluralize";




console.log("🏗️  Generating TypeORM entities from DB...");

execSync(
  "npx typeorm-model-generator -h localhost -d sms_demo -u root -x 123456 -p 3306 -e mysql -o src/modules/entities --ce pascal --cp camel --cf param --noConfig --tablesPrefixStrip",
  { stdio: "inherit" }
);

console.log("✅ Entities generated successfully!");



const srcDir = "src/modules/entities";

async function renameEntities() {
  console.log("🔍 Searching for entity files...");

  const files = glob.sync(`${srcDir}/*.ts`);
  if (files.length === 0) {
    console.log("⚠️ No top-level entity files found in src/modules/entities");
    return;
  }

  for (const file of files) {
    const name = path.basename(file, ".ts"); // e.g. "product"
    //const name = base + ".entity"; // e.g. "product.entity"
    // const name = base.replace(".entity", ""); // e.g. "product"
    //const moduleName = name.endsWith("s") ? name : `${name}s`; // pluralize folder
    //const targetDir = path.join(srcDir, moduleName, "entities");
    //fs.ensureDirSync(targetDir);

    //convert plural to singular

    const oldName = name;
    const singular = pluralize.singular(oldName);

    if (singular === oldName) continue; // already singular

    console.log(`🔤 Renaming class ${oldName} → ${singular}`);

    // src = src.replace(new RegExp(`class\\s+${oldName}\\b`, "g"), `class ${singular}`);
    // src = src.replace(new RegExp(`${oldName} `, "g"), `${singular} `);



    const targetFile = path.join(srcDir, `/${singular}.entity.ts`);
    fs.renameSync(file, targetFile);

    console.log(`✅ Moved ${file} → ${targetFile}`);
  }

  //fs.removeSync(srcDir);

  console.log("🎉 All entity files organized successfully!");
}

renameEntities().catch((err) => console.error("❌ Error:", err));




