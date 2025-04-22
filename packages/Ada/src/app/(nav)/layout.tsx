import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';
import '../globals.css';
import { Sidebar } from '@/components/global/SideNavbar';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KairosAI - Dashboard',
  description: 'AI-powered job search platform',
};

export default function NavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen bg-background star-bg">
            <Sidebar className="hidden md:block w-64 shrink-0" />
            <div className="flex-1">
              <Header />

              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
