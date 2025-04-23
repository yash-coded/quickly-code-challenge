import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quickly Code Challenge",
  description: "A Next.js application for the Quickly code challenge",
  icons: {
    icon: [{ url: "/quickly-logo-pink.svg", type: "image/svg+xml" }],
    shortcut: "/quickly-logo-pink.svg",
    apple: "/quickly-logo-pink.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
