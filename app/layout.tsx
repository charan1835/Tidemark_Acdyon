import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tidemark | Stop Squinting at Your Metrics",
  description: "The metrics tool for small teams that auto-detects inflection points and pins permanent annotations to your charts. Connect Stripe, Postgres, or CSV.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-background text-foreground overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
