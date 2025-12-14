import { AppSidebar } from "@/components/app-sidebar";
import { requireAuth } from "@/module/auth/utils/auth-utils";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireAuth();

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex min-h-screen flex-col bg-muted/30">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-7xl p-4 md:p-6">
            <div className="rounded-xl bg-background p-4 shadow-sm md:p-6">
              {children}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
