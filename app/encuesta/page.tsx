import { EncuestaClient } from "./encuesta-client";
import { DEFAULT_TOKEN_SLUG } from "@/lib/encuesta/api";

export default async function EncuestaPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; slug?: string }>;
}) {
  const params = await searchParams;
  const tokenIdOrSlug = params.token ?? params.slug ?? DEFAULT_TOKEN_SLUG;
  return <EncuestaClient tokenIdOrSlug={tokenIdOrSlug} />;
}
