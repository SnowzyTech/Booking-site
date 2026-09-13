"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { nav } from "@/lib/site";

/*
 * Below xl the pill nav has no room for six items, so it collapses to this
 * hamburger. The panel repeats the same `nav` list plus the CTA that the pill
 * drops on phones. Links are anchors on the landing page, so every one of them
 * closes the sheet on click.
 */
export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="flex size-[44px] shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:hidden"
        >
          <Menu className="size-5" strokeWidth={1.75} />
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:duration-200 data-[state=open]:duration-300" />
        <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex w-[86vw] max-w-[340px] flex-col bg-white p-6 shadow-xl ease-quart data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right data-[state=closed]:duration-200 data-[state=open]:duration-300">
          <DialogPrimitive.Title className="sr-only">
            Site navigation
          </DialogPrimitive.Title>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <span className="relative size-10 overflow-hidden rounded-full bg-[#e8d5f0]">
                <Image
                  src="/images/linda-avatar.jpg"
                  alt="Linda Chikaodi Austin"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <span className="text-[13px] font-medium leading-[1.3] text-foreground">
                Linda Chikaodi
                <br />
                Austin
              </span>
            </span>
            <DialogPrimitive.Close
              aria-label="Close menu"
              className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-5" strokeWidth={1.75} />
            </DialogPrimitive.Close>
          </div>

          {/* The panel mounts on open, so these are mount animations rather
              than the scroll-reveal system. */}
          <nav className="mt-8 flex flex-col">
            {nav.map((item, i) => (
              /* Plain anchor for the same reason as the pill nav — see
                 site-header.tsx. */
              <DialogPrimitive.Close asChild key={item.label}>
                <a
                  href={item.href}
                  style={{ animationDelay: `${80 + i * 40}ms` }}
                  className="animate-in border-b border-border/70 py-4 text-[15px] text-[#4a4a4a] transition-colors duration-300 ease-quart fade-in-0 fill-mode-both slide-in-from-right-3 hover:text-brand"
                >
                  {item.label}
                </a>
              </DialogPrimitive.Close>
            ))}
          </nav>

          <DialogPrimitive.Close asChild>
            <Button asChild variant="pill" size="lg" className="mt-8 w-full">
              <Link href="/book">Explore Services</Link>
            </Button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
