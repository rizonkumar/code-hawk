import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4 mx-2" />
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
        </header>
        <main className="flex-1 overflow-auto bg-background">
          <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
