import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "KAYA — Learning Management System",
  description: "Платформа з вивчення історії України",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${cormorant.variable} ${manrope.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}