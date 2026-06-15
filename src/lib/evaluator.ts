import { chamarModelo, extrairJSON, MODELO_AVALIADOR, MODO_DEMO } from "./anthropic";
import { systemPromptAvaliador } from "./prompts";
import { checarArtigosGenero } from "./facts";
import type { AvaliacaoFrase, ResultadoGuarda, SaidaTutor } from "./types";

// Camada C — a GUARDA do pipeline Gerar→Avaliar→Selecionar.
// Junta (1) checagens determinísticas (camada A) e (2) um avaliador IA separado.
// Conservador: qualquer reprovação derruba o candidato e dispara fallback.

// Coleta as frases no idioma-alvo que devem ser auditadas.
function frasesAlvo(saida: SaidaTutor): string[] {
  const set = new Set<string>();
  for (const t of saida.audio_texto ?? []) if (t?.trim()) set.add(t.trim());
  for (const c of saida.correcoes ?? []) if (c.correto?.trim()) set.add(c.correto.trim());
  for (const v of saida.vocab_novo ?? []) if (v.alvo?.trim()) set.add(v.alvo.trim());
  return [...set];
}

async function avaliarComIA(idiomaAlvo: string, frases: string[]): Promise<AvaliacaoFrase[]> {
  if (frases.length === 0) return [];
  const user = `Frases para avaliar:\n${frases.map((f, i) => `${i + 1}. ${f}`).join("\n")}`;
  const texto = await chamarModelo({
    model: MODELO_AVALIADOR,
    system: systemPromptAvaliador(idiomaAlvo),
    user,
    maxTokens: 800,
  });
  const parsed = extrairJSON<{ avaliacoes: AvaliacaoFrase[] }>(texto);
  return parsed.avaliacoes ?? [];
}

export async function avaliarSaida(
  idiomaAlvo: string,
  saida: SaidaTutor,
): Promise<ResultadoGuarda> {
  const frases = frasesAlvo(saida);

  // 1) Checagem determinística (camada A): artigos vs. gênero do léxico.
  const fatosConferidos = frases.map((f) => {
    const problemas = checarArtigosGenero(f);
    return {
      item: f,
      ok: problemas.length === 0,
      detalhe: problemas.length ? problemas.map((p) => p.detalhe).join(" ") : "ok (lookup)",
    };
  });
  const determinísticoOk = fatosConferidos.every((c) => c.ok);

  // 2) Avaliador IA (pulado no modo demo: sem chave, confiamos no conteúdo verificado).
  let avaliacoes: AvaliacaoFrase[] = [];
  if (!MODO_DEMO && frases.length) {
    try {
      avaliacoes = await avaliarComIA(idiomaAlvo, frases);
    } catch {
      // Se o avaliador falhar, sê conservador: trate como reprovado.
      avaliacoes = frases.map((f) => ({
        frase: f,
        gramatica_ok: false,
        natural: false,
        nivel_ok: false,
        problemas: ["avaliador indisponível — reprovado por segurança"],
      }));
    }
  }
  const iaOk = avaliacoes.every((a) => a.gramatica_ok && a.natural && a.nivel_ok);

  return {
    aprovado: determinísticoOk && iaOk,
    avaliacoes,
    fatosConferidos,
  };
}
