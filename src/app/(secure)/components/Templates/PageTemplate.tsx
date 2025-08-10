"use client";
import React from "react";
import { H1 } from "@/components/ui";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/reducer";

type PageTemplateProps = {
  title: string;
  children: React.ReactNode;
};

type RouteConfig = {
  pattern: string;
  appId: number | null;
  exactMatch?: boolean;
};

const routeConfigs: RouteConfig[] = [
  { pattern: "/dashboard", appId: null, exactMatch: false },
  { pattern: "/admin", appId: 1, exactMatch: true },
  { pattern: "/diet", appId: 21, exactMatch: false },
  { pattern: "/diet/new", appId: 31, exactMatch: true },
  { pattern: "/health", appId: 23, exactMatch: false },
  { pattern: "/health/logs/weight", appId: 15, exactMatch: true },
  { pattern: "/health/logs/steps", appId: 14, exactMatch: true },
  { pattern: "/health/logs/sleep", appId: 16, exactMatch: true },
  { pattern: "/health/logs/water", appId: 17, exactMatch: true },
  { pattern: "/health/logs/bodyfat", appId: 19, exactMatch: true },
  { pattern: "/health/logs/calories", appId: 18, exactMatch: true },
  { pattern: "/checkins", appId: 28, exactMatch: false },
  { pattern: "/checkins/new", appId: 36, exactMatch: true },
  { pattern: "/ai/physique/poses", appId: 34, exactMatch: true },
  { pattern: "/ai/physique/poses/train", appId: 37, exactMatch: true },
];

function matchRoute(
  pathname: string,
  routeConfigs: RouteConfig[]
): number | null | undefined {
  // First try exact matches
  const exactMatch = routeConfigs.find(
    (config) => config.exactMatch && config.pattern === pathname
  );
  if (exactMatch) return exactMatch.appId;

  // Then try prefix matches (for dynamic routes)
  const prefixMatch = routeConfigs
    .filter((config) => !config.exactMatch)
    .find((config) => pathname.startsWith(config.pattern));

  return prefixMatch?.appId;
}

export default function PageTemplate({ children, title }: PageTemplateProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const user = useSelector((state: RootState) => state.app.user);
  const apps = user?.apps;

  const requiredAppId = matchRoute(pathname, routeConfigs);

  const authed =
    requiredAppId === null || // null means no auth required
    requiredAppId === undefined || // undefined means route not found (allow by default)
    !!apps?.find((app: any) => app.id === requiredAppId);

  return (
    <div>
      <div className="border-b py-4 mb-6">
        <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto px-5">
          <H1 className="py-4 align-left md:w-auto w-full">{title}</H1>
          <Breadcrumb className="pt-4 pl-3 md:block hidden">
            <BreadcrumbList>
              {segments.map((segment, idx) => {
                const href =
                  segment === "Dashboard"
                    ? "/"
                    : "/" + segments.slice(0, idx + 1).join("/");
                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={href} className="capitalize">
                          {segment}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 max-w-6xl mx-auto px-5">
        {!apps
          ? "loading..."
          : !authed
          ? "You do not have access to this page."
          : children}
      </div>
    </div>
  );
}
