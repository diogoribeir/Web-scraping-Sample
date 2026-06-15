// Tipos compartilhados pelo app Bagagem.

export type Nivel = "zero" | "iniciante" | "intermediario";

export type Situacao =
  | "restaurante"
  | "hotel"
  | "rua"
  | "compras"
  | "emergencia"
  | "transporte";

export interface PerfilUsuario {
  linguaMaterna: string; // ex.: "português brasileiro"
  idiomaAlvo: string; // ex.: "francês"
  destino: string; // ex.: "Paris"
  dataViagem: string; // ISO yyyy-mm-dd
  contexto: Situacao[]; // situações que mais importam
  nivel: Nivel;
}

// ── Camada A — fato determinístico (lookup) ──────────────────────────────────
export interface ConjugacaoFato {
  tipo: "conjugacao";
  infinitivo: string;
  tempo: string; // ex.: "présent"
  pessoa: string; // ex.: "je"
  forma: string; // ex.: "voudrais"
  fonte: string;
}

export interface GeneroFato {
  tipo: "genero";
  palavra: string;
  genero: "m" | "f";
  artigo: string; // "le" | "la" | "l'"
  fonte: string;
}

export type Fato = ConjugacaoFato | GeneroFato;

// ── Camada B — conteúdo curado (RAG) ─────────────────────────────────────────
export interface ItemConteudo {
  id: string;
  tipo: "frase" | "regra" | "vocab";
  situacao: Situacao | "geral";
  alvo: string; // texto no idioma-alvo
  traducao: string; // tradução para a língua materna
  nivel: Nivel;
  fonte: string; // proveniência (ex.: "Tatoeba #123 + Larousse")
  status: "verificado" | "pendente";
}

// ── Pedaços "desmontados" de uma frase (didática) ────────────────────────────
export interface PedacoDesmontado {
  alvo: string;
  traducao: string;
  nota?: string; // por que está nessa forma (regra curta)
}

// ── Saída estruturada do tutor (camada C, já validada) ───────────────────────
export interface Correcao {
  erro: string;
  correto: string;
  regra_pt: string;
  tipo: string; // ex.: "conjugação", "gênero", "ordem"
}

export interface VocabNovo {
  alvo: string;
  traducao: string;
  desmontado?: PedacoDesmontado[];
}

export interface SaidaTutor {
  resposta: string; // texto natural e encorajador
  correcoes: Correcao[];
  vocab_novo: VocabNovo[];
  audio_texto: string[]; // frases-alvo para futura síntese de voz (Fase 2)
  proxima_meta: string;
}

// ── Resultado do avaliador (guarda da camada C) ──────────────────────────────
export interface AvaliacaoFrase {
  frase: string;
  gramatica_ok: boolean;
  natural: boolean;
  nivel_ok: boolean;
  problemas: string[];
}

export interface ResultadoGuarda {
  aprovado: boolean;
  avaliacoes: AvaliacaoFrase[];
  fatosConferidos: { item: string; ok: boolean; detalhe: string }[];
}

export interface RespostaTutorAPI {
  saida: SaidaTutor;
  guarda: ResultadoGuarda;
  usouFallback: boolean;
  modoDemo: boolean;
}

export interface MetaRoteiro {
  id: string;
  descricao: string; // "Consigo fazer X"
  situacao: Situacao | "geral";
  semanaAlvo: number; // 1 = primeira semana de estudo
  status: "pendente" | "em_progresso" | "concluida";
}
