# 🧳 Bagagem — Tutor de Idiomas para Viagem

Tutor de IA que ensina a **entender e construir** um idioma para uma viagem
específica — explicando o porquê, corrigindo seu erro e te fazendo produzir
frases novas. Par inicial: **francês para falante de português brasileiro**.

O diferencial é a **arquitetura de confiabilidade em 3 camadas**: o app não
ensina francês inventado pelo modelo.

> Esta é a **Fase 1 (MVP de texto)**: onboarding + tutor conversacional + correção
> com o porquê + frases "desmontadas" + roteiro de metas, já com as camadas de
> conteúdo verificado (B) e a guarda (C) estruturadas. Áudio (Fase 2) e
> reconhecimento de fala (Fase 3) ainda **não** estão implementados.

---

## As 3 camadas de confiabilidade

| Camada | O que é | Onde mora no código |
|---|---|---|
| 🟢 **A — Fatos determinísticos** | Conjugação e gênero por *lookup*, sem IA "achando". | `data/facts.json`, `src/lib/facts.ts` |
| 🟡 **B — Conteúdo curado (RAG)** | Banco de frases/regras de viagem verificadas. O tutor só ensina a partir daqui. | `data/content.seed.json`, `src/lib/db.ts`, `src/lib/seed.ts` |
| 🔴 **C — Geração livre + guarda** | Conversa/adaptação passa por **Gerar → Avaliar → Selecionar**; se falhar, cai para o verificado. | `src/lib/tutor.ts`, `src/lib/evaluator.ts` |

**Pipeline de um turno** (`src/lib/tutor.ts`): recupera conteúdo verificado (B) +
fatos relevantes (A) → o tutor gera um candidato (C) → o avaliador IA + as
checagens determinísticas auditam → **só exibe se passar em tudo**; caso contrário,
faz *fallback* para uma resposta montada apenas com conteúdo verificado.

**Portão de CI** (`scripts/verify-content.ts`, rodado em `.github/workflows/ci.yml`):
confere cada item do conteúdo contra as fontes e **sinaliza só as divergências**.

---

## Stack

Next.js 14 (App Router) + React + Tailwind (PWA) · API routes · API Anthropic
(tutor + avaliador) · SQLite via `better-sqlite3`. Repetição espaçada (FSRS) e
voz ficam para fases posteriores.

---

## Setup

Requer **Node.js 18+** (testado no 20/22).

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente (NUNCA comite chaves)
cp .env.example .env.local
#   edite .env.local e cole sua ANTHROPIC_API_KEY

# 3. (Opcional) Semear o banco — o app também semeia sozinho no primeiro acesso
npm run seed

# 4. Rodar em desenvolvimento
npm run dev
#   abra http://localhost:3000
```

### Onde colocar as chaves

Todas as chaves vivem em **variáveis de ambiente** (`.env.local`), nunca no
código. O arquivo `.env.example` lista cada uma. Para a Fase 1, só a
`ANTHROPIC_API_KEY` é necessária.

| Variável | Quando | Obrigatória na Fase 1? |
|---|---|---|
| `ANTHROPIC_API_KEY` | Tutor + avaliador | Recomendada |
| `ANTHROPIC_MODEL_TUTOR` / `ANTHROPIC_MODEL_AVALIADOR` | Sobrescrever modelos | Não (há default) |
| `GOOGLE_TRANSLATE_API_KEY` | Cruzamento de tradução (camada B) | Não (Fase 1.5) |
| `OPENAI_API_KEY` / `ELEVENLABS_API_KEY` | Voz/TTS | Não (Fase 2) |
| `AZURE_SPEECH_KEY` / `AZURE_SPEECH_REGION` | Pronúncia | Não (Fase 3) |

### Modo demo (sem chave)

Sem `ANTHROPIC_API_KEY`, o app roda em **modo demo**: as respostas vêm direto do
conteúdo **verificado** (camadas A/B), sem geração livre. Ótimo para ver a UI e o
fluxo. A interface mostra um selo indicando o modo.

---

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build e produção |
| `npm run seed` | Semeia o conteúdo verificado no SQLite |
| `npm run verify-content` | Portão de conteúdo: sinaliza divergências (usado no CI) |

---

## Como testar "ensina de verdade"

1. No onboarding, escolha destino, data e situações.
2. No chat, **escreva uma frase em francês com erro de propósito** (ex.: um
   artigo de gênero errado). Com chave, o tutor corrige explicando a regra em
   português; o selo mostra que a geração passou (ou foi reprovada) na guarda.
3. Veja as frases **desmontadas** (palavra a palavra) e a **próxima meta**.
4. No painel lateral: o **roteiro** montado de trás pra frente a partir da data,
   e a **saúde do conteúdo** (% verificado).

---

## Estrutura

```
data/
  facts.json            # camada A (conjugação/gênero — lookup)
  content.seed.json     # camada B (conteúdo verificado)
src/
  app/                  # páginas + API routes (tutor, roteiro, content/stats)
  components/           # Onboarding, Chat, Roteiro, ContentHealth
  lib/
    types.ts            # tipos compartilhados
    prompts.ts          # system prompt do tutor + avaliador
    db.ts               # SQLite (users, content, cards, errors, goals)
    facts.ts            # lookup determinístico (camada A)
    evaluator.ts        # guarda (camada C): avaliador IA + checagens
    tutor.ts            # orquestra Gerar→Avaliar→Selecionar
    roteiro.ts          # metas montadas a partir da data da viagem
scripts/
  seed.ts               # semeia o banco
  verify-content.ts     # portão de CI de conteúdo
```

---

## Roadmap

- **Fase 1** ✅ MVP de texto (este código).
- **Fase 1.5** Semear do Tatoeba e cruzar com Google Translation API + dicionário.
- **Fase 2** Voz nativa (TTS) com cache.
- **Fase 3** Falar e ser corrigido (Azure Pronunciation Assessment).
- **Fase 4** Memória com FSRS + roteiro adaptativo.
- **Fase 5** PWA offline, contas (Supabase), novos pares de idiomas.
