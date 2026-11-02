import Link from "next/link";
import { site } from "@/lib/site";

const highlights = [
  {
    title: "Cookware",
    text: "Pots, pans, and the tools used for everyday cooking.",
  },
  {
    title: "Prep",
    text: "Boards, knives, and tools for getting a meal started.",
  },
  {
    title: "Gadgets",
    text: "Small appliances and kitchen helpers.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <section className="max-w-2xl">
        <p className="text-sm font-medium tracking-wide text-brand-secondary">
          Addis Ababa
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
          {site.name}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-foreground/75">
          {site.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="rounded-md bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Browse the shop
          </Link>
          <Link
            href="/about"
            className="rounded-md border border-foreground/15 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-foreground/5"
          >
            About the shop
          </Link>
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-3" aria-label="Product groups">
        {highlights.map((item) => (
          <Link
            key={item.title}
            href="/shop"
            className="rounded-xl border border-foreground/10 bg-background p-6 transition-colors hover:border-brand-primary/40"
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">{item.text}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
