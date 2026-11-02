import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <PlaceholderPage
      title="Contact"
      description="Phone, WhatsApp, and social links for BH Kitchen will be listed here."
    />
  );
}
