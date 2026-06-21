import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AgentationProvider from "@/components/agentation-provider";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ConfirmProvider } from "@/components/design-system/confirm-dialog";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neo",
  description: "LLM observability — traces, issues, and dashboards.",
  appleWebApp: {
    title: "MyWebSite",
  },
};

export const viewport: import("next").Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(1 0 0)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.145 0 0)" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", inter.variable, geistMono.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider>
            <ConfirmProvider>
              <div vaul-drawer-wrapper="">
                {children}
                <Toaster />
              </div>
            </ConfirmProvider>
          </TooltipProvider>
        </ThemeProvider>
        <AgentationProvider />
      </body>
    </html>
  );
}
