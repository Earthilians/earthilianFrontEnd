import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Earthilians — Private, Fast, User-First Search Engine",
  description:
    "Earthilians is a next-generation search engine built by the users, for the users. Fast, private, and ad-free — helping you discover the best pages on the web without distractions.",
  keywords: [
    "search engine",
    "private search",
    "fast search",
    "Earthilians",
    "web search",
    "AI search",
    "ad-free search",
    "open web",
    "user-first search",
  ],
  authors: [{ name: "Earthilians Team", url: "https://earthilians.com" }],
  creator: "Earthilians",
  publisher: "Earthilians",
  openGraph: {
    title: "Earthilians — Private, Fast, User-First Search Engine",
    description:
      "Discover Earthilians: a next-generation, privacy-first search engine built for speed and transparency.",
    url: "https://earthilians.com",
    siteName: "Earthilians",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Earthilians — Private, Fast, User-First Search Engine",
    description:
      "A privacy-first, fast, and user-driven search engine. Discover the best of the web with Earthilians.",
    creator: "@earthilians",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  metadataBase: new URL("https://earthilians.com"),
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
        {children}
      </body>
    </html>
  );
}
