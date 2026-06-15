"use client";

import { useRef, useState } from "react";
import type { PerfilUsuario, RespostaTutorAPI } from "@/lib/types";

interface TurnoAluno {
  papel: "aluno";
  texto: string;
}
interface TurnoTutor {
  papel: "tutor";
  dados: RespostaTutorAPI;
}
type Turno = TurnoAluno | TurnoTutor;

export default function Chat({ perfil }: { perfil: PerfilUsuario }) {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [entrada, setEntrada] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const fimRef = useRef<HTMLDivElement>(null);

  async function enviar(texto: string) {
    const msg = texto.trim();
    if (!msg || carregando) return;
    setErro(null);
    setEntrada("");
    setTurnos((t) => [...t, { papel: "aluno", texto: msg }]);
    setCarregando(true);
    try {
      const r = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perfil, mensagem: msg }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.erro || "Falha na resposta do tutor.");
      setTurnos((t) => [...t, { papel: "tutor", dados: d as RespostaTutorAPI }]);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro desconhecido.");
    } finally {
      setCarregando(false);
      requestAnimationFrame(() => fimRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  }

  const sugestoes = [
    "Como peço a conta no restaurante?",
    "Je veux un café.",
    "Como pergunto onde fica o banheiro?",
  ];

  return (
    <section className="flex h-[70vh] flex-col rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {turnos.length === 0 && (
          <div className="text-sm text-slate-500">
            <p className="mb-3">
              Comece pedindo uma frase de viagem ou{" "}
              <strong>escreva uma frase em francês de propósito com erro</strong> —
              o tutor corrige explicando o porquê.
            </p>
            <div className="flex flex-wrap gap-2">
              {sugestoes.map((s) => (
                <button
                  key={s}
                  onClick={() => enviar(s)}
                  className="rounded-full border border-slate-300 px-3 py-1.5 text-xs hover:border-brand hover:text-brand"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {turnos.map((t, i) =>
          t.papel === "aluno" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-brand px-4 py-2 text-white">
                {t.texto}
              </div>
            </div>
          ) : (
            <TutorBolha key={i} dados={t.dados} />
          ),
        )}

        {carregando && <p className="text-sm text-slate-400">O tutor está pensando…</p>}
        {erro && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>
        )}
        <div ref={fimRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviar(entrada);
        }}
        className="flex gap-2 border-t border-slate-200 p-3"
      >
        <input
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          placeholder="Escreva em português ou tente em francês…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
        />
        <button
          type="submit"
          disabled={carregando}
          className="rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </section>
  );
}

function TutorBolha({ dados }: { dados: RespostaTutorAPI }) {
  const { saida, guarda, usouFallback, modoDemo } = dados;
  return (
    <div className="flex justify-start">
      <div className="max-w-[88%] space-y-3 rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3">
        <p className="whitespace-pre-line text-sm">{saida.resposta}</p>

        {saida.correcoes.length > 0 && (
          <div className="space-y-2">
            {saida.correcoes.map((c, i) => (
              <div key={i} className="rounded-lg bg-amber-50 px-3 py-2 text-sm">
                <span className="line-through decoration-red-400">{c.erro}</span>{" "}
                → <span className="font-medium text-emerald-700">{c.correto}</span>
                <p className="mt-1 text-xs text-slate-600">
                  <strong>{c.tipo}:</strong> {c.regra_pt}
                </p>
              </div>
            ))}
          </div>
        )}

        {saida.vocab_novo.length > 0 && (
          <div className="space-y-2">
            {saida.vocab_novo.map((v, i) => (
              <div key={i} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium">{v.alvo}</span>
                  <span className="text-xs text-slate-500">{v.traducao}</span>
                </div>
                {v.desmontado && v.desmontado.length > 0 && (
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {v.desmontado.map((p, j) => (
                      <li
                        key={j}
                        title={p.nota}
                        className="rounded bg-slate-100 px-2 py-0.5 text-xs"
                      >
                        <span className="font-medium">{p.alvo}</span>
                        <span className="text-slate-500"> = {p.traducao}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {saida.audio_texto.length > 0 && (
          <div className="text-xs text-slate-500">
            🔊 <span className="italic">Voz chega na Fase 2.</span> Frases para treinar:{" "}
            {saida.audio_texto.join(" · ")}
          </div>
        )}

        {saida.proxima_meta && (
          <p className="text-xs font-medium text-brand">🎯 {saida.proxima_meta}</p>
        )}

        <GuardaBadge guarda={guarda} usouFallback={usouFallback} modoDemo={modoDemo} />
      </div>
    </div>
  );
}

function GuardaBadge({
  guarda,
  usouFallback,
  modoDemo,
}: {
  guarda: RespostaTutorAPI["guarda"];
  usouFallback: boolean;
  modoDemo: boolean;
}) {
  const reprovadas = guarda.avaliacoes.filter(
    (a) => !(a.gramatica_ok && a.natural && a.nivel_ok),
  ).length;
  const fatosRuins = guarda.fatosConferidos.filter((f) => !f.ok).length;

  let label: string;
  let cor: string;
  if (modoDemo) {
    label = "Conteúdo verificado (modo demo)";
    cor = "bg-amber-100 text-amber-800";
  } else if (usouFallback) {
    label = `Geração reprovada na guarda → caiu para verificado (${reprovadas} frase(s), ${fatosRuins} fato(s))`;
    cor = "bg-amber-100 text-amber-800";
  } else {
    label = "✓ Aprovado: avaliador IA + checagem determinística";
    cor = "bg-emerald-100 text-emerald-800";
  }
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] ${cor}`}>
      {label}
    </span>
  );
}
