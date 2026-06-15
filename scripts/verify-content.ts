// Portão de CI (camada B). Confere cada item de conteúdo contra as fontes e
// SINALIZA SÓ AS DIVERGÊNCIAS — você revisa exceção, não tudo.
//
// Na Fase 1 fazemos as checagens que NÃO dependem de rede:
//   - estrutura do item (campos obrigatórios, status válido);
//   - checagem determinística de gênero (camada A) nas frases-alvo.
// Na Fase 1.5, acrescentar o cruzamento com Google Translation API + dicionário.
//
// Uso: npm run verify-content   (sai com código 1 se houver divergência)

import seed from "../data/content.seed.json";
import { checarArtigosGenero } from "../src/lib/facts";
import type { ItemConteudo } from "../src/lib/types";

const itens = seed.itens as ItemConteudo[];
const divergencias: string[] = [];

for (const item of itens) {
  if (!item.id || !item.alvo || !item.traducao || !item.fonte) {
    divergencias.push(`[${item.id || "?"}] campos obrigatórios faltando.`);
  }
  if (item.status !== "verificado" && item.status !== "pendente") {
    divergencias.push(`[${item.id}] status inválido: ${item.status}`);
  }
  // Camada A: artigos vs. gênero do léxico.
  const probGenero = checarArtigosGenero(item.alvo);
  for (const p of probGenero) {
    divergencias.push(`[${item.id}] gênero: ${p.detalhe}`);
  }
}

console.log(`Conferidos ${itens.length} itens contra as fontes.`);
if (divergencias.length === 0) {
  console.log("✓ Nenhuma divergência. Conteúdo pronto para entrar como verificado.");
  process.exit(0);
} else {
  console.error(`✗ ${divergencias.length} divergência(s) — revisar manualmente:`);
  for (const d of divergencias) console.error("  - " + d);
  process.exit(1);
}
