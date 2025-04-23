import { getUserProfile } from "@/actions/user";
import { ProfileHeader } from "./ProfileHeader";
import { PersonalInfoCard } from "./PersonalInfoCard";
import { CompanyInfoCard } from "./CompanyInfoCard";

export async function ProfileContent() {
  const user = await getUserProfile();

  return (
    <div className="container mx-auto py-10 px-4">
      <ProfileHeader user={user} />

      <div className="grid gap-6 md:grid-cols-2">
        {user && <PersonalInfoCard user={user} />}
        {user && <CompanyInfoCard company={user.Company} />}
      </div>
    </div>
  );
}
