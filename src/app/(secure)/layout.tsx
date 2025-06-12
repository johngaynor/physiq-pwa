import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SecureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect(`/sign-in?redirectUrl=${encodeURIComponent("/secure/dashboard")}`);
  }

  return <>{children}</>;
}
