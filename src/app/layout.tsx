import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./store";
import NavbarWrapper from "./components/Navbar";
import { ThemeProvider } from "./components/Theme";
import SessionInitializer from "./components/SessionInitializer";
import PullToRefresh from "./components/PullToRefresh";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PhysiQ",
  description: "Intelligent Bodybuilding.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: [{ url: "/icons/icon-filled-dark-180x180.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <PullToRefresh />
            <ReduxProvider>
              <SessionInitializer />
              <Toaster richColors theme="system" />
              <div className="relative mx-auto">
                <NavbarWrapper>
                  {children}
                  <SpeedInsights />
                </NavbarWrapper>
              </div>
            </ReduxProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
