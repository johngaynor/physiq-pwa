"use client";
import MobileNavbar from "./mobile";
import DesktopNavbar from "./desktop";
import { useWindowDimensions } from "@/app/customHooks/useWindowDimensions";

export default function NavbarWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useWindowDimensions("(max-width: 768px)");

  if (isMobile === undefined) return null;

  return (
    <>
      {!isMobile && <DesktopNavbar />}
      <div className={isMobile ? "mb-20" : ""}>{children}</div>
      {isMobile && <MobileNavbar />}
    </>
  );
}
