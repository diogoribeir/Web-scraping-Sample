import { NextResponse } from "next/server";
import { rodarTurnoTutor } from "@/lib/tutor";
import { ensureSeeded } from "@/lib/seed";
import type { PerfilUsuario } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    ensureSeeded();
    const body = (await req.json()) as { perfil?: PerfilUsuario; mensagem?: string };
    if (!body.perfil || !body.mensagem?.trim()) {
      return NextResponse.json(
        { erro: "Envie 'perfil' e 'mensagem'." },
        { status: 400 },
      );
    }
    const resultado = await rodarTurnoTutor(body.perfil, body.mensagem.trim());
    return NextResponse.json(resultado);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "erro desconhecido";
    return NextResponse.json({ erro: `Falha no tutor: ${msg}` }, { status: 500 });
  }
}
