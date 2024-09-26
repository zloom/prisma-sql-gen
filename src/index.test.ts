import { schemaToScript } from './index'
import { PrismaClient } from '@prisma/client'
import { v4 } from 'uuid'

test('Tool produces output script', async () => {
  const script = await schemaToScript('src/schema.prisma')
  expect(script).toContain('CREATE TABLE')
})

test('Create database and init connection', async () => {
  const name = v4()
  const script = await schemaToScript('src/schema.prisma')
  const prisma = new PrismaClient({ datasourceUrl: `file:${name}.db` })

  prisma.$executeRawUnsafe('CREATE DATABASE IF NOT EXISTS test;')
  for (const line of script.split(';').filter(s => s)) {
    await prisma.$executeRawUnsafe(line)
  }

  const user = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@prisma.io',
      posts: {
        create: [
          { title: 'Hello World', published: true },
          { title: 'My second post', content: 'This is still a draft' }
        ],
      },
    },
  })

  expect(user.id).toBe(1)

  const posts = await prisma.post.findMany({ select: { title: true } })
  expect(posts.map(p => p.title)).toContain('My second post')
})