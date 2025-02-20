import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "What MMR?",
  description:
    "Anxious if your friends play better then you? Check out their mmr and wonder no more!",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased text-gray-700`}>
        {children}
      </body>
    </html>
  );
}
