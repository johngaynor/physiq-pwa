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
      <div className="mb-20 md:mb-0 mt-0 md:pt-10">{children}</div>
      {isMobile && <MobileNavbar />}
    </>
  );
}
