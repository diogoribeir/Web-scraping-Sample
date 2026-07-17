# Perfil Gamer — fonte de dados

Arquivos-fonte do app publicado em `/perfil-gamer/` (biblioteca de jogos PS4/PS5 do Diogo).

| Arquivo | Papel |
|---|---|
| `biblioteca_jogos.xlsx` (aba `Biblioteca de Jogos`) | **Dados mestres** — schema documentado em `biblioteca_jogos.md` |
| `biblioteca_jogos.md` | Documentação viva (regenerada por `gerar_doc.py`) |
| `gerar_doc.py` | Regenera o `.md` a partir do xlsx |
| `gerar_dados.py` | Regenera `../perfil-gamer/dados.js` (os dados do app) a partir do xlsx |
| `.notas_numericas_backup.json` | Equivalente numérico histórico dos veredictos (só análises internas — **nunca** mostrar números ao usuário) |
| `agente_perfil_gamer.md` | Spec do agente de apoio (instalado em `.claude/agents/perfil-gamer.md`) |

## 🔁 Fluxo de atualização (registrar/alterar jogos)
1. Editar `biblioteca_jogos.xlsx` (via agente `perfil-gamer` na conversa — o usuário não quer abrir planilha).
2. Regenerar tudo:
   ```bash
   cd perfil-gamer-src
   python3 gerar_doc.py      # atualiza biblioteca_jogos.md (subir a VERSAO no script)
   python3 gerar_dados.py    # atualiza ../perfil-gamer/dados.js
   ```
3. Testar o app localmente, commit, PR, merge → o Pages republica.

> ⚠️ O `PLANO` (fila 2026) e os `INSIGHTS` do app são mantidos dentro do `gerar_dados.py` —
> ao mudarem, editar lá e regenerar.

## Filosofia (respeitar sempre)
Veredictos categóricos estilo ACG (Masterpiece · Muito Bom · Bom · Medíocre · Ruim · Muito Ruim).
Sem notas numéricas na interface; componentes H/G/D/FF aparecem discretos como "análise interna".
Custo líquido fixo por jogo: **R$90** → custo/hora = 90 ÷ horas.
