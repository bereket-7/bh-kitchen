import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/common/placeholder-page";

type TrackOrderPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export const metadata: Metadata = {
  title: "Track order",
};

export default async function TrackOrderPage({ params }: TrackOrderPageProps) {
  const { orderNumber } = await params;

  return (
    <PlaceholderPage
      title={`Order ${orderNumber}`}
      description="Order and delivery status will load here after the order number is confirmed with the phone number used at checkout."
    />
  );
}
