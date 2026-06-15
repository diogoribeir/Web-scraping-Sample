import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import type { ItemConteudo, Situacao } from "./types";

// Banco local SQLite (Fase 1). Escala para Supabase/Postgres depois.
// O arquivo fica em /data/bagagem.db (gitignored).

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "bagagem.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  migrate(db);
  _db = db;
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      lingua_materna TEXT NOT NULL,
      idioma_alvo TEXT NOT NULL,
      destino TEXT NOT NULL,
      data_viagem TEXT NOT NULL,
      contexto TEXT NOT NULL,          -- JSON array de situações
      nivel TEXT NOT NULL,
      criado_em TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS content (
      id TEXT PRIMARY KEY,
      tipo TEXT NOT NULL,              -- frase | regra | vocab
      situacao TEXT NOT NULL,
      alvo TEXT NOT NULL,
      traducao TEXT NOT NULL,
      nivel TEXT NOT NULL,
      fonte TEXT NOT NULL,
      status TEXT NOT NULL             -- verificado | pendente
    );

    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      content_id TEXT NOT NULL,
      fsrs_state TEXT,                 -- reservado p/ Fase 4 (FSRS)
      criado_em TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS errors (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      tipo TEXT NOT NULL,
      exemplo TEXT NOT NULL,
      regra TEXT NOT NULL,
      resolvido INTEGER NOT NULL DEFAULT 0,
      criado_em TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      descricao TEXT NOT NULL,
      situacao TEXT NOT NULL,
      semana_alvo INTEGER NOT NULL,
      status TEXT NOT NULL             -- pendente | em_progresso | concluida
    );
  `);
}

// ── Conteúdo (camada B) ──────────────────────────────────────────────────────

export function upsertConteudo(item: ItemConteudo) {
  const db = getDb();
  db.prepare(
    `INSERT INTO content (id, tipo, situacao, alvo, traducao, nivel, fonte, status)
     VALUES (@id, @tipo, @situacao, @alvo, @traducao, @nivel, @fonte, @status)
     ON CONFLICT(id) DO UPDATE SET
       tipo=@tipo, situacao=@situacao, alvo=@alvo, traducao=@traducao,
       nivel=@nivel, fonte=@fonte, status=@status`,
  ).run(item);
}

export function contarConteudo(): { total: number; verificado: number } {
  const db = getDb();
  const total = (db.prepare(`SELECT COUNT(*) c FROM content`).get() as { c: number }).c;
  const verificado = (
    db.prepare(`SELECT COUNT(*) c FROM content WHERE status='verificado'`).get() as { c: number }
  ).c;
  return { total, verificado };
}

// Recupera conteúdo VERIFICADO relevante para o RAG (filtra por situações).
export function buscarConteudoVerificado(situacoes: Situacao[], limite = 12): ItemConteudo[] {
  const db = getDb();
  const lista = situacoes.length ? situacoes : [];
  let rows: ItemConteudo[];
  if (lista.length) {
    const placeholders = lista.map(() => "?").join(",");
    rows = db
      .prepare(
        `SELECT * FROM content
         WHERE status='verificado' AND (situacao IN (${placeholders}) OR situacao='geral')
         ORDER BY CASE situacao WHEN 'geral' THEN 1 ELSE 0 END
         LIMIT ?`,
      )
      .all(...lista, limite) as ItemConteudo[];
  } else {
    rows = db
      .prepare(`SELECT * FROM content WHERE status='verificado' LIMIT ?`)
      .all(limite) as ItemConteudo[];
  }
  return rows;
}
