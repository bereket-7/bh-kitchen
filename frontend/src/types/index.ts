/** Integer santim (1 ETB = 100). Never use floating-point birr amounts. */
export type Money = number;

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  price: Money;
  imageUrl: string | null;
  inStock: boolean;
}
