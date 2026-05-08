import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";


export const metadata: Metadata = {
  title: "MediStore — Your Trusted Online Medicine Shop",
  description:
    "Browse and purchase over-the-counter medicines with fast delivery and 100% authenticity guaranteed.",
  keywords: ["medicine", "pharmacy", "OTC", "health", "online pharmacy"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans">
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              expand={false}
              duration={3000}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}