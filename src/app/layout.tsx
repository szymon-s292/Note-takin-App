import type { Metadata } from "next";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body
          className={`antialiased`}
        >
          {children}
        </body>
      </html>
    </SessionWrapper>
  );
}
