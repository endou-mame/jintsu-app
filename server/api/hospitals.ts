import { Hono } from 'hono'
import { sql } from '../db'
import { createHospitalSchema, updateHospitalSchema } from '../../types/schemas'
import type { Hospital } from '../../types/schemas'

export const hospitalsRouter = new Hono()

// 全ての病院情報を取得
hospitalsRouter.get('/', async (c) => {
  try {
    const hospitals = await sql<Hospital[]>`
      SELECT 
        id,
        name,
        phone_number as "phoneNumber",
        address,
        notes,
        is_primary as "isPrimary",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM hospitals
      ORDER BY is_primary DESC, name ASC
    `
    
    return c.json(hospitals)
  } catch (error) {
    return c.json({ error: 'Failed to fetch hospitals' }, 500)
  }
})

// 新しい病院を登録
hospitalsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const validated = createHospitalSchema.parse(body)
    
    // 既にプライマリな病院がある場合は、新しい病院をプライマリにする前に既存のをfalseにする
    if (validated.isPrimary) {
      await sql`UPDATE hospitals SET is_primary = false WHERE is_primary = true`
    }
    
    const [hospital] = await sql<Hospital[]>`
      INSERT INTO hospitals (name, phone_number, address, notes, is_primary)
      VALUES (${validated.name}, ${validated.phoneNumber}, ${validated.address || null}, ${validated.notes || null}, ${validated.isPrimary})
      RETURNING 
        id,
        name,
        phone_number as "phoneNumber",
        address,
        notes,
        is_primary as "isPrimary",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `
    
    return c.json(hospital, 201)
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400)
    }
    return c.json({ error: 'Failed to create hospital' }, 500)
  }
})

// 病院情報を更新
hospitalsRouter.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const body = await c.req.json()
    const validated = updateHospitalSchema.parse(body)
    
    // プライマリ設定を更新する場合
    if (validated.isPrimary === true) {
      await sql`UPDATE hospitals SET is_primary = false WHERE is_primary = true AND id != ${id}`
    }
    
    const updates: string[] = []
    const values: unknown[] = []
    let paramCount = 1
    
    if (validated.name !== undefined) {
      updates.push(`name = $${paramCount++}`)
      values.push(validated.name)
    }
    if (validated.phoneNumber !== undefined) {
      updates.push(`phone_number = $${paramCount++}`)
      values.push(validated.phoneNumber)
    }
    if (validated.address !== undefined) {
      updates.push(`address = $${paramCount++}`)
      values.push(validated.address)
    }
    if (validated.notes !== undefined) {
      updates.push(`notes = $${paramCount++}`)
      values.push(validated.notes)
    }
    if (validated.isPrimary !== undefined) {
      updates.push(`is_primary = $${paramCount++}`)
      values.push(validated.isPrimary)
    }
    
    values.push(id)
    
    const [hospital] = await sql<Hospital[]>`
      UPDATE hospitals
      SET ${sql.unsafe(updates.join(', '))}
      WHERE id = $${paramCount}
      RETURNING 
        id,
        name,
        phone_number as "phoneNumber",
        address,
        notes,
        is_primary as "isPrimary",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `
    
    return c.json(hospital)
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400)
    }
    return c.json({ error: 'Failed to update hospital' }, 500)
  }
})

// 病院を削除
hospitalsRouter.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    
    await sql`DELETE FROM hospitals WHERE id = ${id}`
    
    return c.json({ message: 'Hospital deleted successfully' })
  } catch (error) {
    return c.json({ error: 'Failed to delete hospital' }, 500)
  }
})