"use client";

import React, { useState, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import PageTemplate from "../components/Templates/PageTemplate";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const settingsNavItems = [
    {
      title: "Dashboard Settings",
      href: "/settings",
    },
    {
      title: "Profile",
      href: "/settings/profile",
    },
    {
      title: "Notifications",
      href: "/settings/notifications",
    },
    {
      title: "Billing",
      href: "/settings/billing",
    },
    {
      title: "Support",
      href: "/settings/support",
    },
  ];

  const filteredNavItems = settingsNavItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageTemplate title="Settings" showTitleMobile>
      <div className="lg:flex w-full">
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <div className="h-full flex flex-col p-6">
            {/* Settings Navigation */}
            {pathname.startsWith("/settings") && (
              <div>
                {/* Search Input */}
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Search settings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <nav className="space-y-1">
                  {filteredNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                          isActive
                            ? "font-bold text-gray-900 dark:text-gray-100"
                            : "font-normal text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        }`}
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 min-w-0 p-6">{children}</div>
      </div>
    </PageTemplate>
  );
}
