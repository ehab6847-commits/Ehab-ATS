import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import {
  generateResumeFromSmartEngine,
  handleSmartAssist,
  generateCoverLetterFromSmartEngine
} from './aiEngine'

type Bindings = { DB: D1Database }
const app = new Hono<{ Bindings: Bindings }>()

const AUTH_KEY = 'wuda5U9u_Yk'
const SECRET = 'ehab-ats-secret-2026-x9'

// ---------- In-memory Fallback DB for standalone execution ----------
class MemoryDB {
  private clients: any[] = []
  private resumes: any[] = []
  private versions: any[] = []
  private settings: Record<string, string> = { ai_provider: 'smart' }
  private activity: any[] = []
  private aiHistory: any[] = []
  private coverLetters: any[] = []
  private idCounter = 1

  private specialists: any[] = [
    { id: 1, name: 'أحمد الإبراهيم (مختص رئيسي)', email: 'ahmed@ehabats.com', phone: '0501234567', role: 'specialist', access_key: 'sp_demo1', status: 'active', created_at: new Date().toISOString(), last_active: new Date().toISOString() }
  ]

  prepare(sql: string) {
    const s = sql.trim().toUpperCase()
    const self = this

    return {
      bind(...params: any[]) {
        return {
          async all<T = any>(): Promise<{ results: T[] }> {
            if (s.includes('FROM SPECIALISTS')) {
              let res = [...self.specialists]
              if (params[0] && s.includes('WHERE ACCESS_KEY=?')) {
                res = res.filter(x => x.access_key === params[0])
              } else if (params[0] && s.includes('WHERE ID=?')) {
                res = res.filter(x => x.id == params[0])
              }
              return { results: res as any }
            }
            if (s.includes('FROM CLIENTS')) {
              let res = [...self.clients]
              if (params[0] && s.includes('LIKE')) {
                const term = String(params[0]).replace(/%/g, '').toLowerCase()
                res = res.filter(c =>
                  (c.name || '').toLowerCase().includes(term) ||
                  (c.phone || '').toLowerCase().includes(term) ||
                  (c.email || '').toLowerCase().includes(term) ||
                  (c.job_target || '').toLowerCase().includes(term)
                )
              } else if (params[0] && s.includes('WHERE ID=?')) {
                res = res.filter(c => c.id == params[0])
              }
              return { results: res as any }
            }
            if (s.includes('FROM RESUMES')) {
              let res = self.resumes.map(r => {
                const client = self.clients.find(c => c.id === r.client_id)
                return { ...r, client_name: client ? client.name : null }
              })
              if (s.includes('WHERE CLIENT_ID=?')) {
                res = res.filter(r => r.client_id == params[0])
              } else if (s.includes('WHERE R.ID=?') || s.includes('WHERE PUBLIC_SLUG=?')) {
                res = res.filter(r => r.id == params[0] || r.public_slug == params[0])
              }
              return { results: res as any }
            }
            if (s.includes('FROM SETTINGS')) {
              if (s.includes('WHERE KEY=?')) {
                const k = params[0]
                const val = self.settings[k]
                return { results: val ? [{ key: k, value: val }] : [] as any }
              }
              const res = Object.entries(self.settings).map(([key, value]) => ({ key, value }))
              return { results: res as any }
            }
            if (s.includes('FROM ACTIVITY_LOG')) {
              return { results: [...self.activity].reverse() as any }
            }
            if (s.includes('FROM AI_HISTORY')) {
              return { results: [...self.aiHistory].reverse() as any }
            }
            if (s.includes('FROM COVER_LETTERS')) {
              return { results: [...self.coverLetters].reverse() as any }
            }
            if (s.includes('FROM RESUME_VERSIONS')) {
              let res = [...self.versions]
              if (params[0]) res = res.filter(v => v.resume_id == params[0])
              return { results: res as any }
            }
            return { results: [] }
          },
          async first<T = any>(): Promise<T | null> {
            const allRes = await this.all<T>()
            return allRes.results[0] || null
          },
          async run(): Promise<{ meta: { last_row_id: number } }> {
            const id = self.idCounter++
            const now = new Date().toISOString()

            if (s.startsWith('INSERT INTO SPECIALISTS')) {
              self.specialists.push({ id, name: params[0], email: params[1], phone: params[2], role: params[3], access_key: params[4], status: params[5] || 'active', created_at: now, last_active: now })
            } else if (s.startsWith('INSERT INTO CLIENTS')) {
              self.clients.push({ id, name: params[0], phone: params[1], email: params[2], city: params[3], university: params[4], major: params[5], job_target: params[6], notes: params[7], tags: params[8], logo_url: params[9], created_at: now, updated_at: now })
            } else if (s.startsWith('INSERT INTO RESUMES')) {
              self.resumes.push({ id, client_id: params[0], title: params[1], language: params[2], template: params[3], data: params[4], customization: params[5], status: params[6], public_slug: params[7], is_favorite: 0, ats_score: 0, created_at: now, updated_at: now })
            } else if (s.startsWith('INSERT INTO SETTINGS')) {
              self.settings[params[0]] = params[1]
            } else if (s.startsWith('INSERT INTO ACTIVITY_LOG')) {
              self.activity.push({ id, action: params[0], entity: params[1], entity_id: params[2], details: params[3], created_at: now })
            } else if (s.startsWith('INSERT INTO AI_HISTORY')) {
              self.aiHistory.push({ id, provider: params[0], task: params[1], prompt: params[2], response: params[3], resume_id: params[4], created_at: now })
            } else if (s.startsWith('INSERT INTO COVER_LETTERS')) {
              self.coverLetters.push({ id, client_id: params[0], resume_id: params[1], title: params[2], language: params[3], content: params[4], created_at: now, updated_at: now })
            } else if (s.startsWith('UPDATE SPECIALISTS')) {
              const sp = self.specialists.find(x => x.id == params[params.length - 1])
              if (sp) {
                if (s.includes('STATUS=?')) sp.status = params[0]
                if (s.includes('LAST_ACTIVE=')) sp.last_active = now
              }
            } else if (s.startsWith('UPDATE CLIENTS')) {
              const idx = self.clients.findIndex(c => c.id == params[params.length - 1])
              if (idx !== -1) {
                self.clients[idx] = { ...self.clients[idx], name: params[0], phone: params[1], email: params[2], city: params[3], university: params[4], major: params[5], job_target: params[6], notes: params[7], tags: params[8], logo_url: params[9], updated_at: now }
              }
            } else if (s.startsWith('UPDATE RESUMES')) {
              const rId = params[params.length - 1]
              const r = self.resumes.find(x => x.id == rId)
              if (r) {
                r.updated_at = now
              }
            } else if (s.startsWith('DELETE FROM SPECIALISTS')) {
              self.specialists = self.specialists.filter(c => c.id != params[0])
            } else if (s.startsWith('DELETE FROM CLIENTS')) {
              self.clients = self.clients.filter(c => c.id != params[0])
            } else if (s.startsWith('DELETE FROM RESUMES')) {
              self.resumes = self.resumes.filter(r => r.id != params[0])
            }
            return { meta: { last_row_id: id } }
          }
        }
      }
    }
  }
}

