"use client";

import { useState } from "react";
import type { Nivel, PerfilUsuario, Situacao } from "@/lib/types";

const SITUACOES: { id: Situacao; label: string }[] = [
  { id: "restaurante", label: "🍽️ Restaurante" },
  { id: "hotel", label: "🏨 Hotel" },
  { id: "rua", label: "🧭 Rua / direções" },
  { id: "transporte", label: "🚆 Transporte" },
  { id: "compras", label: "🛍️ Compras" },
  { id: "emergencia", label: "🆘 Emergência" },
];

const NIVEIS: { id: Nivel; label: string }[] = [
  { id: "zero", label: "Do zero" },
  { id: "iniciante", label: "Iniciante" },
  { id: "intermediario", label: "Intermediário" },
];

export default function Onboarding({
  onConcluir,
}: {
  onConcluir: (perfil: PerfilUsuario) => void;
}) {
  const [destino, setDestino] = useState("Paris");
  const [dataViagem, setDataViagem] = useState("");
  const [nivel, setNivel] = useState<Nivel>("zero");
  const [contexto, setContexto] = useState<Situacao[]>(["restaurante", "rua"]);

  function toggle(s: Situacao) {
    setContexto((cur) =>
      cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s],
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onConcluir({
      linguaMaterna: "português brasileiro",
      idiomaAlvo: "francês",
      destino: destino.trim() || "Paris",
      dataViagem: dataViagem || proximaData(),
      contexto: contexto.length ? contexto : ["restaurante"],
      nivel,
    });
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
    >
      <h2 className="text-xl font-semibold">Vamos montar sua viagem 🧳</h2>
      <p className="mt-1 text-sm text-slate-500">
        Ensinando <strong>francês</strong> para falante de{" "}
        <strong>português brasileiro</strong>. O roteiro é montado de trás pra
        frente a partir da data da viagem.
      </p>

      <label className="mt-5 block text-sm font-medium">Destino</label>
      <input
        value={destino}
        onChange={(e) => setDestino(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        placeholder="Ex.: Paris"
      />

      <label className="mt-4 block text-sm font-medium">Data da viagem</label>
      <input
        type="date"
        value={dataViagem}
        onChange={(e) => setDataViagem(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
      />

      <fieldset className="mt-4">
        <legend className="text-sm font-medium">Onde quer se virar?</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {SITUACOES.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                contexto.includes(s.id)
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium">Seu nível agora</legend>
        <div className="mt-2 flex gap-2">
          {NIVEIS.map((n) => (
            <button
              type="button"
              key={n.id}
              onClick={() => setNivel(n.id)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
                nivel === n.id
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-brand px-4 py-2.5 font-medium text-white hover:bg-brand-dark"
      >
        Começar a aprender
      </button>
    </form>
  );
}

function proximaData(): string {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return d.toISOString().slice(0, 10);
}
