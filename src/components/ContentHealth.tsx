"use client";

import { useEffect, useState } from "react";

interface Stats {
  total: number;
  verificado: number;
  pctVerificado: number;
  modoDemo: boolean;
}

export default function ContentHealth() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/content/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) return null;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h3 className="font-semibold">Saúde do conteúdo</h3>
      <p className="mt-1 text-sm text-slate-500">
        O tutor só ensina a partir de conteúdo <strong>verificado</strong> (camada B).
      </p>
      <div className="mt-3">
        <div className="flex justify-between text-sm">
          <span>Verificado</span>
          <span>
            {stats.verificado}/{stats.total} ({stats.pctVerificado}%)
          </span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${stats.pctVerificado}%` }}
          />
        </div>
      </div>
      <p
        className={`mt-3 inline-block rounded-full px-2.5 py-1 text-xs ${
          stats.modoDemo
            ? "bg-amber-100 text-amber-800"
            : "bg-emerald-100 text-emerald-800"
        }`}
      >
        {stats.modoDemo
          ? "Modo demo (sem ANTHROPIC_API_KEY) — respostas vêm do conteúdo verificado"
          : "Tutor + avaliador ativos"}
      </p>
    </section>
  );
}
