"use client";

import { useEffect, useState } from "react";
import Onboarding from "@/components/Onboarding";
import Chat from "@/components/Chat";
import Roteiro from "@/components/Roteiro";
import ContentHealth from "@/components/ContentHealth";
import type { PerfilUsuario } from "@/lib/types";

const CHAVE = "bagagem:perfil";

export default function Home() {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAVE);
      if (raw) setPerfil(JSON.parse(raw));
    } catch {
      /* ignora */
    }
    setPronto(true);
  }, []);

  function concluir(p: PerfilUsuario) {
    setPerfil(p);
    localStorage.setItem(CHAVE, JSON.stringify(p));
  }

  function trocar() {
    localStorage.removeItem(CHAVE);
    setPerfil(null);
  }

  if (!pronto) return null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🧳 Bagagem</h1>
          <p className="text-sm text-slate-500">
            Tutor de idiomas para viagem — entender e construir, não decorar.
          </p>
        </div>
        {perfil && (
          <button
            onClick={trocar}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:border-slate-400"
          >
            Trocar viagem
          </button>
        )}
      </header>

      {!perfil ? (
        <Onboarding onConcluir={concluir} />
      ) : (
        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          <Chat perfil={perfil} />
          <aside className="space-y-6">
            <Roteiro perfil={perfil} />
            <ContentHealth />
          </aside>
        </div>
      )}
    </main>
  );
}
