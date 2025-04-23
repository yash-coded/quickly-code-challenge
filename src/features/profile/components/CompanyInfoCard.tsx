import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CompanyInfo {
  name: string;
  address_line_1: string;
  address_line_2?: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  address_country: string;
  default_currency: string;
}

interface CompanyInfoCardProps {
  company: CompanyInfo;
}

export function CompanyInfoCard({ company }: CompanyInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>Your business details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
          <p className="text-lg">{company.name}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Address</h3>
          <p>{company.address_line_1}</p>
          {company.address_line_2 && <p>{company.address_line_2}</p>}
          <p>
            {company.address_city}, {company.address_state}{" "}
            {company.address_zip}
          </p>
          <p>{company.address_country}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Default Currency
          </h3>
          <p className="text-lg uppercase">{company.default_currency}</p>
        </div>
      </CardContent>
    </Card>
  );
}
