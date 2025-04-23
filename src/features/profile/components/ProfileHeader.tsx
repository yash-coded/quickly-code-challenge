import { LogoutButton } from "@/components/logout-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserProps {
  fullName: string;
  email: string;
}

export function ProfileHeader({ user }: { user: UserProps }) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.fullName}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}
