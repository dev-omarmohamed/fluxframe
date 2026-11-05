import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "FluxFrame — هويات بصرية ذكية وطباعة 3D",
  description:
    "هويات بصرية متكاملة تبدأ من أيقونة واحدة. وطباعة ثلاثية الأبعاد بأسعار شفافة وتوصيل موحد 150 ج.م.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-ink text-cloud antialiased flex flex-col selection:bg-lime selection:text-ink font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 rounded-full bg-lime px-4 py-2 text-ink font-medium shadow-lg"
        >
          تخطي إلى المحتوى الرئيسي
        </a>
        <LanguageProvider>
          <AuthProvider>
            <Nav />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
