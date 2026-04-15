import type { Metadata } from "next";
import { Pacifico, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
});

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['vietnamese', 'latin'],
  display: 'swap',
  variable: '--font-be-vietnam',
});

export const metadata: Metadata = {
  title: "Thư Viện Số - Mang tri thức số ươm mầm tương lai",
  description: "Thư viện số hiện đại với kho tài nguyên học tập phong phú dành cho học sinh, giáo viên và phụ huynh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true} className={`${beVietnamPro.variable} ${pacifico.variable} font-['Be_Vietnam_Pro',sans-serif] antialiased`}>
        {children}
      </body>
    </html>
  );
}