const memoryDb = new MemoryDB()

let _dbInitialized = false
async function ensureTables(db: D1Database) {
  if (_dbInitialized || !db) return
  try {
    const sqls = [
      `CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, phone TEXT, email TEXT, city TEXT, university TEXT, major TEXT,
        job_target TEXT, notes TEXT, tags TEXT DEFAULT '[]', logo_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER,
        title TEXT NOT NULL DEFAULT 'سيرة ذاتية جديدة',
        language TEXT DEFAULT 'ar', template TEXT DEFAULT 'ats1',
        data TEXT DEFAULT '{}', customization TEXT DEFAULT '{}',
        status TEXT DEFAULT 'draft', is_favorite INTEGER DEFAULT 0, ats_score INTEGER DEFAULT 0,
        public_slug TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS resume_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resume_id INTEGER NOT NULL,
        data TEXT, customization TEXT, template TEXT, language TEXT, note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY, value TEXT, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS activity_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT, entity TEXT, entity_id INTEGER, details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS ai_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider TEXT, task TEXT, prompt TEXT, response TEXT, resume_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS cover_letters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER, resume_id INTEGER,
        title TEXT, language TEXT DEFAULT 'ar', content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS specialists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, phone TEXT, email TEXT, role TEXT DEFAULT 'specialist',
        access_key TEXT NOT NULL, status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, last_active DATETIME DEFAULT CURRENT_TIMESTAMP
      );`
    ]
    for (const sql of sqls) {
      await db.prepare(sql).run().catch(() => {})
    }
    _dbInitialized = true
  } catch (e) {
    console.error('Database initialization error:', e)
  }
}

