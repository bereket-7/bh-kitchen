import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/common/placeholder-page";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <PlaceholderPage
      title={slug}
      description="Product photos, price, description, and stock will load here from the catalogue API."
    />
  );
}
