import seed from "../../data/content.seed.json";
import { getDb, upsertConteudo, contarConteudo } from "./db";
import type { ItemConteudo } from "./types";

// Semeia o banco com o conteúdo verificado se ele estiver vazio.
// Idempotente: pode ser chamado a cada request sem custo relevante.

let _checado = false;

export function ensureSeeded(): void {
  if (_checado) return;
  getDb();
  const { total } = contarConteudo();
  if (total === 0) {
    const itens = seed.itens as ItemConteudo[];
    for (const item of itens) upsertConteudo(item);
  }
  _checado = true;
}
