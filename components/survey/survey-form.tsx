"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckboxGroup,
  DropdownField,
  FieldLabel,
  Instructions,
  LikertScale,
  RadioGroup,
  TextInput,
  TextareaInput,
} from "./fields";
import { submitResponse } from "@/lib/encuesta/api";
import type {
  Answers,
  AnswerValue,
  Question,
  RespondentMetadata,
  SurveyData,
} from "@/lib/encuesta/types";

function defaultAnswer(q: Question): AnswerValue {
  switch (q.question_type) {
    case "checkbox":
    case "checkbox_with_details":
      return [];
    case "likert_scale":
    case "number":
      return null;
    default:
      return "";
  }
}

function isAnswered(q: Question, value: AnswerValue): boolean {
  switch (q.question_type) {
    case "text":
    case "textarea":
    case "radio":
    case "dropdown":
      return typeof value === "string" && value.trim().length > 0;
    case "checkbox":
      return Array.isArray(value) && value.length > 0;
    case "likert_scale":
    case "number":
      return value !== null && value !== "";
    case "checkbox_with_details":
      return Array.isArray(value) ? value.length > 0 : false;
    default:
      return Boolean(value);
  }
}

function readSourceMetadata(): Pick<
  RespondentMetadata,
  "source" | "utm_source" | "utm_medium" | "utm_campaign"
> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("source"),
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
  };
}

