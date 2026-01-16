import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import { QuizProvider } from "@/context/QuizContext";
import { GoogleAnalytics } from "@next/third-parties/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: {
    default: "AI Pet Soulmate Finder",
    template: "%s | AI Pet Soulmate Finder",
  },
  description: "Stop guessing. Use psychology (Big 5) and AI to find the perfect dog or cat breed for your lifestyle. Free, scientific, and healing.",
  keywords: ["pet finder", "dog breed quiz", "cat personality test", "AI pet match", "soulmate pet"],
  openGraph: {
    title: "AI Pet Soulmate Finder",
    description: "Find your perfect pet companion based on personality and lifestyle.",
    siteName: "SoulmatePaw",
    locale: 'en_US',
    type: 'website',
  },
  verification: {
    google: 'bQYhmhmc7qXGSLkBOx2SQDNNht6ijkSGlHZbnE3TCcI',
  },
  metadataBase: new URL('https://soulmatepaw.com'),
  alternates: {
    canonical: './',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SoulmatePaw',
    url: 'https://soulmatepaw.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://soulmatepaw.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="en">
      <body className={`${inter.variable} ${nunito.variable} antialiased min-h-screen flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <QuizProvider>
          <Navbar />
          <div className="flex-grow w-full pt-20">
            {children}
          </div>
        </QuizProvider>
        <Footer />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}
