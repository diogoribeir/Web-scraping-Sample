import { chamarModelo, extrairJSON, MODELO_TUTOR, MODO_DEMO } from "./anthropic";
import { systemPromptTutor, contextoRAG } from "./prompts";
import { buscarConteudoVerificado } from "./db";
import { fatosRelevantes } from "./facts";
import { avaliarSaida } from "./evaluator";
import type {
  ItemConteudo,
  PerfilUsuario,
  RespostaTutorAPI,
  SaidaTutor,
} from "./types";

// Orquestra o turno do tutor: RAG (B) + fatos (A) → geração (C) → guarda → seleção.

function montarFallback(perfil: PerfilUsuario, itens: ItemConteudo[]): SaidaTutor {
  // Resposta construída SOMENTE com conteúdo verificado. É o "porto seguro"
  // quando a geração livre falha na guarda (ou no modo demo).
  const frases = itens.filter((i) => i.tipo === "frase").slice(0, 3);
  const regra = itens.find((i) => i.tipo === "regra");

  const linhas = frases
    .map((f) => `• "${f.alvo}" — ${f.traducao}`)
    .join("\n");

  const resposta =
    `Vamos por um caminho seguro, usando frases já verificadas para sua viagem a ${perfil.destino}:\n${linhas}` +
    (regra ? `\n\nDica do sistema: ${regra.traducao}` : "") +
    `\n\nTente montar uma destas em voz alta. Quando quiser, me escreva a sua versão que eu corrijo.`;

  return {
    resposta,
    correcoes: [],
    vocab_novo: frases.map((f) => ({ alvo: f.alvo, traducao: f.traducao })),
    audio_texto: frases.map((f) => f.alvo),
    proxima_meta: `Conseguir dizer uma frase de "${frases[0]?.situacao ?? "viagem"}" sem olhar.`,
  };
}

export async function rodarTurnoTutor(
  perfil: PerfilUsuario,
  mensagemAluno: string,
): Promise<RespostaTutorAPI> {
  // 1) Recupera conteúdo verificado (camada B) + fatos (camada A).
  const itens = buscarConteudoVerificado(perfil.contexto, 12);
  const textoParaFatos = mensagemAluno + " " + itens.map((i) => i.alvo).join(" ");
  const fatos = fatosRelevantes(textoParaFatos);

  // 2) MODO DEMO: sem chave, ensinamos direto do conteúdo verificado.
  if (MODO_DEMO) {
    const saida = montarFallback(perfil, itens);
    const guarda = await avaliarSaida(perfil.idiomaAlvo, saida);
    return { saida, guarda, usouFallback: true, modoDemo: true };
  }

  // 3) GERAR (camada C) — o tutor produz um candidato.
  const system = systemPromptTutor(perfil) + "\n\n" + contextoRAG(itens, fatos);
  let candidato: SaidaTutor;
  try {
    const texto = await chamarModelo({
      model: MODELO_TUTOR,
      system,
      user: mensagemAluno,
      maxTokens: 1200,
    });
    candidato = extrairJSON<SaidaTutor>(texto);
  } catch {
    const saida = montarFallback(perfil, itens);
    const guarda = await avaliarSaida(perfil.idiomaAlvo, saida);
    return { saida, guarda, usouFallback: true, modoDemo: false };
  }

  // 4) AVALIAR — guarda determinística + avaliador IA.
  const guarda = await avaliarSaida(perfil.idiomaAlvo, candidato);

  // 5) SELECIONAR — só exibe se passar em TUDO; senão, fallback verificado.
  if (guarda.aprovado) {
    return { saida: candidato, guarda, usouFallback: false, modoDemo: false };
  }
  const saida = montarFallback(perfil, itens);
  return { saida, guarda, usouFallback: true, modoDemo: false };
}
