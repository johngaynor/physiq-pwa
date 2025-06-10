"use client";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useTheme } from "next-themes";
import { House, Dumbbell, Database, Sun, Moon, CircleUser } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const NavItems = [
  {
    href: "/",
    icon: <House size={24} />,
  },
  {
    href: "/",
    icon: <Dumbbell size={24} />,
  },
  {
    href: "/",
    icon: <Database size={24} />,
  },
];

const MobileNavbar = ({}) => {
  const { theme, setTheme } = useTheme();

  return (
    <NavigationMenu className="fixed bottom-0 pb-5 right-0 left-0 border-t border-gray-100 bg-background">
      <NavigationMenuList>
        {NavItems.map((item, index) => (
          <NavigationMenuItem
            key={"mobile-nav-item-" + index}
            className="w-full"
          >
            <a
              href={item.href}
              className="flex items-center justify-center h-16"
            >
              {item.icon}
            </a>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem className="w-full">
          {theme === "dark" ? (
            <Sun
              size={24}
              onClick={() => setTheme("light")}
              className="flex items-center justify-center mx-auto"
            />
          ) : (
            <Moon
              size={36}
              onClick={() => setTheme("dark")}
              className="flex items-center justify-center mx-auto"
            />
          )}
        </NavigationMenuItem>

        <NavigationMenuItem className="w-full">
          <SignedOut>
            <SignInButton mode="redirect">
              <CircleUser size={24} className="mx-auto" />
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex justify-center items-center h-16">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "border border-gray-300 rounded-full",
                  },
                }}
              />
            </div>
          </SignedIn>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MobileNavbar;