function getDB(c: any): D1Database {
  const db = c.env?.DB || (memoryDb as unknown as D1Database)
  ensureTables(db)
  return db
}

// ---------- token helpers (HMAC-SHA256, stateless) ----------
async function hmac(msg: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg))
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
async function makeToken(userRole: string = 'admin', userName: string = 'إيهاب'): Promise<string> {
  const exp = Date.now() + 7 * 24 * 3600 * 1000
  const payload = `ehab.${exp}`
  return `${payload}.${await hmac(payload)}`
}
async function checkToken(t: string): Promise<boolean> {
  const parts = t.split('.')
  if (parts.length !== 3) return false
  const [u, exp, sig] = parts
  if (u !== 'ehab' || Number(exp) < Date.now()) return false
  return (await hmac(`${u}.${exp}`)) === sig
}

app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './public' }))

// auth middleware
app.use('/api/*', async (c, next) => {
  const p = c.req.path
  if (p === '/api/auth/login' || p.startsWith('/api/public/')) return next()
  const h = c.req.header('Authorization') || ''
  const tok = h.replace('Bearer ', '')
  if (!tok || !(await checkToken(tok))) return c.json({ error: 'unauthorized' }, 401)
  return next()
})

// ---------- helpers ----------
async function logActivity(db: D1Database, action: string, entity: string, entityId: number | null, details: string) {
  try { await db.prepare('INSERT INTO activity_log (action, entity, entity_id, details) VALUES (?,?,?,?)').bind(action, entity, entityId, details).run() } catch {}
}
function slug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let s = ''
  const a = crypto.getRandomValues(new Uint8Array(8))
  for (const b of a) s += chars[b % chars.length]
  return s
}

// ---------- auth ----------
app.post('/api/auth/login', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const { key } = await c.req.json().catch(() => ({ key: '' }))
  const cleanKey = (key || '').trim()

  if (cleanKey === AUTH_KEY) {
    await logActivity(db, 'login', 'admin', 1, 'دخول الأدمن الرئيسي (إيهاب)')
    return c.json({ token: await makeToken('admin', 'إيهاب'), role: 'admin', name: 'إيهاب (الأدمن)' })
  }

  const sp = await db.prepare('SELECT * FROM specialists WHERE access_key=? AND status="active"').bind(cleanKey).first<any>()
  if (sp) {
    await db.prepare('UPDATE specialists SET last_active=CURRENT_TIMESTAMP WHERE id=?').bind(sp.id).run()
    await logActivity(db, 'login', 'specialist', sp.id, `دخول المختص: ${sp.name}`)
    return c.json({ token: await makeToken('specialist', sp.name), role: 'specialist', name: sp.name })
  }

  return c.json({ error: 'المفتاح غير صحيح أو الحساب مجمد' }, 401)
})

// ---------- specialists management ----------
app.get('/api/specialists', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const rs = await db.prepare('SELECT * FROM specialists ORDER BY id DESC').all()
  return c.json(rs?.results || [])
})

app.post('/api/specialists', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const b = await c.req.json()
  const accessKey = 'sp_' + Math.random().toString(36).slice(2, 10)
  const r = await db.prepare('INSERT INTO specialists (name,email,phone,role,access_key,status) VALUES (?,?,?,?,?,?)')
    .bind(b.name || 'مختص جديد', b.email || '', b.phone || '', b.role || 'specialist', accessKey, 'active').run()
  await logActivity(db, 'create', 'specialist', r.meta.last_row_id as number, `إضافة مختص: ${b.name}`)
  return c.json({ id: r.meta.last_row_id, access_key: accessKey })
})

app.put('/api/specialists/:id/status', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const id = c.req.param('id')
  const b = await c.req.json()
  await db.prepare('UPDATE specialists SET status=? WHERE id=?').bind(b.status || 'active', id).run()
  await logActivity(db, 'update_status', 'specialist', Number(id), `تغيير حالة المختص إلى ${b.status}`)
  return c.json({ ok: true })
})

