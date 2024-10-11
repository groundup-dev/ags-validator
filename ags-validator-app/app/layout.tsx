import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

import "./globals.css";
import React from "react";
import Navbar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "AGS4 Validator",
  description: "AGS4 Validator by GroundUp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-background text-foreground`}
      >
        <Navbar />
        <main>{children}</main>
        <Analytics />
        <div id="portal" className="fixed top-0 left-0 " />
      </body>
    </html>
  );
}
