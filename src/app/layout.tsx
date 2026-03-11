import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SubSentry – Smart Subscription Manager",
  description: "Track subscriptions, analyze spending, and never miss a renewal.",
  icons: {
    icon: "/currency-rupee-svgrepo-com.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050a18] text-slate-200 flex flex-col min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/5 py-8 text-center">
            <p className="text-sm text-slate-600">
              &copy; {new Date().getFullYear()} SubSentry. Track Every Subscription. Control Every Rupee.
            </p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
