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
  const pathName = usePathname();

  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
    // eslint-disable-next-line react-hooks/rules-of-hooks
  }, []);

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <HomeIcon className="size-4" />,
    },
    {
      title: "Repository",
      href: "/dashboard/repository",
      icon: <Github className="size-4" />,
    },
    {
      title: "Reviews",
      href: "/dashboard/reviews",
      icon: <MessageCircle className="size-4" />,
    },
    {
      title: "Subscriptions",
      href: "/dashboard/subscriptions",
      icon: <CreditCardIcon className="size-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <SettingsIcon className="size-4" />,
    },
  ];

  const isActive = (href: string) => {
    return pathName === href || pathName.startsWith(href + "/");
  };

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    if (theme === "light") return <Sun className="size-4" />;
    if (theme === "dark") return <Moon className="size-4" />;
    return <Sun className="size-4" />;
  };

  if (!mounted || !session) return null;

  const user = session.user;
  const userName = user.name;
  const userEmail = user.email;
  const userInitial = userName
    ?.split(" ")
    .map((name: string) => name[0])
    .join("")
    .toUpperCase();
  const userImage = user.image;

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar/50 backdrop-blur supports-[backdrop-filter]:bg-sidebar/30">
        <div className="flex items-center gap-4 px-2 py-6">
          <div className="flex items-center justify-center size-12 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium shadow-sm">
            <GithubIcon className="size-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground">
              Code Hawk
            </p>
            <p className="text-xs text-sidebar-foreground/70">
              Code Review Assistant
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar/30">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                  >
                    <a href={item.href}>
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

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar/50 backdrop-blur supports-[backdrop-filter]:bg-sidebar/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg ring-2 ring-sidebar-border">
                    <AvatarImage src={userImage || undefined} alt={userName} />
                    <AvatarFallback className="rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-sidebar-foreground">
                      {userName}
                    </span>
                    <span className="truncate text-xs text-sidebar-foreground/70">
                      {userEmail}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-border bg-popover text-popover-foreground shadow-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem
                  onClick={cycleTheme}
                  className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  {getThemeIcon()}
                  <span>Toggle theme</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                  <User className="size-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                  <SettingsIcon className="size-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="hover:bg-destructive/10 hover:text-destructive cursor-pointer">
                  <Logout className="flex items-center gap-2 cursor-pointer w-full">
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
