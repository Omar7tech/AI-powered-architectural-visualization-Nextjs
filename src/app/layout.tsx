import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
import { ProjectsProvider } from "@/components/ProjectsContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roomify",
  description: "Roomify - AI Powered Interior Design",
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
        <ProjectsProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen bg-background text-foreground relative z-10">
              {children}
            </main>
          </AuthProvider>
        </ProjectsProvider>
      </body>
    </html>
  );
}
