"use client";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useTheme } from "next-themes";
import { House, Dumbbell, Database, HeartPlus, Sun, Moon } from "lucide-react";

const NavItems = [
  {
    href: "/",
    icon: <House size={36} />,
  },
  {
    href: "/",
    icon: <Dumbbell size={36} />,
  },
  {
    href: "/",
    icon: <Database size={36} />,
  },
  {
    href: "/",
    icon: <HeartPlus size={36} />,
  },
];

const MobileNavbar = ({}) => {
  const { theme, setTheme } = useTheme();

  return (
    <NavigationMenu className="fixed bottom-20 right-0 left-0">
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
              size={36}
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
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MobileNavbar;
