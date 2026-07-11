import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import { manrope } from "@/utils/fonts";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "WorkNest — Collaborate better, deliver faster",
    template: "%s · WorkNest",
  },
  description:
    "The all-in-one workspace for modern teams to manage projects, chat in real-time, and share files without the clutter.",
  applicationName: "WorkNest",
  keywords: [
    "WorkNest",
    "project management",
    "team collaboration",
    "real-time chat",
    "task management",
    "file sharing",
    "workspace",
    "kanban",
    "productivity",
  ],
  authors: [{ name: "WorkNest" }],
  creator: "WorkNest",
  publisher: "WorkNest",
  openGraph: {
    title: "WorkNest — Collaborate better, deliver faster",
    description:
      "The all-in-one workspace for modern teams to manage projects, chat in real-time, and share files without the clutter.",
    siteName: "WorkNest",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WorkNest — Collaborate better, deliver faster",
    description:
      "The all-in-one workspace for modern teams to manage projects, chat in real-time, and share files without the clutter.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ colorScheme: "light dark" }}>
      <body
        className={`${manrope.className} antialiased`}
        cz-shortcut-listen="true"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
