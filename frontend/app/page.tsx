import { UrlForm } from "@/components/UrlForm";

export default function Home() {
  return (
    <div className="min-h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Sokrat.im</h1>
        </header>

        <main className="flex flex-col gap-8">
          <UrlForm />
        </main>

        <footer className="text-center text-gray-500 text-sm">
          © 2025 Sokrat.im
        </footer>
      </div>
    </div>
  );
}
