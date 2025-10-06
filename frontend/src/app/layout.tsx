import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "../components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resnovate.ai - AI Consulting & Solutions Platform",
  description: "Transform your business with AI-driven solutions, machine learning implementation, and data analytics. Expert AI consulting services for enterprise digital transformation and intelligent automation.",
  keywords: "AI consulting, machine learning, data analytics, business intelligence, AI implementation, process automation, digital transformation, AI strategy, custom AI solutions",
  authors: [{ name: "Resnovate.ai" }],
  openGraph: {
    title: "Resnovate.ai - AI Consulting & Solutions Platform",
    description: "Transform your business with AI-driven solutions and intelligent automation consulting services.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resnovate.ai - AI Consulting & Solutions Platform",
    description: "Transform your business with AI-driven solutions and intelligent automation consulting services.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white min-h-screen`}
      >
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
