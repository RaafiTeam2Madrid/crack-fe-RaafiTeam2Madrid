import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Menggunakan font Inter sebagai standar tipografi Next.js
const inter = Inter({ subsets: ["latin"] });

// Metadata aplikasi untuk SEO dan judul tab browser
export const metadata: Metadata = {
  title: "EDRMS Vokasi UI Edition",
  description: "Electronic Document and Records Management System - Program Pendidikan Vokasi Universitas Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Menambahkan class "scroll-smooth" di tag html agar navigasi anchor (#) meluncur mulus
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} bg-[#111111] text-slate-200 antialiased`}>
        {children}
      </body>
    </html>
  );
}