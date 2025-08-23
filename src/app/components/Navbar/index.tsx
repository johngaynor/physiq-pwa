"use client";
import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";
import { useWindowDimensions } from "@/app/customHooks/useWindowDimensions";
import DesktopNavAuth from "./DesktopNavAuth";
import { useUser } from "@clerk/nextjs";

export default function NavbarWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useWindowDimensions("(max-width: 768px)");
  const { user } = useUser();

  if (isMobile === undefined) return null;

  return (
    <>
      {!isMobile && user && <DesktopNavAuth />}
      {!isMobile && !user && <DesktopNav />}
      <div
        className={`${!isMobile && user ? "pt-25" : ""} ${
          isMobile && user ? "pb-30" : ""
        }`}
      >
        {children}
      </div>
      {isMobile && <MobileNav />}
    </>
  );
}
