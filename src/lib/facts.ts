import factsData from "../../data/facts.json";
import type { ConjugacaoFato, GeneroFato, Fato } from "./types";

// Camada A — fatos determinísticos por LOOKUP. Sem IA "achando": só consulta.
// Em produção: Verbiste (conjugação) + Lexique.org/Wiktionary-Kaikki (gênero).

const conjugacoes = factsData.conjugacoes as ConjugacaoFato[];
const generos = factsData.generos as GeneroFato[];

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

export function lookupGenero(palavra: string): GeneroFato | null {
  const p = norm(palavra);
  return generos.find((g) => norm(g.palavra) === p) ?? null;
}

export function lookupConjugacao(forma: string): ConjugacaoFato | null {
  const f = norm(forma);
  return conjugacoes.find((c) => norm(c.forma) === f) ?? null;
}

// Dado um texto-alvo, devolve os fatos determinísticos relevantes (para o RAG).
export function fatosRelevantes(texto: string): Fato[] {
  const palavras = norm(texto).split(/[^a-zà-ÿ']+/i).filter(Boolean);
  const achados: Fato[] = [];
  const vistos = new Set<string>();

  for (const w of palavras) {
    const g = lookupGenero(w);
    if (g && !vistos.has("g:" + g.palavra)) {
      achados.push(g);
      vistos.add("g:" + g.palavra);
    }
    const c = lookupConjugacao(w);
    if (c && !vistos.has("c:" + c.forma)) {
      achados.push(c);
      vistos.add("c:" + c.forma);
    }
  }
  return achados;
}

// Checagem determinística: o artigo usado no texto bate com o gênero do léxico?
// Retorna divergências (vazio = ok).
export function checarArtigosGenero(texto: string): { palavra: string; detalhe: string }[] {
  const problemas: { palavra: string; detalhe: string }[] = [];
  // Captura "le/la/l'/un/une + palavra" de forma simples.
  const re = /\b(le|la|l'|un|une)\s+([a-zà-ÿ-]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(texto)) !== null) {
    const artigo = m[1].toLowerCase();
    const palavra = m[2];
    const fato = lookupGenero(palavra);
    if (!fato) continue; // sem fato → não opinamos (camada A só fala do que sabe)
    const indicaFem = artigo === "la" || artigo === "une";
    const indicaMasc = artigo === "le" || artigo === "un";
    if (indicaFem && fato.genero === "m") {
      problemas.push({
        palavra,
        detalhe: `"${artigo} ${palavra}" usa artigo feminino, mas "${palavra}" é masculino (${fato.artigo} ${palavra}). Fonte: ${fato.fonte}.`,
      });
    } else if (indicaMasc && fato.genero === "f") {
      problemas.push({
        palavra,
        detalhe: `"${artigo} ${palavra}" usa artigo masculino, mas "${palavra}" é feminino (${fato.artigo} ${palavra}). Fonte: ${fato.fonte}.`,
      });
    }
  }
  return problemas;
}
