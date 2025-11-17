#!/usr/bin/env ts-node

import { globSync } from "glob";
import fs from "fs-extra";
import path from "path";
import pluralize from "pluralize";

const entityFiles = globSync("src/modules/**/*.entity.ts");

for (const file of entityFiles) {
  let src = fs.readFileSync(file, "utf8");

  const match = src.match(/export\s+class\s+(\w+)/);
  if (!match) continue;

  const oldName = match[1];
  const singular = pluralize.singular(oldName);

  console.log("old name:", oldName);
  console.log("singular:", singular);

  if (singular === oldName) continue; // already singular

  console.log(`🔤 Renaming class ${oldName} → ${singular}`);

  src = src.replace(new RegExp(`class\\s+${oldName}\\b`, "g"), `class ${singular}`);
  src = src.replace(new RegExp(`${oldName} `, "g"), `${singular} `);

  const oldFile = path.basename(file);
  const newFile = file.replace(oldFile, `${pluralize.singular(path.basename(oldFile, ".ts"))}.entity.ts`);

  fs.writeFileSync(file, src);
  if (newFile !== file) fs.renameSync(file, newFile);
}

console.log("✅ All entity class names singularized.");
console.log("🎉 Done.");