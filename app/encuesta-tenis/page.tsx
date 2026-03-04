"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const ROL_OPTIONS = [
  "Jugador recreativo",
  "Jugador competitivo",
  "Coach o entrenador",
  "Ambos (juego y entreno)",
];

const DEPORTE_OPTIONS = ["Tenis", "Pádel", "Ambos"];

const FRECUENCIA_OPTIONS = [
  "1 vez por semana o menos",
  "2-3 veces por semana",
  "4+ veces por semana",
];

const GRABA_OPTIONS = [
  "Sí, regularmente",
  "Lo he hecho alguna vez",
  "Nunca",
];

const CONOCE_OPTIONS = [
  "Sí",
  "He escuchado algo pero no recuerdo",
  "No conozco ninguno",
];

const UTILIDAD_OPTIONS = [
  "Muy útil",
  "Algo útil",
  "No me interesa mucho",
];

const TIPO_ANALISIS_OPTIONS = [
  "Estadísticas de golpes",
  "Patrones de movimiento",
  "Puntos fuertes y débiles",
  "Comparación entre partidos",
  "Análisis táctico",
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
      <legend
        className={`text-sm font-medium ${error ? "text-red-500" : "text-zinc-700 dark:text-zinc-300"}`}
      >
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
                <svg
                  className="h-3 w-3 text-white dark:text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </span>
            {option}
          </label>
        ))}
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
              <svg
                className="h-3 w-3 text-white dark:text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
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

export default function EncuestaTenis() {
  const [rol, setRol] = useState("");
  const [deporte, setDeporte] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [graba, setGraba] = useState("");
  const [conoce, setConoce] = useState("");
  const [conoceCual, setConoceCual] = useState("");
  const [utilidad, setUtilidad] = useState("");
  const [tipoAnalisis, setTipoAnalisis] = useState<string[]>([]);
  const [tipoAnalisisOtros, setTipoAnalisisOtros] = useState("");
  const [dudas, setDudas] = useState("");
  const [queSaber, setQueSaber] = useState("");
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  const isValid = rol && deporte && frecuencia && graba && conoce && utilidad;

  function toggleTipoAnalisis(t: string) {
    setTipoAnalisis((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
    if (t === "Otros" && tipoAnalisis.includes("Otros")) {
      setTipoAnalisisOtros("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIntentoEnvio(true);
    if (!isValid) return;

    setEnviando(true);
    const { error } = await supabase.from("encuesta_tenis").insert({
      rol,
      deporte,
      frecuencia,
      graba_partidos: graba,
      conoce_servicio: conoce,
      conoce_servicio_cual:
        conoce === "Sí" && conoceCual ? conoceCual : null,
      utilidad,
      tipo_analisis:
        tipoAnalisis.length > 0
          ? tipoAnalisis
              .map((t) =>
                t === "Otros" && tipoAnalisisOtros
                  ? `Otros: ${tipoAnalisisOtros}`
                  : t
              )
              .join(", ")
          : null,
      tipo_analisis_otros: null,
      dudas: dudas || null,
      que_saber: queSaber || null,
      nombre: nombre || null,
      contacto: contacto || null,
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
            ¡Gracias por tu tiempo!
          </h1>
          <p className="max-w-sm text-zinc-600 dark:text-zinc-400">
            Tu opinión nos ayuda a diseñar un mejor servicio.
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
            Analítica Deportiva con IA
          </h1>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Estamos evaluando el interés en un servicio de analítica deportiva
            que utiliza inteligencia artificial para analizar partidos de tenis
            y pádel grabados en video. La idea es capturar patrones de juego y
            entregar estadísticas avanzadas para que jugadores y entrenadores
            puedan mejorar su rendimiento.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <RadioGroup
            label="1. ¿Cuál es tu rol?"
            options={ROL_OPTIONS}
            value={rol}
            onChange={setRol}
            error={intentoEnvio && !rol}
          />

          <RadioGroup
            label="2. ¿Qué deporte practicas?"
            options={DEPORTE_OPTIONS}
            value={deporte}
            onChange={setDeporte}
            error={intentoEnvio && !deporte}
          />

          <RadioGroup
            label="3. ¿Con qué frecuencia juegas?"
            options={FRECUENCIA_OPTIONS}
            value={frecuencia}
            onChange={setFrecuencia}
            error={intentoEnvio && !frecuencia}
          />

          <hr className="border-zinc-200 dark:border-zinc-800" />

          <RadioGroup
            label="4. ¿Alguna vez has grabado tus partidos para analizarlos?"
            options={GRABA_OPTIONS}
            value={graba}
            onChange={setGraba}
            error={intentoEnvio && !graba}
          />

          <RadioGroup
            label="5. ¿Conoces algún servicio o tecnología que haga análisis de partidos con IA?"
            options={CONOCE_OPTIONS}
            value={conoce}
            onChange={setConoce}
            error={intentoEnvio && !conoce}
          />

          {conoce === "Sí" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                ¿Cuál?
              </label>
              <input
                type="text"
                value={conoceCual}
                onChange={(e) => setConoceCual(e.target.value)}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
                placeholder="Nombre del servicio o tecnología"
              />
            </div>
          )}

          <hr className="border-zinc-200 dark:border-zinc-800" />

          <RadioGroup
            label="6. ¿Qué tan útil te parece la idea de un servicio que grabe tu partido y te entregue un análisis detallado de tu juego?"
            options={UTILIDAD_OPTIONS}
            value={utilidad}
            onChange={setUtilidad}
            error={intentoEnvio && !utilidad}
          />

          <CheckboxGroup
            label="7. ¿Qué tipo de análisis te interesaría recibir?"
            options={TIPO_ANALISIS_OPTIONS}
            selected={tipoAnalisis}
            onToggle={toggleTipoAnalisis}
            otherValue={tipoAnalisisOtros}
            onOtherChange={setTipoAnalisisOtros}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              8. ¿Qué dudas o preocupaciones tienes sobre un servicio así?{" "}
              <span className="font-normal text-zinc-400">(opcional)</span>
            </label>
            <textarea
              value={dudas}
              onChange={(e) => setDudas(e.target.value)}
              rows={3}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
              placeholder="Ej: privacidad, costo, precisión del análisis..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              9. ¿Qué más te gustaría saber sobre esta tecnología?{" "}
              <span className="font-normal text-zinc-400">(opcional)</span>
            </label>
            <textarea
              value={queSaber}
              onChange={(e) => setQueSaber(e.target.value)}
              rows={3}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
              placeholder="Escribe aquí..."
            />
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          <div className="flex flex-col gap-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Si te gustaría que te contactemos cuando tengamos novedades,
              déjanos tus datos (opcional).
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                10. Nombre{" "}
                <span className="font-normal text-zinc-400">(opcional)</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
                placeholder="Tu nombre"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                11. Email o WhatsApp{" "}
                <span className="font-normal text-zinc-400">(opcional)</span>
              </label>
              <input
                type="text"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
                placeholder="tu@email.com o +56 9 1234 5678"
              />
            </div>
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
