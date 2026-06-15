import Anthropic from "@anthropic-ai/sdk";

// Cliente Anthropic. Sem ANTHROPIC_API_KEY o app roda em MODO DEMO.

export const MODO_DEMO = !process.env.ANTHROPIC_API_KEY;

export const MODELO_TUTOR = process.env.ANTHROPIC_MODEL_TUTOR || "claude-sonnet-4-6";
export const MODELO_AVALIADOR = process.env.ANTHROPIC_MODEL_AVALIADOR || "claude-sonnet-4-6";

let _client: Anthropic | null = null;

function client(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

// Chama o modelo e devolve o texto bruto da resposta.
export async function chamarModelo(opts: {
  model: string;
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<string> {
  const resp = await client().messages.create({
    model: opts.model,
    max_tokens: opts.maxTokens ?? 1024,
    system: opts.system,
    messages: [{ role: "user", content: opts.user }],
  });
  return resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

// Extrai o primeiro objeto JSON de um texto (tolerante a cercas ```json).
export function extrairJSON<T>(texto: string): T {
  const semCercas = texto.replace(/```json\s*|\s*```/g, "");
  const inicio = semCercas.indexOf("{");
  const fim = semCercas.lastIndexOf("}");
  if (inicio === -1 || fim === -1 || fim <= inicio) {
    throw new Error("Resposta do modelo não contém JSON válido.");
  }
  return JSON.parse(semCercas.slice(inicio, fim + 1)) as T;
}
