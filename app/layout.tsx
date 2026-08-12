import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-display",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: {
      default: "Inside Protégé | A source-guided field course",
      template: "%s | Inside Protégé",
    },
    description: "An interactive, source-backed course through Protégé Desktop architecture, runtime flows, Java idioms, and plugin development.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Inside Protégé",
      description: "A source-guided field course through Protégé Desktop architecture and runtime flows.",
      images: [{ url: imageUrl, width: 1730, height: 909, alt: "Inside Protégé course cover" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Inside Protégé",
      description: "A source-guided field course through Protégé Desktop architecture and runtime flows.",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${lora.variable}`}>
        {children}
      </body>
    </html>
  );
}
