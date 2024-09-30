[![npm version](https://img.shields.io/npm/v/prisma-sql-gen?color=blue)](https://www.npmjs.com/package/prisma-sql-gen)
[![npm downloads](https://img.shields.io/npm/dm/prisma-sql-gen?color=blue)](https://www.npmjs.com/package/prisma-sql-gen)
[![gitHub license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/zloom/prisma-sql-gen/blob/main/LICENSE)
# Prisma SQL generator
A tool to create SQL init script for your database from prisma shema file.
This tool can help when you need to initialise fresh databse from actual prisma schema without interacting with prisma cli.
## Motivation and limitations
Prisma provide way to create db with schema with following command `npx prisma migrate dev`.

This method have following limitations:
- It uses migrations and performs checks so works slow when applications have migrations history.
- It requires shell command to run which is complicates app startup logic.
  
This causes problems when you need to deploy fresh instance of you app or create database for testing. In such cases db should be created quickly, without migrations.
Also shell not fits well if you prefer to kepp startup logic in application entrypoint.

I created this tool following above considerations. Unluck it is a bit hacky and depends on prisma internal package [@prisma/migrate](https://github.com/prisma/prisma/tree/main/packages/migrate). I used fixed version because of breaking changes, if you have version conflict just inline this tool youself ;) 

## Usage
```typescript
import { schemaToScript } from 'prisma-sql-gen'

//Get SQL statements to create all db objets from schema
const script = await schemaToScript('src/schema.prisma')

//You need to create database
const prisma = new PrismaClient({ datasourceUrl: `file:${name}.db` })
prisma.$executeRawUnsafe('CREATE DATABASE IF NOT EXISTS test;')

//Output format is multiline sql so you need to breakdown to statements, and filter empty lines
for (const line of script.split(';').filter(s => s)) {
  await prisma.$executeRawUnsafe(line)
}
```
## License
This project is licensed under the MIT License


