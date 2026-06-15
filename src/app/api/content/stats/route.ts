import { NextResponse } from "next/server";
import { contarConteudo } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { MODO_DEMO } from "@/lib/anthropic";

export const runtime = "nodejs";

export async function GET() {
  ensureSeeded();
  const { total, verificado } = contarConteudo();
  const pct = total === 0 ? 0 : Math.round((verificado / total) * 100);
  return NextResponse.json({ total, verificado, pctVerificado: pct, modoDemo: MODO_DEMO });
}
