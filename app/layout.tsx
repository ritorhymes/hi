import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "hi",
  description: "A tiny password-gated secret.",
  themeColor: "#050505",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
