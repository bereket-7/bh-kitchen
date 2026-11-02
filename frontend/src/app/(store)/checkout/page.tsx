import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <PlaceholderPage
      title="Checkout"
      description="Contact details, an Addis Ababa delivery address, and a payment method will be collected here."
    />
  );
}