app.delete('/api/specialists/:id', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const id = c.req.param('id')
  await db.prepare('DELETE FROM specialists WHERE id=?').bind(id).run()
  await logActivity(db, 'delete', 'specialist', Number(id), 'حذف مختص')
  return c.json({ ok: true })
})

// ---------- clients ----------
app.get('/api/clients', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const q = c.req.query('q') || ''
  let rs
  if (q) {
    const like = `%${q}%`
    rs = await db.prepare('SELECT * FROM clients WHERE name LIKE ? OR phone LIKE ? OR email LIKE ? OR job_target LIKE ? ORDER BY updated_at DESC').bind(like, like, like, like).all()
  } else {
    rs = await db.prepare('SELECT * FROM clients ORDER BY updated_at DESC').all()
  }
  return c.json(rs?.results || [])
})
app.get('/api/clients/:id', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const id = c.req.param('id')
  const client = await db.prepare('SELECT * FROM clients WHERE id=?').bind(id).first()
  if (!client) return c.notFound()
  const resumes = await db.prepare('SELECT id,title,language,template,status,is_favorite,ats_score,public_slug,updated_at FROM resumes WHERE client_id=? ORDER BY updated_at DESC').bind(id).all()
  return c.json({ ...client, resumes: resumes?.results || [] })
})
app.post('/api/clients', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const b = await c.req.json()
  const r = await db.prepare('INSERT INTO clients (name,phone,email,city,university,major,job_target,notes,tags,logo_url) VALUES (?,?,?,?,?,?,?,?,?,?)')
    .bind(b.name || 'عميل جديد', b.phone || '', b.email || '', b.city || '', b.university || '', b.major || '', b.job_target || '', b.notes || '', JSON.stringify(b.tags || []), b.logo_url || '').run()
  await logActivity(db, 'create', 'client', r.meta.last_row_id as number, b.name || '')
  return c.json({ id: r.meta.last_row_id })
})
app.put('/api/clients/:id', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const id = c.req.param('id')
  const b = await c.req.json()
  await db.prepare('UPDATE clients SET name=?,phone=?,email=?,city=?,university=?,major=?,job_target=?,notes=?,tags=?,logo_url=?,updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .bind(b.name, b.phone || '', b.email || '', b.city || '', b.university || '', b.major || '', b.job_target || '', b.notes || '', JSON.stringify(b.tags || []), b.logo_url || '', id).run()
  await logActivity(db, 'update', 'client', Number(id), b.name || '')
  return c.json({ ok: true })
})
app.delete('/api/clients/:id', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const id = c.req.param('id')
  await db.prepare('DELETE FROM clients WHERE id=?').bind(id).run()
  await logActivity(db, 'delete', 'client', Number(id), '')
  return c.json({ ok: true })
})

