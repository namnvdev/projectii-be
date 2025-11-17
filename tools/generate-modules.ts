#!/usr/bin/env ts-node
import fs from "fs-extra";
import path from "path";
import { globSync } from "glob";
import pluralize from "pluralize";

function pascalCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

console.log("🧩 Generating module files in correct module folders...");

const entityFiles = globSync("src/modules/**/entities/*.entity.ts");

for (const entityFile of entityFiles) {
  // example: src/modules/customers/entities/customer.entity.ts  
  const singular = path.basename(entityFile).replace(".entity.ts", ""); // customer
  const className = pascalCase(singular);                               // Customer

  const entitiesDir = path.dirname(entityFile);                         // .../modules/customers/entities
  const moduleDir = path.dirname(entitiesDir);                          // .../modules/customers
  const routeName = path.basename(moduleDir);                           // customers

  // Ensure dto/
  const dtoDir = path.join(moduleDir, "dto");
  fs.ensureDirSync(dtoDir);

  //
  // 1) MODULE FILE
  //
  const moduleFile = path.join(moduleDir, `${singular}.module.ts`);
  const moduleContent = `
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${className} } from './entities/${singular}.entity';
import { ${className}Service } from './${singular}.service';
import { ${className}Controller } from './${singular}.controller';

@Module({
  imports: [TypeOrmModule.forFeature([${className}])],
  controllers: [${className}Controller],
  providers: [${className}Service],
})
export class ${className}Module {}
`.trim();

  //
  // 2) SERVICE FILE
  //
  const serviceFile = path.join(moduleDir, `${singular}.service.ts`);
  const serviceContent = `
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${className} } from './entities/${singular}.entity';

@Injectable()
export class ${className}Service {
  constructor(
    @InjectRepository(${className})
    private repo: Repository<${className}>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: any) {
    return this.repo.save(this.repo.create(data));
  }
}
`.trim();

  //
  // 3) CONTROLLER FILE
  //
  const controllerFile = path.join(moduleDir, `${singular}.controller.ts`);
  const controllerContent = `
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ${className}Service } from './${singular}.service';

@Controller('${routeName}')
export class ${className}Controller {
  constructor(private service: ${className}Service) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }
}
`.trim();

  //
  // 4) DTO FILES
  //
  fs.writeFileSync(moduleFile, moduleContent);
  fs.writeFileSync(serviceFile, serviceContent);
  fs.writeFileSync(controllerFile, controllerContent);

  fs.writeFileSync(
    path.join(dtoDir, `create-${singular}.dto.ts`),
    `export class Create${className}Dto {}\n`
  );

  fs.writeFileSync(
    path.join(dtoDir, `update-${singular}.dto.ts`),
    `export class Update${className}Dto {}\n`
  );

  console.log(`  ✔ Created module for ${className} → ${moduleDir}`);
}

console.log("🎉 Module generation done.");
