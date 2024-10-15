import Database from 'better-sqlite3'
import { Thought } from './thoughts'

const db = new Database('./shower_thoughts.db', { verbose: console.log })

db.exec(`
  CREATE TABLE IF NOT EXISTS thoughts (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    username TEXT NOT NULL,
    twitter TEXT,
    votes_like INTEGER DEFAULT 0,
    votes_heart INTEGER DEFAULT 0,
    votes_mind_blown INTEGER DEFAULT 0,
    votes_poop INTEGER DEFAULT 0,
    bgColor TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`)

export function getThoughts(): Thought[] {
  const stmt = db.prepare(`
    SELECT * FROM thoughts
    ORDER BY createdAt DESC
  `)
  return stmt.all().map(row => ({
    ...row,
    votes: {
      like: row.votes_like,
      heart: row.votes_heart,
      mind_blown: row.votes_mind_blown,
      poop: row.votes_poop
    },
    createdAt: new Date(row.createdAt)
  }))
}

export function submitThought(thought: Omit<Thought, 'id' | 'votes' | 'bgColor' | 'createdAt'>): void {
  const stmt = db.prepare(`
    INSERT INTO thoughts (id, content, username, twitter, bgColor, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  const id = Date.now().toString()
  const bgColor = getRandomColor()
  const createdAt = new Date().toISOString()
  stmt.run(id, thought.content, thought.username, thought.twitter || null, bgColor, createdAt)
}

export function getFilteredThoughts(filter: 'hot' | 'new' | 'top'): Thought[] {
  let query = ''
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  switch (filter) {
    case 'hot':
      query = `
        SELECT * FROM thoughts
        WHERE createdAt >= ?
        ORDER BY (votes_like + votes_heart + votes_mind_blown) DESC
        LIMIT 100
      `
      return db.prepare(query).all(sevenDaysAgo).map(formatThought)
    case 'new':
      query = `
        SELECT * FROM thoughts
        ORDER BY createdAt DESC
        LIMIT 100
      `
      return db.prepare(query).all().map(formatThought)
    case 'top':
      query = `
        SELECT * FROM thoughts
        ORDER BY (votes_like + votes_heart + votes_mind_blown) DESC
        LIMIT 100
      `
      return db.prepare(query).all().map(formatThought)
    default:
      return getThoughts()
  }
}

function formatThought(row: any): Thought {
  return {
    ...row,
    votes: {
      like: row.votes_like,
      heart: row.votes_heart,
      mind_blown: row.votes_mind_blown,
      poop: row.votes_poop
    },
    createdAt: new Date(row.createdAt)
  }
}

function getRandomColor(): string {
  const colors = [
    'rgb(11 169 91)',
    'rgb(35 31 32)',
    'rgb(237 32 61)',
    'rgb(243 139 163)',
    'rgb(249 244 218)',
    'rgb(18 181 229)',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}