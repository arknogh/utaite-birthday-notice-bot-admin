'use client';

import { usePathname } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import Head from 'next/head';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  return (
    <>
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>Utaite Birthday Notifier Bot - Admin Page | Utaite Wiki Project</title>
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {!isAuthPage && <Navbar />}
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
    </>
  );
}