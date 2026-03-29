import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "History Walks",
  description: "Explore historical sites through Gaussian splat reconstructions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="m-0 p-0 overflow-hidden antialiased">{children}</body>
    </html>
  );
}
