export default function ProfileLayout({
  children,
  paymentDateCardSection,
}: Readonly<{
  children: React.ReactNode;
  paymentDateCardSection: React.ReactNode;
}>) {
  return (
    <>
      {children}
      {paymentDateCardSection}
    </>
  );
}
