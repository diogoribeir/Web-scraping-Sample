# 🎮 Biblioteca de Jogos — PS4 + PS5

> **Documentação v11** · Atualizada em 16/07/2026  
> **Sistema de Veredictos (estilo ACG):** Masterpiece · Muito Bom · Bom · Mediano · Ruim · Muito Ruim  
> Mediano = mediano, não ruim — não há nada de errado em ser mediano

---

## 🗂️ Esquema de Dados (base para a aplicação)

Arquivo fonte: `biblioteca_jogos.xlsx` · Aba `Biblioteca de Jogos` · Gerador: `gerar_doc.py`

| Coluna | Tipo | Descrição |
|---|---|---|
| # | int | ID sequencial |
| Jogo | texto | Nome do jogo |
| Tempo Total | horas | Horas totais (PS4+PS5 consolidado) |
| Encerrado | S / N / # | S=Completou · N=Droppou · #=Em progresso |
| Qtde Walkthrough | int | Nº de walkthroughs |
| Motivo Desistência | texto | Apenas quando N |
| Genres | texto | 1º gênero = principal |
| História (1-4) | int ou N/A | Componente interno de análise |
| Gameplay (1-4) | int | Componente interno de análise |
| Dificuldade (1-3) | int | 1=Fácil · 2=Equilibrado · 3=Difícil |
| Fun Factor (1-4) | int | Componente interno de análise |
| Veredicto | enum 6 níveis | Masterpiece / Muito Bom / Bom / Mediano / Ruim / Muito Ruim |
| Observação | texto | Contexto livre |

**Filosofia do veredicto:** julgamento categórico, não medição. Componentes 1–4 são evidência analítica interna.  
**Ordem ordinal (p/ app):** Muito Ruim=1 · Ruim=2 · Mediano=3 · Bom=4 · Muito Bom=5 · Masterpiece=6  
**Parâmetro econômico fixo:** custo líquido médio por jogo = **R$90** (via grupo + revenda). Custo/hora = R$90 ÷ Tempo Total.  
**Agente de apoio:** ver `agente_perfil_gamer.md` — especialista que categoriza e analisa junto com o usuário.

---

## 📊 Resumo Geral

| Métrica | Valor | Métrica | Valor |
|---|---|---|---|
| Total de jogos | **72** | Total de horas | **~5.232h** |
| ✅ Completados | **48** (67%) | Média horas/jogo | **73h** |
| ❌ Droppados | **23** (32%) | Veredicto mais comum | **Bom** |
| 🔄 Em progresso | **1** | Masterpieces | **5** jogos |

---

## 📋 Lista Completa

