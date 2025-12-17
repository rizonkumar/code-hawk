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
  useSidebar,
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
  const { state } = useSidebar();

  const isCollapsed = state === "collapsed";

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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* ================= Header ================= */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <GithubIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Code Hawk</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Code Review Assistant
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ================= Navigation ================= */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ title, href, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={title}
                    >
                      <a href={href}>
                        <Icon className={active ? "text-primary" : ""} />
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

      {/* ================= Footer ================= */}
      <SidebarFooter>
        {/* Theme toggle */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              tooltip="Toggle theme"
            >
              {theme === "dark" ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4" />
              )}
              <span>Dark mode</span>
              <Switch
                checked={theme === "dark"}
                className="ml-auto"
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* User menu */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" tooltip={user.name || "User menu"}>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback className="rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                side="right"
                sideOffset={4}
                className="w-56"
              >
                <DropdownMenuItem>
                  <User className="size-4" />
                  <span>Account</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Logout className="flex w-full items-center gap-2">
                    <LogOut className="size-4" />
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
