import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/app/admin/login/login-form";
import { getAdminSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return <main className="grid min-h-screen place-items-center bg-hotel-cream p-4"><AdminLoginForm /></main>;
}
