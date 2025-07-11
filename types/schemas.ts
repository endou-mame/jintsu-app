import { z } from 'zod'

// 陣痛記録のスキーマ
export const contractionSchema = z.object({
  id: z.number().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  durationSeconds: z.number().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
})

export const createContractionSchema = z.object({
  startTime: z.string().datetime()
})

export const updateContractionSchema = z.object({
  endTime: z.string().datetime()
})

// 病院情報のスキーマ
export const hospitalSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  phoneNumber: z.string().min(1),
  address: z.string().optional(),
  notes: z.string().optional(),
  isPrimary: z.boolean().default(false),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
})

export const createHospitalSchema = z.object({
  name: z.string().min(1),
  phoneNumber: z.string().min(1),
  address: z.string().optional(),
  notes: z.string().optional(),
  isPrimary: z.boolean().default(false)
})

export const updateHospitalSchema = createHospitalSchema.partial()

// 型定義
export type Contraction = z.infer<typeof contractionSchema>
export type CreateContraction = z.infer<typeof createContractionSchema>
export type UpdateContraction = z.infer<typeof updateContractionSchema>

export type Hospital = z.infer<typeof hospitalSchema>
export type CreateHospital = z.infer<typeof createHospitalSchema>
export type UpdateHospital = z.infer<typeof updateHospitalSchema>