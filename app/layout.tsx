import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-providers";
import { QueryProviders } from "@/components/providers/query-providers";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Code Hawk",
    template: "%s · Code Hawk",
  },
  description:
    "Code Hawk is an AI-powered code review assistant that helps teams review pull requests faster, catch issues earlier, and maintain high code quality.",
  applicationName: "Code Hawk",
  keywords: [
    "Code Review",
    "AI Code Review",
    "Pull Request Review",
    "GitHub Automation",
    "Developer Tools",
    "Code Quality",
  ],
  authors: [{ name: "Code Hawk Team" }],
  creator: "Code Hawk",
  // metadataBase: new URL("https://codehawk.dev"),
  openGraph: {
    title: "Code Hawk · AI Code Review Assistant",
    description:
      "Automate code reviews, catch bugs early, and ship better code with Code Hawk.",
    siteName: "Code Hawk",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Hawk · AI Code Review Assistant",
    description:
      "Automate code reviews, catch bugs early, and ship better code with Code Hawk.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <QueryProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
