#!/usr/bin/env ts-node
import fs from "fs-extra";
import path from "path";
import pluralize from "pluralize";
import { globSync } from "glob";

const entities = globSync("src/modules/**/entities/*.entity.ts");

function singular(str: string) {
  return pluralize.singular(str);
}

function className(str: string) {
  const s = singular(str);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fixImportPath(file: string, importedName: string) {
  const singularName = singular(importedName).toLowerCase();

  const targetFile = entities.find(f =>
    f.endsWith(`${singularName}.entity.ts`)
  );

  if (!targetFile) return null;

  const rel = path.relative(path.dirname(file), targetFile)
    .replace(/\\/g, "/")
    .replace(/\.ts$/, "");

  return { newName: className(importedName), rel };
}

for (const file of entities) {
  let src = fs.readFileSync(file, "utf8");
  let updated = src;

  //
  // 1) FIX PLURAL CLASS NAME
  //
  const classMatch = src.match(/export\s+class\s+(\w+)/);
  if (classMatch) {
    const oldClass = classMatch[1];
    const newClass = className(oldClass);

    if (oldClass !== newClass) {
      console.log(`🔤 Class rename: ${oldClass} → ${newClass}`);
      updated = updated.replace(
        new RegExp(`\\b${oldClass}\\b`, "g"),
        newClass
      );
    }
  }

  //
  // 2) FIX IMPORT STATEMENTS
  //
  const importRegex = /import\s*{\s*(\w+)\s*}\s*from\s*['"](.+)['"]/g;
  let m;

  while ((m = importRegex.exec(src)) !== null) {
    const oldImport = m[1];
    const fixed = fixImportPath(file, oldImport);

    if (!fixed) continue;

    const { newName, rel } = fixed;

    updated = updated.replace(
      new RegExp(`\\b${oldImport}\\b`, "g"),
      newName
    );

    updated = updated.replace(m[2], rel);

    console.log(`🔧 Fix import in ${path.basename(file)}: ${oldImport} → ${newName}`);
  }

  //
  // 3) FIX RELATION DECORATORS
  //
  updated = updated
    // (orders) => orders.customer  →  (order) => order.customer
    .replace(/\((\w+)s\)\s*=>\s*\1s\./g, (match, p1) => {
      return `(${p1}) => ${p1}.`;
    })
    // Orders[] → Order[]
    .replace(/\b(\w+)s\[\]/g, (match, p1) => `${className(p1)}[]`)
    // : Orders → : Order
    .replace(/:\s*(\w+)s\b/g, (match, p1) => `: ${className(p1)}`)
    // () => Orders → () => Order
    .replace(/=>\s*(\w+)s\b/g, (match, p1) => `=> ${className(p1)}`);

  //
  // Write file
  //
  if (updated !== src) {
    fs.writeFileSync(file, updated);
    console.log(`✔ Updated ${file}`);
  }
}
