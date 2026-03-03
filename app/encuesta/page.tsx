"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const CONOCIMIENTO_OPTIONS = [
  "Nada",
  "Algo basico",
  "Tengo buen conocimiento",
  "Nivel avanzado",
];

const USO_OPTIONS = ["Nunca", "Rara vez", "A veces", "Todos los dias"];

const INTERES_OPTIONS = [
  "Si, me interesa mucho",
  "Tal vez, depende de la fecha",
  "No por ahora",
];

const FECHA_OPTIONS = [
  "Fecha por confirmar 1",
  "Fecha por confirmar 2",
  "Fecha por confirmar 3",
  "Ninguna me sirve",
];

function RadioGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </legend>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
              value === option
                ? "border-black bg-zinc-100 text-black dark:border-white dark:bg-zinc-800 dark:text-white"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500"
            }`}
          >
            <input
              type="radio"
              name={label}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                value === option
                  ? "border-black dark:border-white"
                  : "border-zinc-400 dark:border-zinc-600"
              }`}
            >
              {value === option && (
                <span className="h-2 w-2 rounded-full bg-black dark:bg-white" />
              )}
            </span>
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function Encuesta() {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [conocimiento, setConocimiento] = useState("");
  const [uso, setUso] = useState("");
  const [interes, setInteres] = useState("");
  const [fecha, setFecha] = useState("");
  const [queAprender, setQueAprender] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const showFecha =
    interes === "Si, me interesa mucho" ||
    interes === "Tal vez, depende de la fecha";

  const isValid =
    nombre &&
    whatsapp &&
    email &&
    conocimiento &&
    uso &&
    interes &&
    (!showFecha || fecha);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setEnviando(true);
    const { error } = await supabase.from("encuesta_ia").insert({
      nombre,
      whatsapp,
      email,
      conocimiento_ia: conocimiento,
      uso_ia: uso,
      interes,
      fecha_preferida: showFecha ? fecha : "No aplica",
      que_aprender: queAprender || null,
    });

    if (!error) {
      setEnviado(true);
    }
    setEnviando(false);
  }

  if (enviado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
        <main className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Gracias por responder!
          </h1>
          <p className="max-w-sm text-zinc-600 dark:text-zinc-400">
            Te contactaremos para confirmar los detalles de la clase.
          </p>
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
    <div className="flex min-h-screen justify-center bg-zinc-50 px-6 py-12 font-sans dark:bg-black">
      <main className="flex w-full max-w-lg flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            Clase de Inteligencia Artificial
          </h1>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Estoy organizando una clase presencial y gratuita sobre
            Inteligencia Artificial. Me encantaria saber si te interesa y
            cuando podrias asistir.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Datos de contacto */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                1. Nombre completo
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
                placeholder="Tu nombre"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                2. WhatsApp
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
                placeholder="+56 9 1234 5678"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                3. Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          {/* Separador */}
          <hr className="border-zinc-200 dark:border-zinc-800" />

          {/* Preguntas */}
          <RadioGroup
            label="4. Que tanto sabes de IA?"
            options={CONOCIMIENTO_OPTIONS}
            value={conocimiento}
            onChange={setConocimiento}
          />

          <RadioGroup
            label="5. Que tanto usas IA en tu dia a dia?"
            options={USO_OPTIONS}
            value={uso}
            onChange={setUso}
          />

          <hr className="border-zinc-200 dark:border-zinc-800" />

          <RadioGroup
            label="6. Te interesaria asistir a una clase presencial gratuita sobre IA?"
            options={INTERES_OPTIONS}
            value={interes}
            onChange={(v) => {
              setInteres(v);
              if (v === "No por ahora") setFecha("");
            }}
          />

          {showFecha && (
            <RadioGroup
              label="7. Que fecha te acomoda mas?"
              options={FECHA_OPTIONS}
              value={fecha}
              onChange={setFecha}
            />
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {showFecha ? "8" : "7"}. Que te gustaria aprender sobre IA?{" "}
              <span className="font-normal text-zinc-400">(opcional)</span>
            </label>
            <textarea
              value={queAprender}
              onChange={(e) => setQueAprender(e.target.value)}
              rows={3}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
              placeholder="Escribe aqui..."
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || enviando}
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {enviando ? "Enviando..." : "Enviar respuesta"}
          </button>
        </form>
      </main>
    </div>
  );
}
