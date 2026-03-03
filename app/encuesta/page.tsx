"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Encuesta() {
  const [calificacion, setCalificacion] = useState<number | null>(null);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!calificacion) return;

    setEnviando(true);
    const { error } = await supabase
      .from("respuestas")
      .insert({ calificacion, comentario: comentario || null });

    if (!error) {
      setEnviado(true);
    }
    setEnviando(false);
  }

  if (enviado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Gracias por tu respuesta!
          </h1>
          <Link
            href="/"
            className="text-sm text-zinc-500 underline hover:text-zinc-800 dark:hover:text-zinc-300"
          >
            Volver al inicio
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col gap-8 px-8">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Encuesta
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Como calificas esta pagina?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCalificacion(n)}
                  className={`h-10 w-10 rounded-full text-sm font-medium transition-colors ${
                    calificacion === n
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Algun comentario?
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={3}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
              placeholder="Escribe aqui..."
            />
          </div>

          <button
            type="submit"
            disabled={!calificacion || enviando}
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {enviando ? "Enviando..." : "Enviar"}
          </button>
        </form>

        <Link
          href="/"
          className="text-sm text-zinc-500 underline hover:text-zinc-800 dark:hover:text-zinc-300"
        >
          Volver al inicio
        </Link>
      </main>
    </div>
  );
}
