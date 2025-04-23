import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaymentDateChecker } from "@/features/payment";

export function PaymentDateCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Date Checker</CardTitle>
        <CardDescription>Check when your invoice will be paid</CardDescription>
      </CardHeader>
      <CardContent>
        <PaymentDateChecker />
      </CardContent>
    </Card>
  );
}
