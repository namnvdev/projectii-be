#!/usr/bin/env ts-node
import fs from "fs-extra";
import path from "path";
import pluralize from "pluralize";
import { globSync } from "glob";

const entities = globSync("src/modules/**/entities/*.entity.ts");

function correctImport(currentFile: string, importedName: string) {
  const singular = pluralize.singular(importedName).toLowerCase();

  const targetFile = entities.find(f =>
    f.endsWith(`/entities/${singular}.entity.ts`)
  );

  if (!targetFile) return null;

  const rel = path.relative(path.dirname(currentFile), targetFile)
    .replace(/\\/g, "/")
    .replace(/\.ts$/, "");

  const className = singular.charAt(0).toUpperCase() + singular.slice(1);
  return { className, relPath: rel };
}

for (const file of entities) {
  let src = fs.readFileSync(file, "utf8");
  let updated = src;

  const importRegex = /import\s*{\s*(\w+)\s*}\s*from\s*['"](.+)['"]/g;
  let match;

  while ((match = importRegex.exec(src)) !== null) {
    const oldName = match[1];

    const fixed = correctImport(file, oldName);
    if (!fixed) continue;

    const { className, relPath } = fixed;

    console.log(`🔧 Fix import in ${path.basename(file)}: ${oldName} → ${className}`);

    updated = updated.replace(
      new RegExp(`\\b${oldName}\\b`, "g"),
      className
    );

    updated = updated.replace(
      match[2],
      relPath
    );
  }

  if (updated !== src) {
    fs.writeFileSync(file, updated);
  }
}

console.log("🎉 fix imported class names complete.");
console.log("🎉  Done.");