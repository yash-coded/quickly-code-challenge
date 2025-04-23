import { User } from "@/actions/user";
import { LogoutButton } from "@/components/logout-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ProfileHeader(props: { user?: User }) {
  const getInitials = (name: string | undefined) => {
    if (!name) return "";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex justify-between items-center mb-8">
      {props.user && (
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>{getInitials(props.user.full_name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{props.user.full_name}</h1>
            <p className="text-gray-500">{props.user.email}</p>
          </div>
        </div>
      )}
      <LogoutButton />
    </div>
  );
}
