"""
Honda HR-V Search
Busca anúncios de Honda HR-V até R$ 80.000 nos principais sites do Brasil.
Filtra por cor (sem branco) e localização (SP capital + cidades até ~1h20).
Analisa preço, quilometragem, ano e descrição para ranquear as melhores oportunidades.
"""

import requests
import json
import re
import time
import unicodedata
from datetime import datetime

# ── Configurações ────────────────────────────────────────────────────────────
MAX_PRICE = 80_000
MAX_KM_IDEAL = 100_000   # km considerado bom
ANO_BASE = 2015          # ano mínimo relevante

# Cores excluídas (normalizado sem acento, minúsculo)
CORES_EXCLUIDAS = {"branco", "branca", "white", "off white", "off-white", "pérola", "perola"}

# Cidades aceitas: SP capital + região até ~1h20 de carro
# (normalizado: sem acento, minúsculo)
CIDADES_ACEITAS = {
    # Capital
    "sao paulo",
    # Grande SP
    "guarulhos", "osasco", "sao bernardo do campo", "santo andre", "diadema",
    "maua", "ribeirao pires", "rio grande da serra", "sao caetano do sul",
    "mogi das cruzes", "suzano", "poa", "ferraz de vasconcelos",
    "itaquaquecetuba", "aruja", "carapicuiba", "itapevi", "jandira",
    "barueri", "santana de parnaiba", "pirapora do bom jesus", "cotia",
    "embu das artes", "embu", "taboao da serra", "itapecerica da serra",
    "sao lourenco da serra", "mairipora", "francisco morato",
    "franco da rocha", "caieiras", "cajamar", "biritiba mirim",
    # Campinas e entorno
    "campinas", "valinhos", "vinhedo", "itatiba", "jundiai", "louveira",
    "itupeva", "indaiatuba", "salto", "itu", "americana", "sumare",
    "nova odessa", "hortolandia", "santa barbara d'oeste",
    "santa barbara do oeste", "paulinia", "cosmopolis", "arthur nogueira",
    "artur nogueira", "engenheiro coelho", "holambra", "monte mor",
    # Bragança / Atibaia
    "atibaia", "braganca paulista", "campo limpo paulista",
    "varzea paulista", "jarinu", "nazare paulista", "piracaia",
    "tuiuti", "pedra bela",
    # Sorocaba e entorno
    "sorocaba", "votorantim", "aracoiaba da serra", "porto feliz",
    "boituva", "tatuí", "tatui", "iperó", "ipero",
    # Via Dutra (leste)
    "jacareí", "jacaeri", "sao jose dos campos",
    # Outros próximos
    "ibiuna", "sao roque", "mairinque", "aluminio", "araçariguama",
    "aracariguama", "pirapora do bom jesus",
}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "pt-BR,pt;q=0.9",
}

# Palavras que indicam boa oportunidade
GREEN_FLAGS = [
    "único dono", "unico dono", "1 dono", "revisão em dia", "revisoes em dia",
    "ipva pago", "garantia", "sem multa", "sem débito", "impecável", "impecavel",
    "original", "placa i", "vistoriado",
]

# Palavras de alerta
RED_FLAGS = [
    "batido", "funilaria", "amassado", "reformado", "sem laudo", "sinistro",
    "recuperado", "leilão", "leilao", "financiado", "vendo partes",
    "para peças", "para pecas",
]


# ── Helpers ──────────────────────────────────────────────────────────────────

