import type { Metadata } from "next";
import { Inter, Hind_Siliguri, Phudu } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import CartSheet from "@/components/cart/CartSheet";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "bengali"],
  variable: "--font-hind",
});

const phudu = Phudu({
  subsets: ["latin"],
  variable: "--font-phudu",
});

export const metadata: Metadata = {
  title: "Diceymio - Board Game Universe",
  description: "Buy your favorite board games online",
  keywords: ["Board Games"],
  authors: [{ name: "Diceymio" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "https://diceymio.com",
    title: "Diceymio",
    description: "Buy your favorite board games online",
    siteName: "Diceymio",
    images: [
      {
        url: "",
        alt: "Diceymio - Board Game Universe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diceymio - Board Game Universe",
    description: "Buy your favorite board games online",
    images: [],
  },
  // robots: {
  //   index: true,
  //   follow: true,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //   },
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${hindSiliguri.variable} ${phudu.variable}`}
    >
      <head />
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
          <Header />
          {children}
          <Footer />
          </AuthProvider>
          <Toaster />
          <CartSheet />
        </ThemeProvider>
      </body>
    </html>
  );
}