// ---------- resumes ----------
app.get('/api/resumes', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const q = c.req.query('q') || ''
  const status = c.req.query('status') || ''
  const fav = c.req.query('favorite') || ''
  let sql = 'SELECT r.id,r.client_id,r.title,r.language,r.template,r.status,r.is_favorite,r.ats_score,r.public_slug,r.created_at,r.updated_at,c.name as client_name FROM resumes r LEFT JOIN clients c ON c.id=r.client_id WHERE 1=1'
  const params: any[] = []
  if (q) { sql += ' AND (r.title LIKE ? OR c.name LIKE ?)'; params.push(`%${q}%`, `%${q}%`) }
  if (status) { sql += ' AND r.status=?'; params.push(status) }
  if (fav === '1') { sql += ' AND r.is_favorite=1' }
  sql += ' ORDER BY r.updated_at DESC'
  const rs = await db.prepare(sql).bind(...params).all()
  return c.json(rs?.results || [])
})
app.get('/api/resumes/:id', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const r = await db.prepare('SELECT r.*, c.name as client_name FROM resumes r LEFT JOIN clients c ON c.id=r.client_id WHERE r.id=?').bind(c.req.param('id')).first()
  if (!r) return c.notFound()
  return c.json(r)
})
app.post('/api/resumes', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const b = await c.req.json()
  const s = slug()
  const dataStr = typeof b.data === 'string' ? b.data : JSON.stringify(b.data || {})
  const custStr = typeof b.customization === 'string' ? b.customization : JSON.stringify(b.customization || {})
  const r = await db.prepare('INSERT INTO resumes (client_id,title,language,template,data,customization,status,public_slug) VALUES (?,?,?,?,?,?,?,?)')
    .bind(b.client_id || null, b.title || 'سيرة ذاتية جديدة', b.language || 'ar', b.template || 'ats1', dataStr, custStr, b.status || 'draft', s).run()
  await logActivity(db, 'create', 'resume', r.meta.last_row_id as number, b.title || '')
  return c.json({ id: r.meta.last_row_id, public_slug: s })
})
app.put('/api/resumes/:id', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const id = c.req.param('id')
  const b = await c.req.json()
  if (b.save_version) {
    const cur = await db.prepare('SELECT data,customization,template,language FROM resumes WHERE id=?').bind(id).first<any>()
    if (cur) {
      await db.prepare('INSERT INTO resume_versions (resume_id,data,customization,template,language,note) VALUES (?,?,?,?,?,?)')
        .bind(id, cur.data, cur.customization, cur.template, cur.language, b.version_note || '').run()
      await db.prepare('DELETE FROM resume_versions WHERE resume_id=? AND id NOT IN (SELECT id FROM resume_versions WHERE resume_id=? ORDER BY id DESC LIMIT 30)').bind(id, id).run()
    }
  }
  const fields: string[] = []
  const params: any[] = []
  for (const f of ['title', 'language', 'template', 'status', 'client_id', 'is_favorite', 'ats_score']) {
    if (b[f] !== undefined) { fields.push(`${f}=?`); params.push(b[f]) }
  }
  if (b.data !== undefined) { fields.push('data=?'); params.push(typeof b.data === 'string' ? b.data : JSON.stringify(b.data)) }
  if (b.customization !== undefined) { fields.push('customization=?'); params.push(typeof b.customization === 'string' ? b.customization : JSON.stringify(b.customization)) }
  if (fields.length) {
    fields.push('updated_at=CURRENT_TIMESTAMP')
    params.push(id)
    await db.prepare(`UPDATE resumes SET ${fields.join(',')} WHERE id=?`).bind(...params).run()
  }
  return c.json({ ok: true })
})
app.delete('/api/resumes/:id', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const id = c.req.param('id')
  await db.prepare('DELETE FROM resume_versions WHERE resume_id=?').bind(id).run()
  await db.prepare('DELETE FROM resumes WHERE id=?').bind(id).run()
  await logActivity(db, 'delete', 'resume', Number(id), '')
  return c.json({ ok: true })
})
app.post('/api/resumes/:id/duplicate', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const id = c.req.param('id')
  const cur = await db.prepare('SELECT * FROM resumes WHERE id=?').bind(id).first<any>()
  if (!cur) return c.notFound()
  const s = slug()
  const r = await db.prepare('INSERT INTO resumes (client_id,title,language,template,data,customization,status,public_slug) VALUES (?,?,?,?,?,?,?,?)')
    .bind(cur.client_id, cur.title + ' (نسخة)', cur.language, cur.template, cur.data, cur.customization, 'draft', s).run()
  await logActivity(db, 'duplicate', 'resume', r.meta.last_row_id as number, cur.title)
  return c.json({ id: r.meta.last_row_id })
})
app.get('/api/resumes/:id/versions', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const rs = await db.prepare('SELECT id,note,template,language,created_at FROM resume_versions WHERE resume_id=? ORDER BY id DESC').bind(c.req.param('id')).all()
  return c.json(rs?.results || [])
})
app.get('/api/versions/:vid', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const v = await db.prepare('SELECT * FROM resume_versions WHERE id=?').bind(c.req.param('vid')).first()
  if (!v) return c.notFound()
  return c.json(v)
})
app.post('/api/resumes/:id/restore/:vid', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const { id, vid } = c.req.param()
  const v = await db.prepare('SELECT * FROM resume_versions WHERE id=? AND resume_id=?').bind(vid, id).first<any>()
  if (!v) return c.notFound()
  const cur = await db.prepare('SELECT data,customization,template,language FROM resumes WHERE id=?').bind(id).first<any>()
  if (cur) await db.prepare('INSERT INTO resume_versions (resume_id,data,customization,template,language,note) VALUES (?,?,?,?,?,?)')
    .bind(id, cur.data, cur.customization, cur.template, cur.language, 'قبل الاستعادة').run()
  await db.prepare('UPDATE resumes SET data=?,customization=?,template=?,language=?,updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .bind(v.data, v.customization, v.template, v.language, id).run()
  await logActivity(db, 'restore', 'resume', Number(id), `v${vid}`)
  return c.json({ ok: true })
})

