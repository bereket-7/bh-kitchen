import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <PlaceholderPage
      title="About BH Kitchen"
      description="BH Kitchen is a kitchenware shop for customers in Addis Ababa. The brand story will be added here."
    />
  );
}
