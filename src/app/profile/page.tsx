import { Suspense } from "react";
import { ProfileContent } from "@/features/profile";
import { ProfileSkeleton } from "@/components/profile-skeleton";

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
