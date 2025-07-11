import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { contractionsRouter } from './api/contractions'
import { hospitalsRouter } from './api/hospitals'

const app = new Hono()

app.use('*', logger())
app.use('*', cors())

app.get('/', (c) => {
  return c.json({ message: '陣痛アプリ API' })
})

app.route('/api/contractions', contractionsRouter)
app.route('/api/hospitals', hospitalsRouter)

const port = 3001
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})