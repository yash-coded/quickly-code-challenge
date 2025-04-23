import { getUserProfile } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUserProfile();

  if (user) {
    redirect("/profile");
  } else {
    redirect("/login");
  }
}
