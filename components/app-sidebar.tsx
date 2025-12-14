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
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !session) return null;

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <HomeIcon className="h-4 w-4" />,
    },
    {
      title: "Repository",
      href: "/dashboard/repository",
      icon: <Github className="h-4 w-4" />,
    },
    {
      title: "Reviews",
      href: "/dashboard/reviews",
      icon: <MessageCircle className="h-4 w-4" />,
    },
    {
      title: "Subscriptions",
      href: "/dashboard/subscriptions",
      icon: <CreditCardIcon className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <SettingsIcon className="h-4 w-4" />,
    },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const cycleTheme = () => {
    setTheme(
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
    );
  };

  const themeIcon =
    theme === "dark" ? (
      <Moon className="h-4 w-4" />
    ) : (
      <Sun className="h-4 w-4" />
    );

  const user = session.user;
  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() ?? "";

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
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
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    className="h-9 rounded-md px-3
                  text-sm font-medium
                  transition-colors
                  hover:bg-sidebar-accent
                  hover:text-sidebar-foreground 
                  data-[active=true]:bg-sidebar-accent
                  data-[active=true]:text-white"
                  >
                    <a
                      href={item.href}
                      className="relative flex items-center gap-3"
                    >
                      {isActive(item.href) && (
                        <span className="absolute left-[-12px] h-4 w-1 rounded-r bg-primary" />
                      )}
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="
                    rounded-lg
                    hover:bg-sidebar-accent
                    data-[state=open]:bg-sidebar-accent
                  "
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

              <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={6}
                className="w-56 rounded-lg"
              >
                <DropdownMenuItem onClick={cycleTheme}>
                  {themeIcon}
                  <span className="ml-2">Toggle theme</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <User className="h-4 w-4" />
                  <span className="ml-2">Account</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <SettingsIcon className="h-4 w-4" />
                  <span className="ml-2">Settings</span>
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
