import { requireAuth } from "@/module/auth/utils/auth-utils";
import { redirect } from "next/navigation";

// TODO: This is a temporary redirect to the dashboard we can create landing page later.
export default async function Home() {
  await requireAuth();
  return redirect("/dashboard");
}
