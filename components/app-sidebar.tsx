"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import {
  CreditCardIcon,
  Github,
  GithubIcon,
  HomeIcon,
  LogOut,
  MessageCircle,
  Moon,
  SettingsIcon,
  Sun,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logout from "@/module/auth/components/logout";

export const AppSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  if (!session) return null;

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { title: "Repository", href: "/dashboard/repository", icon: Github },
    { title: "Reviews", href: "/dashboard/reviews", icon: MessageCircle },
    {
      title: "Subscriptions",
      href: "/dashboard/subscriptions",
      icon: CreditCardIcon,
    },
    { title: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const user = session.user;
  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() ?? "";

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GithubIcon className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Code Hawk</p>
            <p className="text-xs text-muted-foreground">
              Code Review Assistant
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map(({ title, href, icon: Icon }) => {
                const active = isActive(href);

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="
                        relative h-9 rounded-md px-3
                        text-sm font-medium
                        transition-colors
                        hover:bg-sidebar-accent
                        data-[active=true]:bg-sidebar-accent
                      "
                    >
                      <a href={href} className="flex items-center gap-3">
                        {active && (
                          <span className="absolute left-[-10px] h-4 w-1 rounded-r bg-primary" />
                        )}
                        <Icon
                          className={`h-4 w-4 ${
                            active ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <span>{title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-3 space-y-2">
        <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-sidebar-accent">
          <div className="flex items-center gap-2 text-sm">
            {theme === "dark" ? (
              <Moon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Sun className="h-4 w-4 text-muted-foreground" />
            )}
            <span>Dark mode</span>
          </div>

          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="rounded-lg hover:bg-sidebar-accent"
                >
                  <Avatar className="h-8 w-8 rounded-md">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>

                  <div className="ml-2 flex flex-col text-left text-sm leading-tight">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={6} className="w-56">
                <DropdownMenuItem>
                  <User className="h-4 w-4" />
                  <span className="ml-2">Account</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Logout className="flex w-full items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </Logout>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
