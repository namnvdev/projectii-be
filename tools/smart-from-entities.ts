#!/usr/bin/env ts-node

/**
 * smart-from-entities.ts
 * Generate NestJS modules (DTOs, service, controller, module) FROM EXISTING ENTITY FILES.
 *
 * Usage:
 *   npx ts-node tools/smart-from-entities.ts [--force] [--with-auth] [--with-swagger]
 *
 * Looks for: src/modules/** /entities/*.entity.ts
 */

import fs from "fs-extra";
import path from "path";
import {globSync} from "glob";
import minimist from "minimist";
import { pascalCase } from "pascal-case";
import { paramCase } from "param-case";

type Flags = {
  force?: boolean;
  "with-auth"?: boolean;
  "with-swagger"?: boolean;
};

const argv = minimist(process.argv.slice(2)) as Flags;
const FORCE = !!argv.force;
const WITH_AUTH = !!argv["with-auth"];
const WITH_SWAGGER = !!argv["with-swagger"];

const ENTITY_GLOB = "src/modules/**/entities/*.entity.ts";

const files = globSync(ENTITY_GLOB);
if (files.length === 0) {
  console.log("❌ No entities found in src/modules/**/entities/*.entity.ts");
  process.exit(0);
}

function ensureWrite(filePath: string, content: string) {
  if (!FORCE && fs.existsSync(filePath)) {
    console.log(`⏭  Skip (exists): ${filePath}`);
    return;
  }
  fs.ensureDirSync(path.dirname(filePath));
  fs.writeFileSync(filePath, content.trimStart() + "\n");
  console.log(`${FORCE ? "✏️ Overwrote" : "✅ Created"}: ${filePath}`);
}

function extractEntityName(source: string): string | null {
  const m = source.match(/export\s+class\s+(\w+)\s*/);
  return m?.[1] ?? null;
}

/** Very light type hinting from @Column types → DTO validators */
function inferDtoValidator(line: string): { decorator: string; tsType: string } {
  const lower = line.toLowerCase();

  // Common SQL-ish mappings
  if (lower.includes("decimal") || lower.includes("int") || lower.includes("float") || lower.includes("double") || lower.includes("number")) {
    return { decorator: "IsNumber", tsType: "number" };
  }
  if (lower.includes("bool")) {
    return { decorator: "IsBoolean", tsType: "boolean" };
  }
  if (lower.includes("date")) {
    return { decorator: "IsDate", tsType: "Date" };
  }
  // varchar, text, enum → string
  return { decorator: "IsString", tsType: "string" };
}

/** Parse entity props to generate DTO fields (best effort; you can refine later) */
function parseDtoFields(src: string): Array<{ name: string; decorator: string; tsType: string }> {
  // Very naive parsing: look for lines like "  someProp: type;" that sit under @Column
  const lines = src.split("\n");
  const out: Array<{ name: string; decorator: string; tsType: string }> = [];

  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    if (/@Column\(/.test(ln)) {
      // Look ahead for the property line
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const prop = lines[j].trim();
        // e.g. "price: number;" or "name: string;"
        const m = prop.match(/^(\w+)\s*:\s*([\w\[\]\|]+)\s*;$/);
        if (m) {
          const name = m[1];
          const columnDecl = ln + (lines[i + 1] ?? "");
          const { decorator, tsType } = inferDtoValidator(columnDecl);
          out.push({ name, decorator, tsType });
          break;
        }
      }
    }
  }

  // Fallback: if nothing detected, add a comment field so the file compiles
  if (out.length === 0) {
    out.push({ name: "/* add_fields */", decorator: "/* e.g. @IsString() */", tsType: "any" });
  }
  return out;
}

