"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useTheme } from "next-themes";
import { Button, H4 } from "@/components/ui";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Sun, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function TabComponent(value: string, isActive: boolean, onClick: () => void) {
  return (
    <TabsTrigger
      value={value}
      onClick={onClick}
      data-state={isActive ? "active" : "inactive"}
      className="cursor-pointer"
    >
      {value}
    </TabsTrigger>
  );
}

export default function DesktopNavAuth() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/").filter(Boolean);
  const path = segments[0]
    ? segments[0] === "checkins"
      ? "Check Ins"
      : segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
    : "Dashboard";

  function navigateToTab(tabName: string) {
    const route = tabName.toLowerCase().replace(" ", "");
    router.push(`/${route === "dashboard" ? "" : route}`);
  }

  return (
    <div className="fixed right-0 left-0">
      <NavigationMenu className="px-5 right-0 left-0 dark:bg-[#060B1C]">
        <NavigationMenuList>
          <div className=" flex items-center">
            <NavigationMenuItem>
              <Link href="/">
                <H4 className="pr-10 pb-2">PhysiQ</H4>
              </Link>
            </NavigationMenuItem>
          </div>
          <div className=" flex items-center">
            <NavigationMenuItem className="mr-5">
              <Button
                variant="outline"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? <Moon size={36} /> : <Sun size={36} />}
              </Button>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <SignedOut>
                <SignInButton mode="redirect">
                  <Button variant="default">Sign In</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox:
                        "border border-gray-300 rounded-full",
                    },
                  }}
                />
              </SignedIn>
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
      <Tabs
        defaultValue="overview"
        className="w-full pt-16 px-5 dark:bg-[#060B1C]"
        value={path}
      >
        <TabsList className="flex bg-transparent p-0">
          {TabComponent("Dashboard", path === "Dashboard", () =>
            navigateToTab("Dashboard")
          )}
          {TabComponent("Health", path === "Health", () =>
            navigateToTab("Health")
          )}
          {TabComponent("Diet", path === "Diet", () => navigateToTab("Diet"))}
          {TabComponent("Training", path === "Training", () =>
            navigateToTab("Training")
          )}
          {TabComponent("Check Ins", path === "Check Ins", () =>
            navigateToTab("Check Ins")
          )}
          {TabComponent("AI", path === "AI", () => navigateToTab("AI"))}
          {TabComponent("Apps", path === "Apps", () => navigateToTab("Apps"))}
        </TabsList>
      </Tabs>
    </div>
  );
}