def normalizar(texto: str) -> str:
    """Remove acentos e coloca em minúsculo para comparação."""
    if not texto:
        return ""
    s = unicodedata.normalize("NFD", texto.lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def cor_permitida(cor: str | None, titulo: str = "") -> bool:
    """Retorna False se a cor for branco (em qualquer variação)."""
    texto = normalizar((cor or "") + " " + (titulo or ""))
    for excluida in CORES_EXCLUIDAS:
        # Checa cor exata no campo cor ou menção no título
        if cor and normalizar(cor) == excluida:
            return False
        # "branco" no título só exclui se vier precedido de "cor" ou "na cor"
        if re.search(rf"\b{re.escape(excluida)}\b", normalizar(cor or "")):
            return False
    return True


def cidade_permitida(cidade: str | None, estado: str | None) -> bool:
    """Retorna True se a cidade estiver na lista de cidades aceitas."""
    if not cidade:
        return True  # sem info de cidade, não exclui
    # Garante que seja SP
    if estado and normalizar(estado) not in {"sp", "são paulo", "sao paulo"}:
        return False
    return normalizar(cidade) in CIDADES_ACEITAS


def parse_km(value) -> int | None:
    if value is None:
        return None
    s = str(value).lower().replace(".", "").replace(",", "").strip()
    nums = re.findall(r"\d+", s)
    if not nums:
        return None
    val = int(nums[0])
    # Mercado Livre às vezes retorna em milhares
    if val < 500 and "km" not in s:
        val *= 1_000
    return val


def fmt_price(v) -> str:
    if v is None:
        return "N/I"
    return f"R$ {v:,.0f}".replace(",", "X").replace(".", ",").replace("X", ".")


def fmt_km(v) -> str:
    km = parse_km(v) if not isinstance(v, int) else v
    if km is None:
        return "N/I"
    return f"{km:,} km".replace(",", ".")


def check_flags(text: str) -> tuple[list, list]:
    t = (text or "").lower()
    green = [f for f in GREEN_FLAGS if f in t]
    red = [f for f in RED_FLAGS if f in t]
    return green, red


def score_listing(listing: dict) -> float:
    """Pontua o anúncio de 0–100 (quanto maior, melhor negócio)."""
    score = 0.0

    # Preço (35 pts): quanto mais barato em relação ao teto, melhor
    price = listing.get("preco") or MAX_PRICE
    score += max(0, (MAX_PRICE - price) / MAX_PRICE * 35)

    # KM (35 pts): menos km = melhor
    km = parse_km(listing.get("km"))
    if km is not None:
        score += max(0, (MAX_KM_IDEAL - km) / MAX_KM_IDEAL * 35)

    # Ano (20 pts)
    ano_str = str(listing.get("ano") or "")[:4]
    try:
        ano = int(ano_str)
        score += max(0, min(20, (ano - ANO_BASE) * 3))
    except ValueError:
        pass

    # Bônus green flags / penalidade red flags (10 pts)
    desc = str(listing.get("titulo", "")) + " " + str(listing.get("descricao", ""))
    green, red = check_flags(desc)
    score += min(10, len(green) * 3)
    score -= len(red) * 5

    return round(max(0, min(100, score)), 1)


# ── Fonte 1: Mercado Livre (API oficial) ────────────────────────────────────

def buscar_mercadolivre() -> list[dict]:
    print("  [Mercado Livre] buscando...")
    resultados = []
    offset = 0
    limit = 50

    while offset < 250:
        url = "https://api.mercadolibre.com/sites/MLB/search"
        params = {
            "q": "Honda HR-V",
            "category": "MLB1744",  # Carros e Caminhonetes
            "price_to": MAX_PRICE,
            "offset": offset,
            "limit": limit,
        }
        try:
            r = requests.get(url, params=params, headers=HEADERS, timeout=15)
            r.raise_for_status()
            data = r.json()
        except Exception as e:
            print(f"    Erro Mercado Livre: {e}")
            break

        items = data.get("results", [])
        total = data.get("paging", {}).get("total", 0)

        if not items:
            break

        for item in items:
            attrs = {a["id"]: a.get("value_name") for a in item.get("attributes", [])}

            # Pula se não for HR-V
            titulo = item.get("title", "")
            if not re.search(r"hr.?v", titulo, re.IGNORECASE):
                continue

            resultados.append({
                "fonte": "Mercado Livre",
                "titulo": titulo,
                "preco": item.get("price"),
                "km": attrs.get("VEHICLE_MILEAGE") or attrs.get("KILOMETERS"),
                "ano": attrs.get("VEHICLE_YEAR"),
                "versao": attrs.get("TRIM") or attrs.get("MODEL"),
                "cambio": attrs.get("VEHICLE_TRANSMISSION"),
                "cor": attrs.get("COLOR"),
                "cidade": item.get("address", {}).get("city_name", ""),
                "estado": item.get("address", {}).get("state_name", ""),
                "descricao": "",
                "link": item.get("permalink", ""),
            })

        offset += limit
        if offset >= total:
            break
        time.sleep(0.4)

    print(f"    → {len(resultados)} anúncios")
    return resultados


# ── Fonte 2: WebMotors (API pública) ────────────────────────────────────────

def buscar_webmotors() -> list[dict]:
    print("  [WebMotors] buscando...")
    resultados = []

    base_filter = (
        "https://www.webmotors.com.br/carros/estoque/"
        "?TipoVeiculo=carros&Marca=HONDA&Modelo=HR-V&PrecoAte=80000"
    )

    for page in range(1, 6):
        url = "https://www.webmotors.com.br/api/search/car"
        params = {
            "url": f"{base_filter}&Pag={page}",
            "actualPage": page,
            "displayPerPage": 24,
            "order": 1,  # 1 = mais recentes
            "showMenu": "true",
            "listFilters": "true",
            "startZero": "false",
        }
        try:
            r = requests.get(url, params=params, headers=HEADERS, timeout=15)
            r.raise_for_status()
            data = r.json()
        except Exception as e:
            print(f"    Erro WebMotors p.{page}: {e}")
            break

        anuncios = data.get("SearchResults", [])
        if not anuncios:
            break

        for a in anuncios:
            spec = a.get("Specification", {})
            prices = a.get("Prices", {})
            media = a.get("Media", {})

            preco = prices.get("Price") or prices.get("PriceValue")
            if preco and preco > MAX_PRICE:
                continue

            titulo = (
                f"{spec.get('Make', '')} {spec.get('Model', '')} "
                f"{spec.get('Version', '')} {spec.get('ModelYear', '')}".strip()
            )

            resultados.append({
                "fonte": "WebMotors",
                "titulo": titulo,
                "preco": preco,
                "km": spec.get("OdometerLastValue"),
                "ano": spec.get("ModelYear") or spec.get("YearFabrication"),
                "versao": spec.get("Version"),
                "cambio": spec.get("GearShift"),
                "cor": spec.get("Color"),
                "cidade": a.get("Seller", {}).get("City", ""),
                "estado": a.get("Seller", {}).get("State", ""),
                "descricao": a.get("UniqueId", ""),
                "link": f"https://www.webmotors.com.br/carros/anuncio/{a.get('UniqueId', '')}",
            })

        if len(anuncios) < 24:
            break
        time.sleep(0.5)

    print(f"    → {len(resultados)} anúncios")
    return resultados


# ── Fonte 3: iCarros (scraping HTML) ─────────────────────────────────────────

def buscar_icarros() -> list[dict]:
    print("  [iCarros] buscando...")
    resultados = []

    try:
        from bs4 import BeautifulSoup
    except ImportError:
        print("    beautifulsoup4 não instalado, pulando iCarros")
        return resultados

    for page in range(1, 4):
        url = (
            f"https://www.icarros.com.br/ache/listaanuncios.jsp"
            f"?pag={page}&ord=2&modelo=5&marca=21"
            f"&priceMax={MAX_PRICE}"
        )
        try:
            r = requests.get(url, headers=HEADERS, timeout=15)
            r.raise_for_status()
            soup = BeautifulSoup(r.text, "lxml")
        except Exception as e:
            print(f"    Erro iCarros p.{page}: {e}")
            break

        cards = soup.select("li.ads__list__item")
        if not cards:
            # Tenta seletor alternativo
            cards = soup.select(".anuncio") or soup.select("[class*='listing-item']")

        if not cards:
            break

        for card in cards:
            try:
                titulo = (card.select_one("[class*='title']") or card.select_one("h2")).get_text(strip=True)
                preco_el = card.select_one("[class*='price']") or card.select_one(".preco")
                preco_txt = preco_el.get_text(strip=True) if preco_el else ""
                nums = re.findall(r"\d+", preco_txt.replace(".", ""))
                preco = int(nums[0]) if nums else None

                km_el = card.select_one("[class*='km']") or card.select_one(".km")
                km_txt = km_el.get_text(strip=True) if km_el else ""

                link_el = card.select_one("a[href]")
                link = link_el["href"] if link_el else ""
                if link and not link.startswith("http"):
                    link = "https://www.icarros.com.br" + link

                resultados.append({
                    "fonte": "iCarros",
                    "titulo": titulo,
                    "preco": preco,
                    "km": km_txt,
                    "ano": None,
                    "versao": None,
                    "cambio": None,
                    "cor": None,
                    "cidade": "",
                    "estado": "",
                    "descricao": "",
                    "link": link,
                })
            except Exception:
                continue

        time.sleep(0.5)

    print(f"    → {len(resultados)} anúncios")
    return resultados


# ── Saída formatada ──────────────────────────────────────────────────────────

def imprimir_resultado(rank: int, listing: dict, score: float):
    verde = "\033[92m"
    vermelho = "\033[91m"
    amarelo = "\033[93m"
    negrito = "\033[1m"
    reset = "\033[0m"

    desc = str(listing.get("titulo", "")) + " " + str(listing.get("descricao", ""))
    green, red = check_flags(desc)

    barra = "█" * int(score / 10) + "░" * (10 - int(score / 10))
    score_cor = verde if score >= 60 else (amarelo if score >= 40 else vermelho)

    print(f"\n{negrito}#{rank:02d} | Score: {score_cor}{score:5.1f}/100{reset} [{barra}]  [{listing['fonte']}]")
    print(f"     {negrito}{listing['titulo']}{reset}")
    print(f"     Preço   : {verde}{fmt_price(listing.get('preco'))}{reset}")
    print(f"     KM      : {fmt_km(listing.get('km'))}")
    print(f"     Ano     : {listing.get('ano') or 'N/I'}")
    versao = listing.get("versao")
    if versao:
        print(f"     Versão  : {versao}")
    cambio = listing.get("cambio")
    if cambio:
        print(f"     Câmbio  : {cambio}")
    cor = listing.get("cor")
    if cor:
        print(f"     Cor     : {cor}")
    local = f"{listing.get('cidade', '')} - {listing.get('estado', '')}".strip(" -")
    if local:
        print(f"     Local   : {local}")
    if green:
        print(f"     {verde}✔ {' | '.join(green)}{reset}")
    if red:
        print(f"     {vermelho}⚠ {' | '.join(red)}{reset}")
    print(f"     Link    : {listing['link']}")


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    print("=" * 70)
    print("  HONDA HR-V — Buscador de oportunidades até R$ 80.000")
    print("  Cor: qualquer (exceto branco) | Local: SP + ~1h20")
    print(f"  {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    print("=" * 70)
    print("\nBuscando nos sites...")

    todos = []
    todos += buscar_mercadolivre()
    todos += buscar_webmotors()
    todos += buscar_icarros()

    if not todos:
        print("\nNenhum resultado encontrado. Verifique sua conexão.")
        return

    # Remove duplicados por link
    vistos = set()
    unicos = []
    for item in todos:
        chave = item.get("link", "").split("?")[0]
        if chave and chave not in vistos:
            vistos.add(chave)
            unicos.append(item)

    total_bruto = len(unicos)

    # ── Filtro de cor ────────────────────────────────────────────────────────
    sem_cor_invalida = [x for x in unicos if cor_permitida(x.get("cor"), x.get("titulo", ""))]
    removidos_cor = total_bruto - len(sem_cor_invalida)

    # ── Filtro de cidade ─────────────────────────────────────────────────────
    filtrados = [x for x in sem_cor_invalida if cidade_permitida(x.get("cidade"), x.get("estado"))]
    removidos_cidade = len(sem_cor_invalida) - len(filtrados)

    print(f"\n  Filtros aplicados:")
    print(f"    Cor (sem branco)   : -{removidos_cor} anúncios removidos")
    print(f"    Cidade (SP + 1h20) : -{removidos_cidade} anúncios removidos")

    # Pontua e ordena
    for item in filtrados:
        item["_score"] = score_listing(item)

    ranking = sorted(filtrados, key=lambda x: x["_score"], reverse=True)

    print(f"\n{'=' * 70}")
    print(f"  {len(ranking)} anúncios | Mostrando top 25 melhores negócios")
    print(f"  Filtros: Cor ≠ branco | SP capital + cidades até ~1h20")
    print(f"{'=' * 70}")

    for i, item in enumerate(ranking[:25], 1):
        imprimir_resultado(i, item, item["_score"])

    # Resumo estatístico
    precos = [x["preco"] for x in ranking if x.get("preco")]
    kms = [parse_km(x["km"]) for x in ranking if parse_km(x.get("km"))]

    print(f"\n{'=' * 70}")
    print("  RESUMO")
    print(f"{'=' * 70}")
    print(f"  Total bruto coletado : {total_bruto}")
    print(f"  Removidos (cor)      : {removidos_cor}")
    print(f"  Removidos (cidade)   : {removidos_cidade}")
    print(f"  Anúncios válidos     : {len(ranking)}")
    if precos:
        print(f"  Preço médio  : {fmt_price(int(sum(precos) / len(precos)))}")
        print(f"  Mais barato  : {fmt_price(min(precos))}")
        print(f"  Mais caro    : {fmt_price(max(precos))}")
    if kms:
        print(f"  KM médio     : {fmt_km(int(sum(kms) / len(kms)))}")
        print(f"  Menor KM     : {fmt_km(min(kms))}")
    print()


if __name__ == "__main__":
    main()