| # | Jogo | Genres | Total | Enc | W | H | G | D | FF | Veredicto | Obs |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | FINAL FANTASY XIV - MMO | MMORPG, Fantasy | 1519 | S | 1 | 3 | 3 | 2 | 3 | 🟢 Muito Bom |  |
| 2 | FINAL FANTASY XV | Action RPG, Fantasy | 142 | S | 2 | 2 | 2 | 1 | 3 | 🟡 Mediano | 2ª walkthrough: DLCs dos personagens. História/combate medianos mas di |
| 3 | Assassin's Creed® Valhalla | Action-Adventure, Open World | 131 | S | 1 | 2 | 2 | 2 | 2 | 🟡 Mediano | Jogado muito por ser gigante + pandemia, não por qualidade |
| 4 | Path of Exile 2 | Action RPG, Hack and Slash | 250 | S | 5 | 2 | 4 | 2 | 4 | 🟢 Muito Bom |  |
| 5 | Diablo IV | Action RPG, Hack and Slash | 284 | S | 3 | 3 | 3 | 2 | 3 | 🟢 Muito Bom |  |
| 6 | Tom Clancy's The Division™ | Action RPG, Shooter, Open World | 102 | S | 1 | N/A | 3 | 2 | 3 | 🔵 Bom |  |
| 7 | Crimson Desert | Action RPG, Open World | 136 | S | 1 | 1 | 4 | 1 | 4 | 🟢 Muito Bom |  |
| 8 | ELDEN RING™ | Action RPG, Souls-like | 122 | S | 3 | N/A | 4 | 3 | 4 | 🏆 Masterpiece |  |
| 9 | FINAL FANTASY XVI | Action RPG, Fantasy | 114 | S | 2 | 4 | 3 | 1 | 4 | 🔵 Bom |  |
| 10 | Horizon Forbidden West | Action-Adventure, Open World | 113 | S | 1 | 4 | 4 | 2 | 4 | 🏆 Masterpiece |  |
| 11 | The Witcher 3: Wild Hunt | Action RPG, Open World | 161 | S | 2 | 2 | 2 | 2 | 2 | 🟡 Mediano | Inclui Complete Edition (94h PS4) + base (37h PS4) · Nota revisada 1.5 |
| 12 | OUTRIDERS | Action RPG, Shooter | 111 | S | 1 | 3 | 4 | 2 | 4 | 🟢 Muito Bom |  |
| 13 | Tales of Arise | Action RPG, JRPG | 80 | S | 1 | 3 | 3 | 2 | 3 | 🔵 Bom |  |
| 14 | FINAL FANTASY VII REBIRTH | Action RPG, JRPG | 88 | S | 1 | 2 | 4 | 2 | 4 | 🟢 Muito Bom |  |
| 15 | Red Dead Redemption 2 | Action-Adventure, Open World | 98 | S | 1 | 2 | 2 | 2 | 2 | 🟡 Mediano |  |
| 16 | Tom Clancy's The Division®2 | Action RPG, Shooter, Open World | 115 | S | 1 | N/A | 2 | 2 | 3 | 🔵 Bom |  |
| 17 | WILD HEARTS | Action RPG, Monster Hunter-like | 74 | S | 1 | N/A | N/A | 2 | 3 | N/A |  |
| 18 | Middle-earth: Shadow of Mordor | Action-Adventure, Open World | 53 | S | 1 | 3 | 3 | 2 | 3 | 🔵 Bom |  |
| 19 | Assassin's Creed® Odyssey | Action-Adventure, Open World, RPG | 53 | N | 1 | 1 | 1 | 2 | 1 | 🔴 Muito Ruim |  |
| 20 | Middle-earth™: Shadow of War™ | Action-Adventure, Open World | 73 | S | 1 | 3 | 2 | 2 | 3 | 🟡 Mediano |  |
| 21 | Ghost of Yōtei | Action-Adventure, Open World | 62 | S | 1 | 2 | 4 | 2 | 4 | 🟢 Muito Bom |  |
| 22 | Clair Obscur: Expedition 33 | Turn-Based RPG, JRPG | 79 | S | 2 | 4 | 4 | 2 | 4 | 🏆 Masterpiece | Rezerado jul/2026 (+17h na 2ª walkthrough) |
| 23 | Granblue Fantasy: Relink | Action RPG, JRPG | 61 | S | 1 | 1 | 3 | 1 | 3 | 🔵 Bom |  |
| 24 | Monster Hunter: World | Action RPG, Monster Hunter | 44 | S | 1 | 1 | 2 | 1 | 2 | 🟠 Ruim | Não gostei do fluxo do jogo, lutas repetidas com os mesmos monstros, g |
| 25 | FINAL FANTASY VII REMAKE | Action RPG, JRPG | 41 | S | 1 | N/A | 3 | 1 | 3 | 🔵 Bom |  |
| 26 | The Last of Us™ Remastered | Action-Adventure, Survival | 50 | S | 3 | 4 | 2 | 2 | 4 | 🔵 Bom |  |
| 27 | Assassin's Creed® Shadows | Action-Adventure, Open World, RPG | 45 | # | 2 | 2 | 2 | 3 | 2 | 🟡 Mediano | Jogando no nightmare no ng+ · Comprado por R$60; últimas 4 missões fin |
| 28 | Black Myth: Wukong | Action RPG, Souls-like | 41 | N | 1 | N/A | 3 | 3 | 3 | 🟢 Muito Bom |  |
| 29 | Dragon Age™: The Veilguard | Action RPG, Fantasy | 41 | S | 1 | 1 | 3 | 2 | 2 | 🟠 Ruim |  |
| 30 | DAYS GONE | Action-Adventure, Open World, Survival | 37 | S | 1 | 3 | 2 | 2 | 3 | 🔵 Bom |  |
| 31 | Hogwarts Legacy | Action RPG, Open World | 63 | S | 2 | 2 | 3 | 1 | 3 | 🔵 Bom | Replay jun/2026 (19h): Gameplay 2→3; zerado no fácil para encerrar; se |
| 32 | Battlefield™ 6 | Shooter, Military | 38 | S | 1 | N/A | 2 | 1 | 3 | 🔵 Bom |  |
| 33 | Marvel's Spider-Man 2 | Action-Adventure, Open World | 36 | S | 1 | 2 | 2 | 1 | 2 | 🟠 Ruim |  |
| 34 | Baldur's Gate 3 | Turn-Based RPG, Fantasy | 35 | N | 1 | 1 | 2 | 2 | 1 | 🟠 Ruim |  |
| 35 | Sekiro™: Shadows Die Twice | Action RPG, Souls-like | 33 | S | 1 | N/A | 4 | 3 | 4 | 🏆 Masterpiece |  |
| 36 | SWORD ART ONLINE Alicization Lycoris | Action RPG, JRPG | 31 | S | 1 | 1 | 2 | 2 | 2 | 🟠 Ruim |  |
| 37 | Cyberpunk 2077 | Action RPG, Open World, Shooter | 30 | N | 1 | 1 | 2 | 2 | 2 | 🟠 Ruim |  |
| 38 | Assassin's Creed® Origins | Action-Adventure, Open World, RPG | 26 | N | 1 | 1 | 1 | 2 | 1 | 🔴 Muito Ruim |  |
| 39 | Horizon Zero Dawn | Action-Adventure, Open World | 25 | S | 2 | 4 | 3 | 2 | 4 | 🟢 Muito Bom |  |
| 40 | Lords of the Fallen | Action RPG, Souls-like | 28 | S | 1 | N/A | 2 | 3 | 2 | 🟡 Mediano |  |
| 41 | DEATH STRANDING 2: ON THE BEACH | Action, Walking Simulator | 27 | N | 1 | 2 | 2 | 2 | 3 | 🟡 Mediano |  |
| 42 | Demon's Souls | Action RPG, Souls-like | 26 | S | 1 | N/A | 2 | 3 | 3 | 🟡 Mediano |  |
| 43 | DARK SOULS III | Action RPG, Souls-like | 24 | S | 1 | N/A | 3 | 3 | 3 | 🟢 Muito Bom |  |
| 44 | God of War | Action-Adventure | 23 | S | 1 | 3 | 2 | 2 | 3 | 🔵 Bom |  |
| 45 | Mass Effect™: Andromeda | Action RPG, Sci-Fi, Shooter | 22 | N | 1 | 1 | 2 | 2 | 2 | 🟠 Ruim |  |
| 46 | The Last of Us™ Part II | Action-Adventure, Survival | 19 | S | 2 | 4 | 3 | 2 | 3 | 🟢 Muito Bom |  |
| 47 | Persona 5 Royal | Turn-Based RPG, JRPG, Slice of Life | 19 | N | 1 | 1 | 2 | 1 | 1 | 🟠 Ruim |  |
| 48 | KINGDOM HEARTS III | Action RPG, JRPG | 19 | N | 1 | 1 | 2 | 1 | 2 | 🟠 Ruim |  |
| 49 | STAR WARS Jedi: Fallen Order | Action-Adventure, Souls-like | 19 | S | 1 | 3 | 3 | 2 | 3 | 🔵 Bom |  |
| 50 | God of War Ragnarök | Action-Adventure | 18 | N | 1 | 2 | 2 | 2 | 2 | 🟡 Mediano |  |
| 51 | Dragon's Dogma 2 | Action RPG, Open World | 18 | N | 1 | 1 | 2 | 2 | 1 | 🟠 Ruim |  |
| 52 | Uncharted 4: A Thief's End™ | Action-Adventure | 17 | N | 1 | 3 | 2 | 1 | 2 | 🔵 Bom |  |
| 53 | DEATH STRANDING | Action, Walking Simulator | 40 | N | 1 | 2 | 2 | 1 | 1 | 🟠 Ruim | [Director's Cut PS5] mesma coisa que id 61 é mesmo jogo |
| 54 | Star Wars Outlaws | Action-Adventure, Open World | 17 | N | 1 | 1 | 1 | 1 | 1 | 🔴 Muito Ruim |  |
| 55 | Kingdom Come: Deliverance II | Action RPG, Open World, Realistic | 16 | N | 1 | 2 | 2 | 2 | 2 | 🟡 Mediano |  |
| 56 | Kena: Bridge of Spirits | Action-Adventure | 16 | S | 1 | 3 | 3 | 1 | 3 | 🔵 Bom |  |
| 57 | Avowed | Action RPG, Fantasy | 16 | N | 1 | 1 | 3 | 3 | 2 | 🔵 Bom |  |
| 58 | DETROIT: BECOME HUMAN | Adventure, Narrative | 13 | S | 1 | 4 | 3 | 1 | 4 | 🔵 Bom |  |
| 59 | PRAGMATA | Action-Adventure, Sci-Fi | 13 | S | 1 | 2 | 2 | 2 | 2 | 🟡 Mediano |  |
| 60 | Ghost of Tsushima | Action-Adventure, Open World | 65 | S | 2 | 4 | 4 | 2 | 4 | 🏆 Masterpiece | Top 3 de todos os tempos; 2 walkthroughs completas |
| 61 | Resident Evil 4 | Survival Horror, Shooter | 12 | S | 1 | 2 | 2 | 2 | 3 | 🔵 Bom |  |
| 62 | The First Berserker: Khazan | Action RPG, Souls-like | 12 | N | 1 | N/A | 2 | 3 | 2 | 🟡 Mediano |  |
| 63 | Avatar: Frontiers of Pandora™ | Action-Adventure, Open World | 12 | N | 1 | 1 | 2 | 1 | 1 | 🟠 Ruim |  |
| 64 | Resident Evil Requiem | Survival Horror | 12 | S | 1 | 3 | 3 | 1 | 4 | 🔵 Bom |  |
| 65 | Mass Effect: Legendary Edition | Action RPG, Sci-Fi, Shooter | 18 | N | 1 | 2 | 1 | 1 | 1 | 🟠 Ruim |  |
| 66 | FINAL FANTASY XII THE ZODIAC AGE | Turn-Based RPG, JRPG | 11 | N | 1 | 1 | 2 | 2 | 2 | 🟠 Ruim |  |
| 67 | The Order: 1886 | Action-Adventure, Shooter | 9 | S | 1 | 3 | 2 | 1 | 3 | 🔵 Bom |  |
| 68 | RESIDENT EVIL 2 | Survival Horror | 9 | S | 1 | 2 | 2 | 2 | 3 | 🔵 Bom |  |
| 70 | A Way Out | Action-Adventure, Co-op | 6 | S | 1 | 3 | 2 | 1 | 3 | 🔵 Bom |  |
| 71 | NieR:Automata | Action RPG, Hack and Slash | 5 | N | 1 | 1 | 1 | 2 | 1 | 🔴 Muito Ruim |  |
| 72 | Wuchang: Fallen Feathers | Souls-like / Action RPG | 0.5 | N | 1 | 1 | 1 | 3 | 1 | 🔴 Muito Ruim | PS Plus grátis jun/2026. Dropado em ~30 min. Padrão confirmado: souls- |
| 73 | Assassin's Creed® IV Black Flag Resync | Action-Adventure, Open World, Naval | 13 | N | 1 | 1 | 1 | 1 | 1 | 🟠 Ruim | Jogadas 9h + 4h = 13h total. Dropado jul/2026 |

---

## 🏆 Por Veredicto

### 🏆 Masterpiece — 5 jogo(s)

| Jogo | Horas | Status |
|---|---|---|
| ELDEN RING™ | 122h | ✅ |
| Horizon Forbidden West | 113h | ✅ |
| Clair Obscur: Expedition 33 | 79h | ✅ |
| Ghost of Tsushima | 65h | ✅ |
| Sekiro™: Shadows Die Twice | 33h | ✅ |

### 🟢 Muito Bom — 11 jogo(s)

| Jogo | Horas | Status |
|---|---|---|
| FINAL FANTASY XIV - MMO | 1519h | ✅ |
| Diablo IV | 284h | ✅ |
| Path of Exile 2 | 250h | ✅ |
| Crimson Desert | 136h | ✅ |
| OUTRIDERS | 111h | ✅ |
| FINAL FANTASY VII REBIRTH | 88h | ✅ |
| Ghost of Yōtei | 62h | ✅ |
| Black Myth: Wukong | 41h | ❌ |
| Horizon Zero Dawn | 25h | ✅ |
| DARK SOULS III | 24h | ✅ |
| The Last of Us™ Part II | 19h | ✅ |

### 🔵 Bom — 22 jogo(s)

| Jogo | Horas | Status |
|---|---|---|
| Tom Clancy's The Division®2 | 115h | ✅ |
| FINAL FANTASY XVI | 114h | ✅ |
| Tom Clancy's The Division™ | 102h | ✅ |
| Tales of Arise | 80h | ✅ |
| Hogwarts Legacy | 63h | ✅ |
| Granblue Fantasy: Relink | 61h | ✅ |
| Middle-earth: Shadow of Mordor | 53h | ✅ |
| The Last of Us™ Remastered | 50h | ✅ |
| FINAL FANTASY VII REMAKE | 41h | ✅ |
| Battlefield™ 6 | 38h | ✅ |
| DAYS GONE | 37h | ✅ |
| God of War | 23h | ✅ |
| STAR WARS Jedi: Fallen Order | 19h | ✅ |
| Uncharted 4: A Thief's End™ | 17h | ❌ |
| Kena: Bridge of Spirits | 16h | ✅ |
| Avowed | 16h | ❌ |
| DETROIT: BECOME HUMAN | 13h | ✅ |
| Resident Evil 4 | 12h | ✅ |
| Resident Evil Requiem | 12h | ✅ |
| The Order: 1886 | 9h | ✅ |
| RESIDENT EVIL 2 | 9h | ✅ |
| A Way Out | 6h | ✅ |

### 🟡 Mediano — 13 jogo(s)

| Jogo | Horas | Status |
|---|---|---|
| The Witcher 3: Wild Hunt | 161h | ✅ |
| FINAL FANTASY XV | 142h | ✅ |
| Assassin's Creed® Valhalla | 131h | ✅ |
| Red Dead Redemption 2 | 98h | ✅ |
| Middle-earth™: Shadow of War™ | 73h | ✅ |
| Assassin's Creed® Shadows | 45h | 🔄 |
| Lords of the Fallen | 28h | ✅ |
| DEATH STRANDING 2: ON THE BEACH | 27h | ❌ |
| Demon's Souls | 26h | ✅ |
| God of War Ragnarök | 18h | ❌ |
| Kingdom Come: Deliverance II | 16h | ❌ |
| PRAGMATA | 13h | ✅ |
| The First Berserker: Khazan | 12h | ❌ |

### 🟠 Ruim — 15 jogo(s)

| Jogo | Horas | Status |
|---|---|---|
| Monster Hunter: World | 44h | ✅ |
| Dragon Age™: The Veilguard | 41h | ✅ |
| DEATH STRANDING | 40h | ❌ |
| Marvel's Spider-Man 2 | 36h | ✅ |
| Baldur's Gate 3 | 35h | ❌ |
| SWORD ART ONLINE Alicization Lycoris | 31h | ✅ |
| Cyberpunk 2077 | 30h | ❌ |
| Mass Effect™: Andromeda | 22h | ❌ |
| Persona 5 Royal | 19h | ❌ |
| KINGDOM HEARTS III | 19h | ❌ |
| Dragon's Dogma 2 | 18h | ❌ |
| Mass Effect: Legendary Edition | 18h | ❌ |
| Assassin's Creed® IV Black Flag Resync | 13h | ❌ |
| Avatar: Frontiers of Pandora™ | 12h | ❌ |
| FINAL FANTASY XII THE ZODIAC AGE | 11h | ❌ |

### 🔴 Muito Ruim — 5 jogo(s)

| Jogo | Horas | Status |
|---|---|---|
| Assassin's Creed® Odyssey | 53h | ❌ |
| Assassin's Creed® Origins | 26h | ❌ |
| Star Wars Outlaws | 17h | ❌ |
| NieR:Automata | 5h | ❌ |
| Wuchang: Fallen Feathers | 0.5h | ❌ |

---

## 📊 Estatísticas

### ⭐ Distribuição de Veredictos

| Veredicto | Jogos | % |
|---|---|---|
| 🏆 Masterpiece | 5 | 7% |
| 🟢 Muito Bom | 11 | 15% |
| 🔵 Bom | 22 | 31% |
| 🟡 Mediano | 13 | 18% |
| 🟠 Ruim | 15 | 21% |
| 🔴 Muito Ruim | 5 | 7% |

### ⏱️ Top 10 — Mais Horas Jogadas

| # | Jogo | Total | Veredicto |
|---|---|---|---|
| 1 | FINAL FANTASY XIV - MMO | **1519h** | 🟢 Muito Bom |
| 2 | Diablo IV | **284h** | 🟢 Muito Bom |
| 3 | Path of Exile 2 | **250h** | 🟢 Muito Bom |
| 4 | The Witcher 3: Wild Hunt | **161h** | 🟡 Mediano |
| 5 | FINAL FANTASY XV | **142h** | 🟡 Mediano |
| 6 | Crimson Desert | **136h** | 🟢 Muito Bom |
| 7 | Assassin's Creed® Valhalla | **131h** | 🟡 Mediano |
| 8 | ELDEN RING™ | **122h** | 🏆 Masterpiece |
| 9 | Tom Clancy's The Division®2 | **115h** | 🔵 Bom |
| 10 | FINAL FANTASY XVI | **114h** | 🔵 Bom |

### 🎮 Análise por Gênero Principal

| Gênero | Jogos | Horas | Veredicto Médio | Conclusão | Drop% |
|---|---|---|---|---|---|
| Action RPG | 33 | 2.368h | 🔵 Bom | 70% | 30% |
| Action-Adventure | 26 | 1.049h | 🔵 Bom | 72% | 28% |
| Turn-Based RPG | 4 | 144h | 🟡 Mediano | 25% | 75% |
| Survival Horror | 3 | 33h | 🔵 Bom | 100% | 0% |
| Action | 2 | 67h | 🟠 Ruim | 0% | 100% |
| MMORPG | 1 | 1.519h | 🟢 Muito Bom | 100% | 0% |
| Shooter | 1 | 38h | 🔵 Bom | 100% | 0% |
| Adventure | 1 | 13h | 🔵 Bom | 100% | 0% |
| Souls-like / Action RPG | 1 | 0h | 🔴 Muito Ruim | 0% | 100% |

### 🔥 Dificuldade vs Desempenho

| Dificuldade | Jogos | Veredicto Médio | Conclusão |
|---|---|---|---|
| D=1 Fácil | 22 (31%) | 🟡 Mediano | 64% |
| D=2 Médio | 40 (56%) | 🔵 Bom | 72% |
| D=3 Difícil | 10 (14%) | 🔵 Bom | 56% |

### 💡 Insights do Jogador

| Padrão | Observação |
|---|---|
| **Gameplay é o motor do veredicto** | História amplifica, não sustenta; para souls-likes história não é eixo |
| **Fun Factor 4 → conclusão garantida** | Padrão histórico de 100% |
| **Horas jogadas ≠ qualidade** | Valhalla 131h = Mediano (jogo gigante + pandemia); Tsushima 65h = Masterpiece |
| **Retentativa de jogo dropado: 0% de sucesso** | Nenhuma passou de Mediano — diferente de replay de jogo zerado |
| **Walkthrough >=2 = jogo amado (ou DLC)** | Tsushima e Exp33 Masterpiece, TLoU; exceção FFXV (DLCs) |
| **Fórmula Ubisoft = risco alto** | Odyssey/Origins/Outlaws Muito Ruim e drop; exceção parcial: Shadows em NG+ |
| **Souls-like só FromSoftware** | Elden Ring/Sekiro Masterpiece vs LotF/Demon Souls Mediano, Khazan/Wuchang drop |
| **Survival Horror: 100% conclusão** | Gênero subestimado na coleção |
| **Sem fast travel fácil = drop** | Dragon's Dogma 2, FFXII, Kingdom Come II |
| **Combate simples = drop mesmo com boa escrita** | AC Black Flag Resync: cutscenes boas, dropado em 13h |

---

## 🗓️ Planejamento de Jogos — 2026 (status jul/2026)

Disponibilidade: ~12h/semana (~52h/mês; setembro reduzido ~34h por férias 08–27/09).

| Jogo | Lançamento | Estimativa | Status |
|---|---|---|---|
| 007 First Light | Jun/26 | 15h | — |
| AC Black Flag Resync | 09/Jul | 45h | ❌ Dropado com 13h (jul/26) — liberou ~32h |
| Beast of Reincarnation | 05/Ago | 45h | Próximo |
| Lord of the Fallen 2 | 10/Ago | 40h | Sugerido p/ Setembro |
| Blood of Dawn | 03/Set | 45h | Outubro |
| Wolverine | 15/Set | 25h | Novembro |
| Phantom Blade | 08/Set | 50h | Nov–Dez |

**Em andamento (jul/26):** AC Shadows NG+ nightmare (comprado R$60) · Exp33 rezerado (+17h)  
**FF14:** assinatura pausada; retorno out/nov 2026 antes da expansão Evercold (jan/2027)

---

## ❌ Jogos Droppados — Motivos

| Jogo | Horas | Veredicto | Motivo |
|---|---|---|---|
| Assassin's Creed® Odyssey | 53h | 🔴 Muito Ruim | História chata, gameplay fica muito repetitivo, formula ubisoft |
| Black Myth: Wukong | 41h | 🟢 Muito Bom | Parei no ultimo chefe por causa da dificuldade, não consegui passar |
| DEATH STRANDING | 40h | 🟠 Ruim | História confusa, gameplay bem simples, é walking simulator |
| Baldur's Gate 3 | 35h | 🟠 Ruim | Dialogos são muito teatrais, história parece que não tem trama única, não me importo com companios, gameplay apesar de dezenas de skill no final das contas fica usando sempre a mesma skill/halidade/tecnica |
| Cyberpunk 2077 | 30h | 🟠 Ruim | Historia bem fraca, gameplay é ok por ser tiro |
| DEATH STRANDING 2: ON THE BEACH | 27h | 🟡 Mediano | gameplay passei nervoso, historia ok, tanto que vi no youtibe depois |
| Assassin's Creed® Origins | 26h | 🔴 Muito Ruim | História chata, gameplay fica muito repetitivo, formula ubisoft |
| Mass Effect™: Andromeda | 22h | 🟠 Ruim | História e dialogos bem ruim mas gameplay legal |
| Persona 5 Royal | 19h | 🟠 Ruim | muito anime, muito longo, coisas de escola, esse estilo slice of life não gostei |
| KINGDOM HEARTS III | 19h | 🟠 Ruim | historia muito.confusa e as.missoes.pareciam tudo filler |
| God of War Ragnarök | 18h | 🟡 Mediano | gameplay com atreus chato, chame play ficou muito repetitivo |
| Dragon's Dogma 2 | 18h | 🟠 Ruim | nao tem fast travel facil. tem que andar muito de lado para outro em.mesmo cenarios sem nada no caminho ah nao ser os mesmos monstros que lutou dezenas de vezes. Jogo prolonga pela distância mas não faz sentido, nem as paisagens são bonitas como crimson desert é |
| Mass Effect: Legendary Edition | 18h | 🟠 Ruim | muito datado |
| Uncharted 4: A Thief's End™ | 17h | 🔵 Bom | acho que pelo gameplay mas historia boa |
| Star Wars Outlaws | 17h | 🔴 Muito Ruim | história fraca, gameplay fraco, muito espaço vazio de.transaicao entre missoes |
| Kingdom Come: Deliverance II | 16h | 🟡 Mediano | estava gostando bastante no começo.  depois o realismo ficou muito cansativo. fica craftango coisas manuais ou amdar.muito. Muito realismo. Historia acabei vendo final youtube |
| Avowed | 16h | 🔵 Bom | joguei bastante. nao sei ao certo porque desisto. Lembro de passar raiva ma dificuldade path of damed que é dificuldade mais dificil. dialogos e historia tambem nao eram interessantes |
| Assassin's Creed® IV Black Flag Resync | 13h | 🟠 Ruim | Combate muito simples; navegação (core do jogo) horrível; escrita das cutscenes boa mas história não pegou — final visto no YouTube |
| The First Berserker: Khazan | 12h | 🟡 Mediano | passei muita raiva achei muito dificil.  Combate tambem.nao me.pegou muito apesar de.nao ser.ruim |
| Avatar: Frontiers of Pandora™ | 12h | 🟠 Ruim | missoes nao claras de onde tinha que ir. ireo me.irritou de ficar procurando onde estava as missões.  historia fraca |
| FINAL FANTASY XII THE ZODIAC AGE | 11h | 🟠 Ruim | não tem pontos fáceis de onde tem que ir, não tem fast travel ilimitada, não tenho paciência pra mundo aberto em que precisa descobrir onde tem que ir. Esse não chega a ser mundo aberto mas mapas são bem grandes |
| NieR:Automata | 5h | 🔴 Muito Ruim | Acho que era pela história fraca |
| Wuchang: Fallen Feathers | 0.5h | 🔴 Muito Ruim | Souls-like não-FromSoft; corrida da morte punitiva (repetir trajeto longo até o ponto de morte). Viola aversão a perder tempo/progresso. |

---

*Documentação v11 — atualizada em 16/07/2026*  
*Alterações v11: Ajustes de veredicto confirmados pelo usuário — Valhalla Bom→Mediano, Demon Souls Bom→Mediano, Hogwarts Ruim→Bom, Black Flag Resync Muito Ruim→Ruim · Gerador `gerar_doc.py` criado · Spec do agente em `agente_perfil_gamer.md`*  
*Alterações v10: Sistema de Veredictos (6 níveis, estilo ACG) substitui nota numérica · Componentes 1–4 mantidos internos*  
*Alterações v9: HLTB e Tempo PS4/PS5 removidos · Exp33 79h W=2 · AC Shadows NG+ R$60 · Black Flag Resync adicionado · Tsushima 65h, HZD 25h*