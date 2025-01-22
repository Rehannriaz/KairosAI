'use client';
import Header from '@/components/global/Header';
import SideNavbar from '@/components/global/SideNavbar';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';

const NavbarLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useSidebar();

  return (
    <div className="flex flex-col flex-1">
      <Header />
      <div className="flex flex-row">
        <div
          className={`transition-all duration-300 ${isOpen ? 'w-1/7' : 'w-0'}`}
        >
          <SideNavbar />
        </div>
        <div
          className={`transition-all duration-300 ${
            isOpen ? 'w-6/7' : 'w-full'
          }`}
        >
          <div className="p-12">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default function NavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="bg-main flex w-full ">
      <SidebarProvider>
        <NavbarLayoutContent>{children}</NavbarLayoutContent>
      </SidebarProvider>
    </span>
  );
}
