"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SurveyForm } from "@/components/survey/survey-form";
import { loadSurveyByToken } from "@/lib/encuesta/api";
import type { SurveyData } from "@/lib/encuesta/types";

export function EncuestaClient({
  tokenIdOrSlug,
}: {
  tokenIdOrSlug: string;
}) {
  const [data, setData] = useState<SurveyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadSurveyByToken(tokenIdOrSlug)
      .then((d) => {
        if (active) setData(d);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "No pudimos cargar la encuesta"
        );
      });
    return () => {
      active = false;
    };
  }, [tokenIdOrSlug]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
        <main className="flex max-w-sm flex-col items-center gap-6 text-center">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            No pudimos cargar la encuesta
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{error}</p>
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

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Cargando encuesta...
        </p>
      </div>
    );
  }

  return <SurveyForm data={data} />;
}
