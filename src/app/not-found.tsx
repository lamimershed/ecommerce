import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-accent">404</p>
      <h1 className="text-4xl font-semibold tracking-tight">This page wandered off</h1>
      <p className="max-w-md text-muted-foreground">
        The product you are looking for may have sold out or moved. Let&apos;s get
        you back to the collection.
      </p>
      <Button asChild size="lg">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
