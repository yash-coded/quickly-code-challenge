import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserInfo {
  full_name: string;
  email: string;
  phone: string;
}

interface PersonalInfoCardProps {
  user: UserInfo;
}

export function PersonalInfoCard({ user }: PersonalInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Your account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
          <p className="text-lg">{user.full_name}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Email</h3>
          <p className="text-lg">{user.email}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Phone</h3>
          <p className="text-lg">{user.phone}</p>
        </div>
      </CardContent>
    </Card>
  );
}