// ---------- cover letters ----------
app.get('/api/cover-letters', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const rs = await db.prepare('SELECT cl.*, c.name as client_name FROM cover_letters cl LEFT JOIN clients c ON c.id=cl.client_id ORDER BY cl.updated_at DESC').all()
  return c.json(rs?.results || [])
})
app.post('/api/cover-letters', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const b = await c.req.json()
  const r = await db.prepare('INSERT INTO cover_letters (client_id,resume_id,title,language,content) VALUES (?,?,?,?,?)')
    .bind(b.client_id || null, b.resume_id || null, b.title || 'خطاب تغطية', b.language || 'ar', b.content || '').run()
  await logActivity(db, 'create', 'cover_letter', r.meta.last_row_id as number, b.title || '')
  return c.json({ id: r.meta.last_row_id })
})
app.put('/api/cover-letters/:id', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const b = await c.req.json()
  await db.prepare('UPDATE cover_letters SET title=?,language=?,content=?,updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .bind(b.title, b.language || 'ar', b.content || '', c.req.param('id')).run()
  return c.json({ ok: true })
})
app.delete('/api/cover-letters/:id', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  await db.prepare('DELETE FROM cover_letters WHERE id=?').bind(c.req.param('id')).run()
  return c.json({ ok: true })
})

// ---------- settings ----------
app.get('/api/settings', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const rs = await db.prepare('SELECT key,value FROM settings').all<any>()
  const out: Record<string, string> = {}
  for (const row of rs?.results || []) {
    if (row.key.includes('api_key') && row.value) {
      out[row.key] = row.value.slice(0, 4) + '••••••••' + row.value.slice(-4)
    } else out[row.key] = row.value
  }
  return c.json(out)
})
app.put('/api/settings', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const b = await c.req.json()
  for (const [k, v] of Object.entries(b)) {
    if (typeof v !== 'string') continue
    if (v.includes('••••')) continue
    await db.prepare('INSERT INTO settings (key,value,updated_at) VALUES (?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP').bind(k, v).run()
  }
  await logActivity(db, 'update', 'settings', null, Object.keys(b).join(','))
  return c.json({ ok: true })
})

// ---------- activity + ai history + stats ----------
app.get('/api/activity', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const rs = await db.prepare('SELECT * FROM activity_log ORDER BY id DESC LIMIT 100').all()
  return c.json(rs?.results || [])
})
app.get('/api/ai-history', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const rs = await db.prepare('SELECT id,provider,task,prompt,substr(response,1,500) as response,resume_id,created_at FROM ai_history ORDER BY id DESC LIMIT 100').all()
  return c.json(rs?.results || [])
})
app.get('/api/stats', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const [clients, resumes, drafts, finals, favs, ai] = await Promise.all([
    db.prepare('SELECT COUNT(*) n FROM clients').first<any>().catch(() => ({ n: 0 })),
    db.prepare('SELECT COUNT(*) n FROM resumes').first<any>().catch(() => ({ n: 0 })),
    db.prepare("SELECT COUNT(*) n FROM resumes WHERE status='draft'").first<any>().catch(() => ({ n: 0 })),
    db.prepare("SELECT COUNT(*) n FROM resumes WHERE status='final'").first<any>().catch(() => ({ n: 0 })),
    db.prepare('SELECT COUNT(*) n FROM resumes WHERE is_favorite=1').first<any>().catch(() => ({ n: 0 })),
    db.prepare('SELECT COUNT(*) n FROM ai_history').first<any>().catch(() => ({ n: 0 }))
  ])
  const recent = await db.prepare('SELECT r.id,r.title,r.status,r.ats_score,r.updated_at,c.name as client_name FROM resumes r LEFT JOIN clients c ON c.id=r.client_id ORDER BY r.updated_at DESC LIMIT 6').all().catch(() => ({ results: [] }))
  return c.json({
    clients: clients?.n || 0,
    resumes: resumes?.n || 0,
    drafts: drafts?.n || 0,
    finals: finals?.n || 0,
    favorites: favs?.n || 0,
    ai_calls: ai?.n || 0,
    recent: recent?.results || []
  })
})

