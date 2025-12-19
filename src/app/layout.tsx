import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google"; 
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Pet Matchmaking",
  description: "Find your perfect pet companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${nunito.variable} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
