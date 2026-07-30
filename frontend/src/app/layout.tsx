import type { Metadata } from "next";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "linkdev — Construí tu marca personal con IA",
  description:
    "Plataforma SaaS con IA para ayudar a desarrolladores y profesionales tech a crear contenido de calidad de forma constante.",
  keywords: ["IA", "contenido", "desarrolladores", "marca personal"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning className="h-full">
      <body className="min-h-full font-sans antialiased">
        <ThemeProvider>
          <QueryProvider>
            {children}
            <ToastProvider />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