export function SurveyForm({ data }: { data: SurveyData }) {
  const { token, questions } = data;

  const [values, setValues] = useState<Answers>(() => {
    const init: Answers = {};
    for (const q of questions) init[q.id] = defaultAnswer(q);
    return init;
  });
  const [otherTexts, setOtherTexts] = useState<Record<string, string>>({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const allRequired = Boolean(token.metadata?.all_required);

  const requiredQuestions = useMemo(
    () =>
      allRequired ? questions : questions.filter((q) => q.is_required),
    [questions, allRequired]
  );

  const isValid = useMemo(
    () =>
      requiredQuestions.every((q) =>
        isAnswered(q, values[q.id] ?? null)
      ),
    [requiredQuestions, values]
  );

  function setValue(id: string, v: AnswerValue) {
    setValues((prev) => ({ ...prev, [id]: v }));
  }

  function toggleCheckbox(q: Question, option: string) {
    const current = (values[q.id] as string[] | null) ?? [];
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    setValue(q.id, next);
    const otherLabel = q.metadata?.other_label ?? "Otros";
    if (option === otherLabel && current.includes(otherLabel)) {
      setOtherTexts((prev) => ({ ...prev, [q.id]: "" }));
    }
  }

  function buildSubmitAnswers(): Answers {
    const out: Answers = {};
    for (const q of questions) {
      const v = values[q.id];
      if (q.question_type === "checkbox" && q.metadata?.allow_other) {
        const selected = (v as string[] | null) ?? [];
        const otherLabel = q.metadata.other_label ?? "Otros";
        const other = otherTexts[q.id]?.trim();
        if (selected.length === 0 && !other) {
          out[q.id] = null;
        } else {
          out[q.id] = {
            selected,
            ...(selected.includes(otherLabel) && other ? { other } : {}),
          };
        }
      } else if (q.question_type === "checkbox") {
        const selected = (v as string[] | null) ?? [];
        out[q.id] = selected.length > 0 ? selected : null;
      } else if (q.question_type === "radio" && q.metadata?.allow_other) {
        const selected = typeof v === "string" ? v : "";
        const otherLabel = q.metadata.other_label ?? "Otro";
        const other = otherTexts[q.id]?.trim();
        if (!selected) {
          out[q.id] = null;
        } else {
          out[q.id] = {
            value: selected,
            ...(selected === otherLabel && other ? { other } : {}),
          };
        }
      } else if (typeof v === "string" && v.trim() === "") {
        out[q.id] = null;
      } else {
        out[q.id] = v ?? null;
      }
    }
    return out;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIntentoEnvio(true);
    setSubmitError(null);
    if (!isValid) return;

    setEnviando(true);
    try {
      const metadata: RespondentMetadata = {
        user_agent:
          typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        submitted_at: new Date().toISOString(),
        ...readSourceMetadata(),
      };
      await submitResponse(token.id, buildSubmitAnswers(), metadata);
      setEnviado(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "No pudimos guardar tu respuesta. Intenta de nuevo."
      );
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    const successTitle =
      token.metadata?.success_title ?? "¡Gracias por responder!";
    const successMessage =
      token.metadata?.success_message ?? "Recibimos tu respuesta.";
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
        <main className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            {successTitle}
          </h1>
          <p className="max-w-sm text-zinc-600 dark:text-zinc-400">
            {successMessage}
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

  const submitButtonLabel =
    token.metadata?.submit_button ?? "Enviar respuesta";

  let questionNumber = 0;
  let lastCategory: string | null | undefined = undefined;

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 px-6 py-12 font-sans dark:bg-black">
      <main className="flex w-full max-w-lg flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            {token.title}
          </h1>
          {token.subtitle && (
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {token.subtitle}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {questions.map((q) => {
            questionNumber += 1;
            const showCategoryDivider =
              q.category !== lastCategory && lastCategory !== undefined;
            lastCategory = q.category;

            const required = allRequired || q.is_required;
            const error =
              intentoEnvio && required &&
              !isAnswered(q, values[q.id] ?? null);

            return (
              <div key={q.id} className="flex flex-col gap-3">
                {showCategoryDivider && (
                  <hr className="border-zinc-200 dark:border-zinc-800" />
                )}
                {q.instructions && <Instructions text={q.instructions} />}
                <FieldLabel
                  number={questionNumber}
                  question={q}
                  error={error}
                  required={required}
                />
                {renderField(q, values[q.id] ?? null, error, {
                  setValue,
                  toggleCheckbox,
                  otherText: otherTexts[q.id] ?? "",
                  setOtherText: (v) =>
                    setOtherTexts((prev) => ({ ...prev, [q.id]: v })),
                })}
              </div>
            );
          })}

          {intentoEnvio && !isValid && (
            <p className="text-sm text-red-500">
              Por favor completa los campos obligatorios marcados en rojo.
            </p>
          )}

          {submitError && (
            <p className="text-sm text-red-500">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {enviando ? "Enviando..." : submitButtonLabel}
          </button>
        </form>
      </main>
    </div>
  );
}

type RenderHandlers = {
  setValue: (id: string, v: AnswerValue) => void;
  toggleCheckbox: (q: Question, option: string) => void;
  otherText: string;
  setOtherText: (v: string) => void;
};

function renderField(
  q: Question,
  value: AnswerValue,
  error: boolean,
  h: RenderHandlers
) {
  switch (q.question_type) {
    case "text":
    case "number": {
      const inputType =
        q.question_type === "number"
          ? "number"
          : q.metadata?.input_mode === "tel"
          ? "tel"
          : q.metadata?.input_mode === "email"
          ? "email"
          : "text";
      return (
        <TextInput
          type={inputType}
          value={typeof value === "string" || typeof value === "number" ? String(value ?? "") : ""}
          onChange={(v) => h.setValue(q.id, v)}
          placeholder={q.metadata?.placeholder}
          error={error}
        />
      );
    }
    case "textarea":
      return (
        <TextareaInput
          value={typeof value === "string" ? value : ""}
          onChange={(v) => h.setValue(q.id, v)}
          placeholder={q.metadata?.placeholder}
          error={error}
        />
      );
    case "radio": {
      const otherLabel = q.metadata?.other_label ?? "Otro";
      return (
        <RadioGroup
          options={q.options ?? []}
          value={typeof value === "string" ? value : ""}
          onChange={(v) => {
            h.setValue(q.id, v);
            if (q.metadata?.allow_other && v !== otherLabel) {
              h.setOtherText("");
            }
          }}
          allowOther={q.metadata?.allow_other}
          otherLabel={q.metadata?.other_label}
          otherValue={h.otherText}
          onOtherChange={h.setOtherText}
        />
      );
    }
    case "checkbox":
      return (
        <CheckboxGroup
          options={q.options ?? []}
          selected={Array.isArray(value) ? (value as string[]) : []}
          onToggle={(o) => h.toggleCheckbox(q, o)}
          allowOther={q.metadata?.allow_other}
          otherLabel={q.metadata?.other_label}
          otherValue={h.otherText}
          onOtherChange={h.setOtherText}
        />
      );
    case "dropdown":
      return (
        <DropdownField
          options={q.options ?? []}
          value={typeof value === "string" ? value : ""}
          onChange={(v) => h.setValue(q.id, v)}
          error={error}
        />
      );
    case "likert_scale":
      return (
        <LikertScale
          min={q.scale_min ?? 1}
          max={q.scale_max ?? 5}
          labels={q.scale_labels ?? {}}
          value={typeof value === "number" ? value : null}
          onChange={(v) => h.setValue(q.id, v)}
        />
      );
    case "checkbox_with_details":
      return (
        <p className="text-sm text-zinc-500">
          (Tipo de pregunta no soportado todavía: checkbox_with_details)
        </p>
      );
    default:
      return null;
  }
}
