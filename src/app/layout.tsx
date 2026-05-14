import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Strategy Nexus",
  description: "战略家专用的营销策划工作台 — 从供给侧扫描到战术落地的全链路工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="h-full overflow-hidden">
        {children}
      </body>
    </html>
  );
}
