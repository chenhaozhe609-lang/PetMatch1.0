import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google"; 
import "./globals.css";
import { QuizProvider } from "@/context/QuizContext";
import { GoogleAnalytics } from "@next/third-parties/google";
import Footer from "@/components/Footer";

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
    siteName: "PetMatch",
    locale: 'en_US',
    type: 'website',
  },
  verification: {
    google: 'bQYhmhmc7qXGSLkBOx2SQDNNht6ijkSGlHZbnE3TCcI',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${nunito.variable} antialiased min-h-screen flex flex-col`}>
        <QuizProvider>
          <div className="flex-grow w-full">
            {children}
          </div>
        </QuizProvider>
        <Footer />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}
