"use client";

import * as React from "react";

import { AdminRail } from "@/components/admin/admin-rail";
import { AdminTopNav } from "@/components/admin/admin-topnav";

/*
 * Holds the sidebar's expanded/collapsed state so the rail and the content
 * area stay in sync (the rail is a flex child, so expanding it pushes the
 * content rather than overlapping it). Renders the shared top bar above the
 * page content.
 */
export function AdminShell({
  adminEmail,
  children,
}: {
  adminEmail?: string | null;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-wash-admin">
      <AdminRail expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopNav adminEmail={adminEmail} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
