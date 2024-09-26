import { MigrateEngine } from '@prisma/migrate/dist'
import { resolve } from 'path'

class GeneratorEngine extends MigrateEngine {
  public createScript: string
  constructor() {
    super({ projectDir: process.cwd(), schemaPath: '' })
    this.createScript = ''
    this['handleResponse'] = (response: string) => {
      try {
        this.createScript = JSON.parse(response).params.content
      } catch (error) {
        throw `Invalid response: ${error}, response ${response}`
      } finally {
        this.stop()
      }
    }
  }
}

export const schemaToScript = async (schemaPath: string = 'prisma/schema.prisma') => {
  const engine = new GeneratorEngine()
  try {
    await engine.migrateDiff({
      script: true,
      from: { tag: 'empty' },
      to: { tag: 'schemaDatamodel', schema: resolve(schemaPath) },
    })
  } catch (error) {}

  return engine.createScript
}