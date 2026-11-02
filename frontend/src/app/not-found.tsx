import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
          <p className="mt-3 text-foreground/70">That page is not part of BH Kitchen.</p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-brand-primary hover:underline"
          >
            Back to the home page
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
