import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import FooterContent from "@/components/FooterContent";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Matrix Whisper Escape - Content Writing Competition",
  description:
    "Content Writing Competition organized by Matrix JEC - the skill enhancement community of Jabalpur Engineering College",
  icons: {
    icon: "/faviconn.png",
    apple: "/faviconn.png",
    shortcut: "/faviconn.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/faviconn.png" />
        <link rel="apple-touch-icon" href="/faviconn.png" />
        <link rel="shortcut icon" href="/faviconn.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <FooterContent />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
