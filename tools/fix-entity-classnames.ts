#!/usr/bin/env ts-node
import fs from "fs-extra";
import path from "path";
import pluralize from "pluralize";
import { globSync } from "glob";

const files = globSync("src/modules/**/entities/*.entity.ts");

for (const file of files) {
  let src = fs.readFileSync(file, "utf8");

  const match = src.match(/export\s+class\s+(\w+)/);
  if (!match) continue;

  const oldName = match[1];
  const newName = pluralize.singular(oldName);

  if (oldName === newName) continue;

  console.log(`🔤 Fix class: ${oldName} → ${newName}`);

  src = src.replace(new RegExp(`\\b${oldName}\\b`, "g"), newName);
  fs.writeFileSync(file, src);
}
