import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <PlaceholderPage
      title="Cart"
      description="Selected items, quantities, and totals will appear here. Prices are calculated by the server at checkout."
    />
  );
}