// ---------- AI proxy (DeepSeek / Gemini primary with Smart Engine Fallback) ----------
async function getSetting(db: D1Database, key: string): Promise<string> {
  try {
    const r = await db.prepare('SELECT value FROM settings WHERE key=?').bind(key).first<any>()
    return r?.value || ''
  } catch {
    return ''
  }
}
async function callDeepSeek(apiKey: string, system: string, prompt: string): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }], temperature: 0.7, max_tokens: 4000 }),
      signal: controller.signal
    })
    if (!res.ok) throw new Error(`DeepSeek ${res.status}: ${(await res.text()).slice(0, 200)}`)
    const j: any = await res.json()
    return j.choices?.[0]?.message?.content || ''
  } finally {
    clearTimeout(timer)
  }
}
async function callGemini(apiKey: string, system: string, prompt: string): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system_instruction: { parts: [{ text: system }] }, contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 4000 } }),
      signal: controller.signal
    })
    if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`)
    const j: any = await res.json()
    return j.candidates?.[0]?.content?.parts?.[0]?.text || ''
  } finally {
    clearTimeout(timer)
  }
}

app.post('/api/ai/generate', async (c) => {
  const b = await c.req.json()
  const db = getDB(c)
  await ensureTables(db)
  const system = b.system || 'أنت خبير كتابة سير ذاتية محترف متخصص في السوق السعودي وأنظمة ATS. اكتب محتوى احترافي دقيق.'
  const prompt = b.prompt || ''
  if (!prompt) return c.json({ error: 'prompt مطلوب' }, 400)

  const dsKey = await getSetting(db, 'deepseek_api_key')
  const gmKey = await getSetting(db, 'gemini_api_key')
  const pref = b.provider || (await getSetting(db, 'ai_provider')) || 'deepseek'

  let text = ''
  let used = ''
  let lastErr = ''

  if (pref !== 'smart') {
    const order = pref === 'gemini' ? ['gemini', 'deepseek'] : ['deepseek', 'gemini']
    for (const p of order) {
      try {
        if (p === 'deepseek' && dsKey && !dsKey.includes('••••')) {
          text = await callDeepSeek(dsKey, system, prompt)
          used = 'deepseek'
          break
        }
        if (p === 'gemini' && gmKey && !gmKey.includes('••••')) {
          text = await callGemini(gmKey, system, prompt)
          used = 'gemini'
          break
        }
      } catch (e: any) {
        lastErr = e.message
      }
    }
  }

  // Smart Engine Automatic Fallback (guarantees 100% successful generation even if API is missing or overloaded!)
  if (!text) {
    const task = b.task || 'full_resume'
    const lang = b.language || (prompt.toLowerCase().includes('english') ? 'en' : 'ar')

    if (task === 'full_resume') {
      const jobMatch = prompt.match(/لوظيفة:\s*"([^"]+)"/) || prompt.match(/position:\s*"([^"]+)"/) || prompt.match(/لوظيفة:\s*([^\n\.]+)/)
      const job = jobMatch ? jobMatch[1].trim() : 'أخصائي'
      text = generateResumeFromSmartEngine(job, prompt, lang)
      used = 'المحرك الذكي الداخلي ⚡ (توليد مخصص)'
    } else if (task.startsWith('assist_')) {
      const action = task.replace('assist_', '')
      text = handleSmartAssist(action, prompt, b.resume_id)
      used = 'المحرك الذكي الداخلي ⚡'
    } else if (task === 'cover_letter') {
      const nameMatch = prompt.match(/للمتقدم "([^"]+)"/) || prompt.match(/for "([^"]+)"/)
      const jobMatch = prompt.match(/لوظيفة "([^"]+)"/) || prompt.match(/applying for "([^"]+)"/)
      const name = nameMatch ? nameMatch[1] : 'المتقدم'
      const job = jobMatch ? jobMatch[1] : 'الوظيفة'
      text = generateCoverLetterFromSmartEngine(name, job, '', '', lang)
      used = 'المحرك الذكي الداخلي ⚡'
    } else {
      text = generateResumeFromSmartEngine('أخصائي', prompt, lang)
      used = 'المحرك الذكي الداخلي ⚡'
    }
  }

  try {
    await db.prepare('INSERT INTO ai_history (provider,task,prompt,response,resume_id) VALUES (?,?,?,?,?)')
      .bind(used, b.task || 'generate', prompt.slice(0, 1000), text.slice(0, 10000), b.resume_id || null).run()
  } catch {}

  return c.json({ text, provider: used })
})

// ---------- public CV ----------
app.get('/api/public/cv/:slug', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const r = await db.prepare('SELECT title,language,template,data,customization FROM resumes WHERE public_slug=?').bind(c.req.param('slug')).first()
  if (!r) return c.notFound()
  return c.json(r)
})
app.get('/cv/:slug', async (c) => {
  const db = getDB(c)
  await ensureTables(db)
  const s = c.req.param('slug')
  const r = await db.prepare('SELECT title,language,template FROM resumes WHERE public_slug=?').bind(s).first<any>()
  if (!r) return c.html('<h1 style="font-family:sans-serif;text-align:center;margin-top:100px">404 — السيرة غير موجودة</h1>', 404)
  const dir = r.language === 'en' ? 'ltr' : 'rtl'
  return c.html(`<!DOCTYPE html>
