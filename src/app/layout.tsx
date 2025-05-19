import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "@/components/HeaderWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatSphere | Modern Live Chat Platform",
  description: "Connect in real-time with ChatSphere - a modern, secure, and feature-rich live chatroom platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {/* Conditionally render Header for non-dashboard pages */}
          <HeaderWrapper />
          <main className="min-h-screen">
            {children}
          </main>
          {/* Conditionally render Footer for non-dashboard pages */}
          <FooterWrapper />
        </Providers>
      </body>
    </html>
  );
}
