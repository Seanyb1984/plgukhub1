import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PLG UK Hub",
  description: "Digital forms platform for PLG UK brands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
