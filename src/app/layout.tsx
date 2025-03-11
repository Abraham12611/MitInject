import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PrivyProvider } from "@/components/auth/PrivyProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mitinject Terminal",
  description: "Injective-powered DeFi automation platform",
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
        <PrivyProvider>{children}</PrivyProvider>
      </body>
    </html>
  );
}
