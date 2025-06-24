// app/layout.tsx
import { type Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';


// Google Fonts Setup
const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

// Page Metadata
export const metadata: Metadata = {
  title: 'SoleVibe',
  description: 'A powerful modern web app using Clerk and Next.js',
};

// Layout Component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased m-0 p-0`}
        >
          

          {/* ✅ Main App Content */}
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
