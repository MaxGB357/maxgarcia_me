export type QuestionType =
  | "text"
  | "number"
  | "textarea"
  | "radio"
  | "checkbox"
  | "dropdown"
  | "likert_scale"
  | "checkbox_with_details";

export type QuestionMetadata = {
  legacy_field?: string;
  input_mode?: "tel" | "email" | "text" | "numeric";
  placeholder?: string;
  allow_other?: boolean;
  other_label?: string;
  detail_fields?: DetailField[];
  depends_on_question?: string;
  dynamic_source?: "checked_tasks";
  [key: string]: unknown;
};

export type DetailField = {
  id: string;
  label: string;
  required?: boolean;
  options?: string[];
};

export type Question = {
  id: string;
  question_text: string;
  question_type: QuestionType;
  category: string | null;
  is_required: boolean;
  help_text: string | null;
  instructions: string | null;
  options: string[] | null;
  option_groups: Record<string, string[]> | null;
  metadata: QuestionMetadata | null;
  min_value: number | null;
  max_value: number | null;
  scale_min: number | null;
  scale_max: number | null;
  scale_labels: Record<string, string> | null;
};

export type TokenMetadata = {
  cohort?: string;
  audience?: string;
  submit_button?: string;
  success_title?: string;
  success_message?: string;
  all_required?: boolean;
  [key: string]: unknown;
};

export type Token = {
  id: string;
  slug: string | null;
  title: string;
  subtitle: string | null;
  question_ids: string[];
  is_revoked: boolean;
  metadata: TokenMetadata | null;
};

export type SurveyData = {
  token: Token;
  questions: Question[];
};

export type CheckboxAnswer =
  | string[]
  | { selected: string[]; other?: string };

export type RadioAnswer = { value: string; other?: string };

export type CheckboxWithDetailsAnswer = Record<
  string,
  { selected: true } & Record<string, string>
>;

export type AnswerValue =
  | string
  | number
  | string[]
  | RadioAnswer
  | CheckboxAnswer
  | CheckboxWithDetailsAnswer
  | null;

export type Answers = Record<string, AnswerValue>;

export type RespondentMetadata = {
  user_agent?: string;
  submitted_at: string;
  source?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
};