for (const entityFile of files) {
  const source = fs.readFileSync(entityFile, "utf8");
  const entityName = extractEntityName(source);
  if (!entityName) {
    console.log(`⚠️  Skipping (no class): ${entityFile}`);
    continue;
  }

  // moduleName (plural kebab) from entity name
  const moduleName = paramCase(entityName) + "s"; // Product -> products
  const baseDir = path.resolve(path.dirname(entityFile), ".."); // .../modules/<name>
  const dtoDir = path.join(baseDir, "dto");

  const controllerClass = `${entityName}Controller`;
  const serviceClass = `${entityName}Service`;
  const moduleClass = `${entityName}Module`;

  console.log(`\n⚙️  Generating from entity: ${entityName} → ${moduleName}`);

  // Generate DTO fields
  const dtoFields = parseDtoFields(source);
  const validatorImports = Array.from(new Set(dtoFields.map(f => f.decorator).filter(d => !d.startsWith("/*"))));
  const validatorImportLine =
    validatorImports.length > 0 ? `import { ${validatorImports.join(", ")} } from 'class-validator';` : `// import { IsString } from 'class-validator';`;

  const dtoProps = dtoFields
    .map(f => {
      if (f.name.startsWith("/*")) return `  // ${f.decorator}\n  ${f.name}`;
      const deco = f.decorator.startsWith("/*") ? "" : `  @${f.decorator}()\n`;
      return `${deco}  ${f.name}: ${f.tsType};`;
    })
    .join("\n\n");

  // Files

  // create-*.dto.ts
  const createDtoPath = path.join(dtoDir, `create-${moduleName}.dto.ts`);
  const createDtoContent = `
${validatorImportLine}

export class Create${entityName}Dto {
${dtoProps}
}
`;

  // update-*.dto.ts
  const updateDtoPath = path.join(dtoDir, `update-${moduleName}.dto.ts`);
  const updateDtoContent = `
import { PartialType } from '@nestjs/swagger';
import { Create${entityName}Dto } from './create-${moduleName}.dto';

export class Update${entityName}Dto extends PartialType(Create${entityName}Dto) {}
`;

  // service
  const servicePath = path.join(baseDir, `${moduleName}.service.ts`);
  const serviceContent = `
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${entityName} } from './entities/${paramCase(entityName)}.entity';
import { Create${entityName}Dto } from './dto/create-${moduleName}.dto';
import { Update${entityName}Dto } from './dto/update-${moduleName}.dto';

@Injectable()
export class ${serviceClass} {
  constructor(@InjectRepository(${entityName}) private readonly repo: Repository<${entityName}>) {}

  create(dto: Create${entityName}Dto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const rec = await this.repo.findOne({ where: { id } });
    if (!rec) throw new NotFoundException('${entityName} not found');
    return rec;
  }

  async update(id: number, dto: Update${entityName}Dto) {
    const rec = await this.findOne(id);
    Object.assign(rec, dto);
    return this.repo.save(rec);
  }

  async remove(id: number) {
    const rec = await this.findOne(id);
    return this.repo.remove(rec);
  }
}
`;

  // controller
  const controllerPath = path.join(baseDir, `${moduleName}.controller.ts`);
  const maybeAuthImport = WITH_AUTH ? `\nimport { Auth } from '../../common/decorators/auth.decorator';` : "";
  const maybeApiTagsImport = WITH_SWAGGER ? `\nimport { ApiTags } from '@nestjs/swagger';` : "";
  const maybeApiTags = WITH_SWAGGER ? `\n@ApiTags('${entityName}')` : "";
  const maybeAuthUser = WITH_AUTH ? `\n  @Auth('user')` : "";
  const maybeAuthAdmin = WITH_AUTH ? `\n  @Auth('admin')` : "";

  const controllerContent = `
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ${serviceClass} } from './${moduleName}.service';
import { Create${entityName}Dto } from './dto/create-${moduleName}.dto';
import { Update${entityName}Dto } from './dto/update-${moduleName}.dto';${maybeAuthImport}${maybeApiTagsImport}

${maybeApiTags}
@Controller('${moduleName}')
export class ${controllerClass} {
  constructor(private readonly service: ${serviceClass}) {}

  @Post()${maybeAuthUser}
  create(@Body() dto: Create${entityName}Dto) {
    return this.service.create(dto);
  }

  @Get()${maybeAuthUser}
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')${maybeAuthUser}
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')${maybeAuthUser}
  update(@Param('id') id: number, @Body() dto: Update${entityName}Dto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')${maybeAuthAdmin}
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
`;

  // module
  const modulePath = path.join(baseDir, `${moduleName}.module.ts`);
  const moduleContent = `
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${serviceClass} } from './${moduleName}.service';
import { ${controllerClass} } from './${moduleName}.controller';
import { ${entityName} } from './entities/${paramCase(entityName)}.entity';

@Module({
  imports: [TypeOrmModule.forFeature([${entityName}])],
  controllers: [${controllerClass}],
  providers: [${serviceClass}],
  exports: [${serviceClass}],
})
export class ${moduleClass} {}
`;

  ensureWrite(createDtoPath, createDtoContent);
  ensureWrite(updateDtoPath, updateDtoContent);
  ensureWrite(servicePath, serviceContent);
  ensureWrite(controllerPath, controllerContent);
  ensureWrite(modulePath, moduleContent);
}

console.log("\n🎉 Done. Generated modules from entities.");
