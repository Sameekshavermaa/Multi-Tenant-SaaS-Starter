import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi-Tenant SaaS Starter",
  description: "Production-grade starter with Next.js, Supabase, and Stripe"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
