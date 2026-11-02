import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export const metadata: Metadata = {
  title: "Shop",
};

export default function ShopPage() {
  return (
    <PlaceholderPage
      title="Shop"
      description="The product catalogue will load here from the BH Kitchen API. Filtering and sorting come with that connection."
    />
  );
}
