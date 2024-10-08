import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigator from "./Navigator";
import MouseTracker from "./MouseTracker";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body
        className={inter.className}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <Navigator />
        <MouseTracker />
        {children}
      </body>
    </html>
  );
}
