import { supabase } from "@/lib/supabase";
import type {
  Answers,
  Question,
  RespondentMetadata,
  SurveyData,
  Token,
} from "./types";

export const DEFAULT_TOKEN_SLUG = "clase-abril";

export async function loadSurveyByToken(
  tokenIdOrSlug: string
): Promise<SurveyData> {
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      tokenIdOrSlug
    );

  const tokenQuery = supabase
    .from("tokens")
    .select(
      "id, slug, title, subtitle, question_ids, is_revoked, metadata"
    )
    .limit(1);

  const { data: tokenData, error: tokenError } = await (isUuid
    ? tokenQuery.eq("id", tokenIdOrSlug)
    : tokenQuery.eq("slug", tokenIdOrSlug)
  ).single();

  if (tokenError || !tokenData) {
    throw new Error("Token inválido o no encontrado");
  }

  const token = tokenData as Token;

  if (token.is_revoked) {
    throw new Error("Este link ya no es válido");
  }

  const questionIds = Array.isArray(token.question_ids)
    ? token.question_ids
    : JSON.parse(String(token.question_ids));

  const { data: questionsData, error: questionsError } = await supabase
    .from("questions")
    .select(
      "id, question_text, question_type, category, is_required, help_text, instructions, options, option_groups, metadata, min_value, max_value, scale_min, scale_max, scale_labels"
    )
    .in("id", questionIds);

  if (questionsError || !questionsData) {
    throw new Error("Error al cargar las preguntas");
  }

  const questions = (questionsData as Question[]).slice().sort(
    (a, b) => questionIds.indexOf(a.id) - questionIds.indexOf(b.id)
  );

  return { token, questions };
}

export async function submitResponse(
  tokenId: string,
  answers: Answers,
  metadata: RespondentMetadata
): Promise<void> {
  const { error } = await supabase.from("responses").insert({
    token_id: tokenId,
    answers,
    respondent_metadata: metadata,
  });

  if (error) {
    throw new Error(error.message || "No pudimos guardar tu respuesta");
  }
}
