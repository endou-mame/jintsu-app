import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/jintsu_app'

export const sql = postgres(connectionString, {
  transform: {
    undefined: null
  }
})