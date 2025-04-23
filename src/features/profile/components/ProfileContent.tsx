import { getUserProfile } from "@/actions/user";
import { redirect } from "next/navigation";
import { ProfileHeader } from "./ProfileHeader";
import { PersonalInfoCard } from "./PersonalInfoCard";
import { CompanyInfoCard } from "./CompanyInfoCard";
import { PaymentDateCard } from "./PaymentDateCard";

export async function ProfileContent() {
  const user = await getUserProfile();

  console.log("1");
  if (!user) {
    redirect("/login");
  }

  console.log("2");

  return (
    <div className="container mx-auto py-10 px-4">
      <ProfileHeader user={{ fullName: user.full_name, email: user.email }} />

      <div className="grid gap-6 md:grid-cols-2">
        <PersonalInfoCard user={user} />
        <CompanyInfoCard company={user.Company} />
      </div>

      <div className="mt-8">
        <PaymentDateCard />
      </div>
    </div>
  );
}
