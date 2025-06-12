"use client";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  ListItem,
} from "@/components/ui/navigation-menu";
import {
  TrainingItems,
  LibraryItems,
  HealthItems,
  ReportItems,
} from "./ListItems";
import { useTheme } from "next-themes";
import { Button, H4 } from "@/components/ui";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Sun, Moon } from "lucide-react";
import Link from "next/link";

const DesktopNavbar = ({}) => {
  const { theme, setTheme } = useTheme();

  return (
    <NavigationMenu className="right-5 left-5">
      <NavigationMenuList>
        <div className=" flex items-center">
          <NavigationMenuItem>
            <Link href="/">
              <H4 className="pr-10 pb-2">PhysiQ</H4>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Training</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {TrainingItems.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Library</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {LibraryItems.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Health</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {HealthItems.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Reports</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {ReportItems.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
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
                    userButtonAvatarBox: "border border-gray-300 rounded-full",
                  },
                }}
              />
            </SignedIn>
          </NavigationMenuItem>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavbar;
