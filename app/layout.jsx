import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";

export const metadata = {
  title: "DevDestroyed | Roast your GitHub Profile",
  description: "Turn your GitHub profile into comedy material. Savage AI-powered roasts based on your code.",
  openGraph: {
    title: "DevDestroyed | Roast your GitHub Profile",
    description: "Turn your GitHub profile into comedy material. Savage AI-powered roasts based on your code.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SmoothScroll />
        <PageTransition>
          {children}
        </PageTransition>
        <Analytics />
      </body>
    </html>
  );
}
