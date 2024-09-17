import type { Metadata } from 'next';
import './globals.css';
import SideNavbar from '@/components/SideNavbar';
export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className="bg-primary flex w-full">
        <div className="w-1/7">
          <SideNavbar />
        </div>
        <div className="w-6/7">{children}</div>
      </body>
    </html>
  );
}
