import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediStore",
  description: "Securely manage pharmacy stock, track medicine fulfillment, and monitor real-time sales with MediStore's professional inventory ledger system.",
  keywords: ["Pharmacy Management", "Medicine Inventory", "Order Ledger", "Next.js Pharma App", "MediStore"],
  // OpenGraph helps when sharing the link on LinkedIn/Discord
  openGraph: {
    title: "MediStore | Pharmacy Inventory Ledger",
    description: "Professional-grade medicine stock and order fulfillment tracking.",
    type: "website",
  },
  // Use your new icon here
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans" suppressHydrationWarning>
        {/* Google Identity Services script */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster position="top-right" richColors expand={false} duration={3000} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}