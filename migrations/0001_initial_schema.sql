CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT, email TEXT, city TEXT, university TEXT, major TEXT,
  job_target TEXT, notes TEXT, tags TEXT DEFAULT '[]', logo_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS resumes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER,
  title TEXT NOT NULL DEFAULT 'سيرة ذاتية جديدة',
  language TEXT DEFAULT 'ar',
  template TEXT DEFAULT 'ats1',
  data TEXT DEFAULT '{}',
  customization TEXT DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  is_favorite INTEGER DEFAULT 0,
  ats_score INTEGER DEFAULT 0,
  public_slug TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);
CREATE TABLE IF NOT EXISTS resume_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resume_id INTEGER NOT NULL,
  data TEXT, customization TEXT, template TEXT, language TEXT, note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resume_id) REFERENCES resumes(id)
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT, entity TEXT, entity_id INTEGER, details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS ai_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider TEXT, task TEXT, prompt TEXT, response TEXT, resume_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS cover_letters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER, resume_id INTEGER,
  title TEXT, language TEXT DEFAULT 'ar', content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_resumes_client ON resumes(client_id);
CREATE INDEX IF NOT EXISTS idx_resumes_slug ON resumes(public_slug);
CREATE INDEX IF NOT EXISTS idx_versions_resume ON resume_versions(resume_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at);
