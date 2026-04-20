"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const CONOCIMIENTO_OPTIONS = [
  "Nada",
  "Algo básico",
  "Tengo buen conocimiento",
  "Nivel avanzado",
];

const USO_OPTIONS = ["Nunca", "Rara vez", "A veces", "Todos los días"];

const HERRAMIENTAS_OPTIONS = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Microsoft Copilot",
  "Perplexity",
  "Grok",
  "NotebookLM",
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
  error,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className={`text-sm font-medium ${error ? "text-red-500" : "text-zinc-700 dark:text-zinc-300"}`}>
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

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
  otherValue,
  onOtherChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  otherValue: string;
  onOtherChange: (v: string) => void;
}) {
  const otherChecked = selected.includes("Otros");
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
              selected.includes(option)
                ? "border-black bg-zinc-100 text-black dark:border-white dark:bg-zinc-800 dark:text-white"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="sr-only"
            />
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                selected.includes(option)
                  ? "border-black bg-black dark:border-white dark:bg-white"
                  : "border-zinc-400 dark:border-zinc-600"
              }`}
            >
              {selected.includes(option) && (
                <svg className="h-3 w-3 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            {option}
          </label>
        ))}
        {/* Otros */}
        <label
          className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
            otherChecked
              ? "border-black bg-zinc-100 text-black dark:border-white dark:bg-zinc-800 dark:text-white"
              : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500"
          }`}
        >
          <input
            type="checkbox"
            checked={otherChecked}
            onChange={() => onToggle("Otros")}
            className="sr-only"
          />
          <span
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
              otherChecked
                ? "border-black bg-black dark:border-white dark:bg-white"
                : "border-zinc-400 dark:border-zinc-600"
            }`}
          >
            {otherChecked && (
              <svg className="h-3 w-3 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
          Otros
        </label>
        {otherChecked && (
          <input
            type="text"
            value={otherValue}
            onChange={(e) => onOtherChange(e.target.value)}
            className="ml-7 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
            placeholder="¿Cuál?"
          />
        )}
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
  const [usosDescripcion, setUsosDescripcion] = useState("");
  const [herramientas, setHerramientas] = useState<string[]>([]);
  const [herramientasOtros, setHerramientasOtros] = useState("");
  const [casosUsoPendientes, setCasosUsoPendientes] = useState("");
  const [fecha, setFecha] = useState("");
  const [queAprender, setQueAprender] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  const isValid =
    nombre &&
    whatsapp &&
    email &&
    conocimiento &&
    uso &&
    fecha;

  function toggleHerramienta(h: string) {
    setHerramientas((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]
    );
    if (h === "Otros" && herramientas.includes("Otros")) {
      setHerramientasOtros("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIntentoEnvio(true);
    if (!isValid) return;

    setEnviando(true);
    const { error } = await supabase
      .from("respuestas_encuesta_clases_abril")
      .insert({
        nombre,
        whatsapp,
        email,
        conocimiento_ia: conocimiento,
        uso_ia: uso,
        usos_ia: usosDescripcion || null,
        herramientas_ia:
          herramientas.length > 0
            ? herramientas
                .map((h) =>
                  h === "Otros" && herramientasOtros
                    ? `Otros: ${herramientasOtros}`
                    : h
                )
                .join(", ")
            : null,
        casos_uso_pendientes: casosUsoPendientes || null,
        fecha_preferida: fecha,
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
            ¡Gracias por responder!
          </h1>
          <p className="max-w-sm text-zinc-600 dark:text-zinc-400">
            Recibí tu inscripción. Te contactaré por WhatsApp con los detalles
            de la clase.
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
            Estoy organizando una clase presencial sobre Inteligencia
            Artificial. Completa esta breve encuesta para reservar tu cupo y
            ayudarme a adaptar el contenido.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Datos de contacto */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={`text-sm font-medium ${intentoEnvio && !nombre ? "text-red-500" : "text-zinc-700 dark:text-zinc-300"}`}>
                1. Nombre completo
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={`rounded-lg border bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none dark:bg-zinc-900 dark:text-zinc-100 ${intentoEnvio && !nombre ? "border-red-400 focus:border-red-500" : "border-zinc-300 focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-500"}`}
                placeholder="Tu nombre"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={`text-sm font-medium ${intentoEnvio && !whatsapp ? "text-red-500" : "text-zinc-700 dark:text-zinc-300"}`}>
                2. WhatsApp
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className={`rounded-lg border bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none dark:bg-zinc-900 dark:text-zinc-100 ${intentoEnvio && !whatsapp ? "border-red-400 focus:border-red-500" : "border-zinc-300 focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-500"}`}
                placeholder="+56 9 1234 5678"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={`text-sm font-medium ${intentoEnvio && !email ? "text-red-500" : "text-zinc-700 dark:text-zinc-300"}`}>
                3. Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`rounded-lg border bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none dark:bg-zinc-900 dark:text-zinc-100 ${intentoEnvio && !email ? "border-red-400 focus:border-red-500" : "border-zinc-300 focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-500"}`}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          {/* Separador */}
          <hr className="border-zinc-200 dark:border-zinc-800" />

          {/* Preguntas */}
          <RadioGroup
            label="4. ¿Qué tanto sabes de IA?"
            options={CONOCIMIENTO_OPTIONS}
            value={conocimiento}
            onChange={setConocimiento}
            error={intentoEnvio && !conocimiento}
          />

          <RadioGroup
            label="5. ¿Qué tanto usas IA en tu día a día?"
            options={USO_OPTIONS}
            value={uso}
            onChange={setUso}
            error={intentoEnvio && !uso}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              6. ¿Para qué has usado la IA?{" "}
              <span className="font-normal text-zinc-400">(opcional)</span>
            </label>
            <textarea
              value={usosDescripcion}
              onChange={(e) => setUsosDescripcion(e.target.value)}
              rows={3}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
              placeholder="Ej: buscar información, redactar textos, programar..."
            />
          </div>

          <CheckboxGroup
            label="7. ¿Qué herramientas de IA usas actualmente?"
            options={HERRAMIENTAS_OPTIONS}
            selected={herramientas}
            onToggle={toggleHerramienta}
            otherValue={herramientasOtros}
            onOtherChange={setHerramientasOtros}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              8. ¿Hay algo que te gustaría hacer con IA pero no has podido o no sabes si se puede?{" "}
              <span className="font-normal text-zinc-400">(opcional)</span>
            </label>
            <textarea
              value={casosUsoPendientes}
              onChange={(e) => setCasosUsoPendientes(e.target.value)}
              rows={3}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
              placeholder="Ej: automatizar reportes, analizar datos de ventas, traducir documentos..."
            />
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          <RadioGroup
            label="9. ¿Qué fecha te acomoda más?"
            options={FECHA_OPTIONS}
            value={fecha}
            onChange={setFecha}
            error={intentoEnvio && !fecha}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              10. ¿Qué te gustaría aprender sobre IA?{" "}
              <span className="font-normal text-zinc-400">(opcional)</span>
            </label>
            <textarea
              value={queAprender}
              onChange={(e) => setQueAprender(e.target.value)}
              rows={3}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
              placeholder="Escribe aquí..."
            />
          </div>

          {intentoEnvio && !isValid && (
            <p className="text-sm text-red-500">
              Por favor completa los campos obligatorios marcados en rojo.
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {enviando ? "Enviando..." : "Enviar respuesta"}
          </button>
        </form>
      </main>
    </div>
  );
}
