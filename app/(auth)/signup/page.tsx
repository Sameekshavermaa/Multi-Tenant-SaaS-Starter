import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

async function signUp(formData: FormData) {
  "use server";

  const supabase = await createServerClient();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) redirect("/signup?error=1");

  redirect("/dashboard");
}

export default function SignupPage() {
  return (
    <form action={signUp} className="w-full space-y-4 rounded-xl border border-border p-6">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <input className="w-full rounded-md border border-border bg-transparent px-3 py-2" name="email" type="email" placeholder="you@company.com" required />
      <input className="w-full rounded-md border border-border bg-transparent px-3 py-2" name="password" type="password" minLength={8} placeholder="min 8 characters" required />
      <Button type="submit" className="w-full">Create account</Button>
    </form>
  );
}
