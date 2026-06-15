import { NextResponse } from "next/server";
import { gerarRoteiro, resumoCronograma } from "@/lib/roteiro";
import type { PerfilUsuario } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { perfil?: PerfilUsuario };
    if (!body.perfil) {
      return NextResponse.json({ erro: "Envie 'perfil'." }, { status: 400 });
    }
    const metas = gerarRoteiro(body.perfil);
    const cronograma = resumoCronograma(body.perfil);
    return NextResponse.json({ metas, cronograma });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "erro desconhecido";
    return NextResponse.json({ erro: `Falha no roteiro: ${msg}` }, { status: 500 });
  }
}
