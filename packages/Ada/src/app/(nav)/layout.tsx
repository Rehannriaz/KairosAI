import Header from '@/components/global/Header';
import SideNavbar from '@/components/global/SideNavbar';
import { SidebarProvider } from '@/contexts/SidebarContext';

export default function NavbarLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <body className="bg-primary flex w-full">
      <SidebarProvider>
        <div className="flex flex-col flex-1">
          <div>
            <Header />
          </div>
          <div className="flex flex-row">
            <div className="w-1/7">
              <SideNavbar />
            </div>
            <div className="w-6/7">{children}</div>
          </div>
        </div>
      </SidebarProvider>
    </body>
  );
}
