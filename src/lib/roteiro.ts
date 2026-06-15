import type { MetaRoteiro, PerfilUsuario, Situacao } from "./types";

// Currículo montado DE TRÁS PRA FRENTE a partir da data da viagem.
// Cada situação vira uma meta "consigo fazer X"; emergência fica perto do fim.

const META_POR_SITUACAO: Record<Situacao, string> = {
  restaurante: "Consigo pedir comida e a conta num restaurante",
  hotel: "Consigo fazer check-in e perguntar sobre o hotel",
  rua: "Consigo pedir e entender direções na rua",
  compras: "Consigo perguntar preços e comprar",
  transporte: "Consigo comprar passagem e pegar transporte",
  emergencia: "Consigo pedir ajuda e achar uma farmácia",
};

// Ordem de prioridade de aprendizado (emergência por último, mas sempre presente).
const PRIORIDADE: Situacao[] = [
  "restaurante",
  "rua",
  "transporte",
  "hotel",
  "compras",
  "emergencia",
];

function semanasAteViagem(dataViagem: string, hoje = new Date()): number {
  const alvo = new Date(dataViagem + "T00:00:00");
  const ms = alvo.getTime() - hoje.getTime();
  const dias = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  return Math.max(1, Math.ceil(dias / 7));
}

export function gerarRoteiro(perfil: PerfilUsuario, hoje = new Date()): MetaRoteiro[] {
  const escolhidas =
    perfil.contexto.length > 0
      ? PRIORIDADE.filter((s) => perfil.contexto.includes(s))
      : PRIORIDADE;

  const totalSemanas = semanasAteViagem(perfil.dataViagem, hoje);

  // Distribui as situações ao longo das semanas disponíveis (trás pra frente:
  // a última situação cai na última semana antes da viagem).
  return escolhidas.map((situacao, idx) => {
    const fracao = escolhidas.length === 1 ? 1 : idx / (escolhidas.length - 1);
    const semanaAlvo = Math.max(1, Math.round(fracao * (totalSemanas - 1)) + 1);
    return {
      id: `meta-${situacao}`,
      descricao: META_POR_SITUACAO[situacao],
      situacao,
      semanaAlvo,
      status: "pendente",
    };
  });
}

export function resumoCronograma(perfil: PerfilUsuario, hoje = new Date()): {
  semanasRestantes: number;
  diasRestantes: number;
} {
  const alvo = new Date(perfil.dataViagem + "T00:00:00");
  const dias = Math.max(0, Math.ceil((alvo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)));
  return { semanasRestantes: Math.max(1, Math.ceil(dias / 7)), diasRestantes: dias };
}
