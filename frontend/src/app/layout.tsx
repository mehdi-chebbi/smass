import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/i18n/context";

// Using local font fallback (Google Fonts unavailable in build environment)
const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };

export const metadata: Metadata = {
  title: "SMAS Project - Senegal-Mauritanian Aquifer System",
  description: "Strengthening the Sustainable Management of the Senegal-Mauritanian Aquifer System. Promoting sustainable and cooperative management of transboundary groundwater resources in West Africa.",
  keywords: "SMAS, aquifer, groundwater, West Africa, Senegal, Mauritania, water management, transboundary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Open+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
