"use client";

import type { Question } from "@/lib/encuesta/types";

const labelBase = "text-sm font-medium";
const labelOk = "text-zinc-700 dark:text-zinc-300";
const labelErr = "text-red-500";

const optionBase =
  "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors";
const optionOff =
  "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500";
const optionOn =
  "border-black bg-zinc-100 text-black dark:border-white dark:bg-zinc-800 dark:text-white";

const inputBase =
  "rounded-lg border bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none dark:bg-zinc-900 dark:text-zinc-100";
const inputOk =
  "border-zinc-300 focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-500";
const inputErr = "border-red-400 focus:border-red-500";

export function FieldLabel({
  number,
  question,
  error,
  required,
}: {
  number: number;
  question: Question;
  error: boolean;
  required: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className={`${labelBase} ${error ? labelErr : labelOk}`}>
        {number}. {question.question_text}
        {!required && (
          <span className="font-normal text-zinc-400"> (opcional)</span>
        )}
      </label>
      {question.help_text && (
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          {question.help_text}
        </p>
      )}
    </div>
  );
}

export function Instructions({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-100/60 p-4 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
      {text.split("\n\n").map((para, i) => (
        <p key={i} className={i > 0 ? "mt-2" : ""}>
          {para.split("\n").map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

export function TextInput({
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}: {
  type?: "text" | "tel" | "email" | "number";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputBase} ${error ? inputErr : inputOk}`}
      placeholder={placeholder}
    />
  );
}

export function TextareaInput({
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  error: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className={`${inputBase} ${error ? inputErr : inputOk}`}
      placeholder={placeholder}
    />
  );
}

export function RadioGroup({
  options,
  value,
  onChange,
  allowOther,
  otherLabel = "Otro",
  otherValue,
  onOtherChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  allowOther?: boolean;
  otherLabel?: string;
  otherValue?: string;
  onOtherChange?: (v: string) => void;
}) {
  const baseOptions = allowOther
    ? options.filter((o) => o !== otherLabel)
    : options;
  const otherSelected = Boolean(allowOther) && value === otherLabel;

  return (
    <div className="flex flex-col gap-2">
      {baseOptions.map((option) => (
        <RadioOption
          key={option}
          option={option}
          selected={value === option}
          onSelect={() => onChange(option)}
        />
      ))}

      {allowOther && (
        <>
          <RadioOption
            option={otherLabel}
            selected={otherSelected}
            onSelect={() => onChange(otherLabel)}
          />
          {otherSelected && onOtherChange && (
            <input
              type="text"
              value={otherValue ?? ""}
              onChange={(e) => onOtherChange(e.target.value)}
              className="ml-7 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
              placeholder="¿Cuál?"
            />
          )}
        </>
      )}
    </div>
  );
}

function RadioOption({
  option,
  selected,
  onSelect,
}: {
  option: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label className={`${optionBase} ${selected ? optionOn : optionOff}`}>
      <input
        type="radio"
        value={option}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
          selected
            ? "border-black dark:border-white"
            : "border-zinc-400 dark:border-zinc-600"
        }`}
      >
        {selected && (
          <span className="h-2 w-2 rounded-full bg-black dark:bg-white" />
        )}
      </span>
      {option}
    </label>
  );
}

export function CheckboxGroup({
  options,
  selected,
  onToggle,
  allowOther,
  otherLabel = "Otros",
  otherValue,
  onOtherChange,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  allowOther?: boolean;
  otherLabel?: string;
  otherValue: string;
  onOtherChange: (v: string) => void;
}) {
  const baseOptions = allowOther
    ? options.filter((o) => o !== otherLabel)
    : options;
  const otherChecked = selected.includes(otherLabel);

  return (
    <div className="flex flex-col gap-2">
      {baseOptions.map((option) => {
        const checked = selected.includes(option);
        return (
          <label
            key={option}
            className={`${optionBase} ${checked ? optionOn : optionOff}`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(option)}
              className="sr-only"
            />
            <CheckboxBox checked={checked} />
            {option}
          </label>
        );
      })}

      {allowOther && (
        <>
          <label
            className={`${optionBase} ${otherChecked ? optionOn : optionOff}`}
          >
            <input
              type="checkbox"
              checked={otherChecked}
              onChange={() => onToggle(otherLabel)}
              className="sr-only"
            />
            <CheckboxBox checked={otherChecked} />
            {otherLabel}
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
        </>
      )}
    </div>
  );
}

function CheckboxBox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
        checked
          ? "border-black bg-black dark:border-white dark:bg-white"
          : "border-zinc-400 dark:border-zinc-600"
      }`}
    >
      {checked && (
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
  );
}

export function LikertScale({
  min,
  max,
  labels,
  value,
  onChange,
}: {
  min: number;
  max: number;
  labels: Record<string, string>;
  value: number | null;
  onChange: (v: number) => void;
}) {
  const points: number[] = [];
  for (let i = min; i <= max; i++) points.push(i);
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
      {points.map((n) => {
        const selected = value === n;
        const label = labels[String(n)] ?? "";
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors sm:min-w-[100px] sm:max-w-[150px] sm:flex-col sm:items-center sm:text-center ${
              selected ? optionOn : optionOff
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-base font-bold ${
                selected
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              }`}
            >
              {n}
            </span>
            {label && <span className="text-sm">{label}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function DropdownField({
  options,
  value,
  onChange,
  error,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputBase} ${error ? inputErr : inputOk}`}
    >
      <option value="">Selecciona una opción</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
