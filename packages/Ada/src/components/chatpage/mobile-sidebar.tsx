'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SidebarContent } from './sidebar-content'; // Extract sidebar inner content for reuse
import { Menu } from 'lucide-react';

export function MobileSidebar({ jobID, chatID }: { jobID: string; chatID: string }) {
  return (
    <div className="md:hidden p-4 flex justify-start">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <Menu className="mr-2 h-4 w-4" /> Chats
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <SheetHeader className="p-4">
            <SheetTitle>Chats</SheetTitle>
          </SheetHeader>
          <SidebarContent jobID={jobID} chatID={chatID} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