<html lang="${r.language === 'en' ? 'en' : 'ar'}" dir="${dir}">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${r.title} | Ehab ATS</title>
<link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;600;700&family=Almarai:wght@300;400;700&family=Amiri:wght@400;700&family=Cairo:wght@300;400;600;700;800&family=Changa:wght@400;600;700&family=IBM+Plex+Sans+Arabic:wght@300;400;600;700&family=Inter:wght@300;400;600;700&family=Kufam:wght@400;600;700&family=Montserrat:wght@300;400;600;700&family=Noto+Sans+Arabic:wght@300;400;600;700&family=Outfit:wght@300;400;600;700&family=Readex+Pro:wght@300;400;600;700&family=Roboto:wght@300;400;600;700&family=Rubik:wght@300;400;600;700&family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<link href="/static/templates.css" rel="stylesheet">
<style>
body{margin:0;background:#e5e7eb;font-family:'Cairo',sans-serif}
.wrap{display:flex;flex-direction:column;align-items:center;padding:24px 8px}
.toolbar{margin-bottom:16px;display:flex;gap:10px}
.toolbar button{padding:10px 24px;border:0;border-radius:10px;background:#4f46e5;color:#fff;font-family:inherit;font-size:15px;font-weight:700;cursor:pointer}
.cv-page{width:794px;min-height:1123px;background:#fff;color:#1e293b;box-shadow:0 6px 30px rgba(15,23,42,.18);position:relative}
@media print{.toolbar{display:none}body{background:#fff}.wrap{padding:0}.cv-page{box-shadow:none}}
@page{size:A4;margin:0}
</style>
</head>
<body>
<div class="wrap">
<div class="toolbar"><button onclick="window.print()">🖨️ طباعة / حفظ PDF</button></div>
<div id="cv"></div>
</div>
<script src="/static/templates.js"></script>
<script>
fetch('/api/public/cv/${s}').then(r=>r.json()).then(r=>{
  const data = JSON.parse(r.data||'{}'); const cust = JSON.parse(r.customization||'{}');
  document.getElementById('cv').innerHTML = renderTemplate(r.template, data, cust, r.language);
});
</script>
</body></html>`)
})

// ---------- SPA shell ----------
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ehab ATS — منصة السير الذاتية الاحترافية</title>
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config={darkMode:'class',theme:{extend:{fontFamily:{cairo:['Cairo','sans-serif']}}}}</script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;600;700&family=Almarai:wght@300;400;700&family=Amiri:wght@400;700&family=Cairo:wght@300;400;600;700;800&family=Changa:wght@400;600;700&family=IBM+Plex+Sans+Arabic:wght@300;400;600;700&family=Inter:wght@300;400;600;700&family=Kufam:wght@400;600;700&family=Montserrat:wght@300;400;600;700&family=Noto+Sans+Arabic:wght@300;400;600;700&family=Outfit:wght@300;400;600;700&family=Readex+Pro:wght@300;400;600;700&family=Roboto:wght@300;400;600;700&family=Rubik:wght@300;400;600;700&family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">
<link href="/static/styles.css" rel="stylesheet">
<link href="/static/templates.css" rel="stylesheet">
</head>
<body class="font-cairo bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
<div id="root"></div>
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
<script src="/static/templates.js"></script>
<script src="/static/ats.js"></script>
<script src="/static/builder.js"></script>
<script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
