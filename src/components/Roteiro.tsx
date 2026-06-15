"use client";

import { useEffect, useState } from "react";
import type { MetaRoteiro, PerfilUsuario } from "@/lib/types";

export default function Roteiro({ perfil }: { perfil: PerfilUsuario }) {
  const [metas, setMetas] = useState<MetaRoteiro[]>([]);
  const [dias, setDias] = useState<number | null>(null);

  useEffect(() => {
    let vivo = true;
    fetch("/api/roteiro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ perfil }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!vivo) return;
        setMetas(d.metas ?? []);
        setDias(d.cronograma?.diasRestantes ?? null);
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, [perfil]);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold">Roteiro até {perfil.destino}</h3>
        {dias !== null && (
          <span className="text-xs text-slate-500">{dias} dias restantes</span>
        )}
      </div>
      <ul className="mt-3 space-y-2">
        {metas.map((m) => (
          <li
            key={m.id}
            className="flex items-start gap-2 rounded-lg border border-slate-200 px-3 py-2"
          >
            <span className="mt-0.5 text-slate-400">○</span>
            <div>
              <p className="text-sm font-medium">{m.descricao}</p>
              <p className="text-xs text-slate-500">Semana-alvo {m.semanaAlvo}</p>
            </div>
          </li>
        ))}
        {metas.length === 0 && (
          <li className="text-sm text-slate-500">Carregando metas…</li>
        )}
      </ul>
    </section>
  );
}
