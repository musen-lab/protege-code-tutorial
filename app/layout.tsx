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
      default: "Protégé Code Tutorial | Inside Protégé",
      template: "%s | Protégé Code Tutorial",
    },
    description: "An interactive, source-backed course through Protégé Desktop architecture, runtime flows, Java idioms, and plugin development.",
    icons: {
      icon: [
        { url: "/favicon.ico?v=1", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
        { url: "/protege-icon.svg?v=1", type: "image/svg+xml" },
      ],
      shortcut: "/favicon.ico?v=1",
    },
    openGraph: {
      title: "Protégé Code Tutorial | Inside Protégé",
      description: "A source-guided course through Protégé Desktop architecture and runtime flows.",
      images: [{ url: imageUrl, width: 1730, height: 909, alt: "Protégé Code Tutorial cover" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Protégé Code Tutorial | Inside Protégé",
      description: "A source-guided course through Protégé Desktop architecture and runtime flows.",
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
