import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-semibold">{site.name}</p>
          <p className="mt-1 max-w-sm text-sm text-foreground/70">{site.tagline}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/75 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/cart" className="text-foreground/75 hover:text-foreground">
            Cart
          </Link>
        </nav>
      </div>
    </footer>
  );
}
