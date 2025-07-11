import { Hono } from 'hono'
import { sql } from '../db'
import { createContractionSchema, updateContractionSchema } from '../../types/schemas'
import type { Contraction } from '../../types/schemas'

export const contractionsRouter = new Hono()

// 全ての陣痛記録を取得
contractionsRouter.get('/', async (c) => {
  try {
    const contractions = await sql<Contraction[]>`
      SELECT 
        id,
        start_time as "startTime",
        end_time as "endTime",
        duration_seconds as "durationSeconds",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM contractions
      ORDER BY start_time DESC
    `
    
    return c.json(contractions)
  } catch (error) {
    return c.json({ error: 'Failed to fetch contractions' }, 500)
  }
})

// 新しい陣痛記録を作成
contractionsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const validated = createContractionSchema.parse(body)
    
    const [contraction] = await sql<Contraction[]>`
      INSERT INTO contractions (start_time)
      VALUES (${validated.startTime})
      RETURNING 
        id,
        start_time as "startTime",
        end_time as "endTime",
        duration_seconds as "durationSeconds",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `
    
    return c.json(contraction, 201)
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400)
    }
    return c.json({ error: 'Failed to create contraction' }, 500)
  }
})

// 陣痛記録を更新（終了時刻を記録）
contractionsRouter.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const body = await c.req.json()
    const validated = updateContractionSchema.parse(body)
    
    // 開始時刻を取得して経過時間を計算
    const [existing] = await sql<{ startTime: string }[]>`
      SELECT start_time as "startTime" FROM contractions WHERE id = ${id}
    `
    
    if (!existing) {
      return c.json({ error: 'Contraction not found' }, 404)
    }
    
    const durationSeconds = Math.floor(
      (new Date(validated.endTime).getTime() - new Date(existing.startTime).getTime()) / 1000
    )
    
    const [contraction] = await sql<Contraction[]>`
      UPDATE contractions
      SET 
        end_time = ${validated.endTime},
        duration_seconds = ${durationSeconds}
      WHERE id = ${id}
      RETURNING 
        id,
        start_time as "startTime",
        end_time as "endTime",
        duration_seconds as "durationSeconds",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `
    
    return c.json(contraction)
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400)
    }
    return c.json({ error: 'Failed to update contraction' }, 500)
  }
})

// 陣痛記録を削除
contractionsRouter.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    
    await sql`DELETE FROM contractions WHERE id = ${id}`
    
    return c.json({ message: 'Contraction deleted successfully' })
  } catch (error) {
    return c.json({ error: 'Failed to delete contraction' }, 500)
  }
})