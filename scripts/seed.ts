// Semeia o banco SQLite com o conteúdo verificado (camada B).
// Uso: npm run seed

import seed from "../data/content.seed.json";
import { upsertConteudo, contarConteudo } from "../src/lib/db";
import type { ItemConteudo } from "../src/lib/types";

const itens = seed.itens as ItemConteudo[];
for (const item of itens) upsertConteudo(item);

const { total, verificado } = contarConteudo();
console.log(`✓ Semeado. ${verificado}/${total} itens verificados no banco.`);
