import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 px-16 bg-white dark:bg-black">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Hola mundo soy Max
        </h1>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/encuesta"
            className="rounded-full bg-black px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Encuesta IA
          </Link>
          <Link
            href="/encuesta-tenis"
            className="rounded-full border border-black px-6 py-3 text-center text-sm font-medium text-black transition-colors hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
          >
            Encuesta Tenis
          </Link>
        </div>
      </main>
    </div>
  );
}
