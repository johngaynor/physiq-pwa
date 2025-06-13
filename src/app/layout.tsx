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
  description: "Bodybuilding Redefined.",
  icons: {
    icon: "/192.png",
    shortcut: "/192.png",
    apple: "/192.png",
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
            <SessionInitializer />
            <PullToRefresh />
            <ReduxProvider>
              <Toaster richColors theme="system" />
              <div className="relative max-w-6xl mx-auto px-5">
                <NavbarWrapper>{children}</NavbarWrapper>
              </div>
            </ReduxProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
