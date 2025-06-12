import { auth } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export default async function SecureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    return <SignIn />;
  }

  return <>{children}</>;
}
