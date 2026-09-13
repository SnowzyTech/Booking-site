/*
 * Wizard step transition.
 *
 * A template remounts whenever its segment changes, so this replays on every
 * move between /book, /book/schedule, /book/details, /book/payment and
 * /book/assisted. Search params do not remount it — the landing page's
 * Services section relies on that, deep-linking straight into /book/schedule
 * or /book/assisted with ?service=<slug> (see <ServiceFromQuery>) without
 * disturbing this transition.
 *
 * It lives here rather than in layout.tsx on purpose: BookingProvider is in the
 * layout, so the wizard's in-memory booking survives every step. Only the
 * content below the header and stepper animates — those stay as fixed anchors.
 */
export default function BookStepTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-in duration-300 ease-quart fade-in-0 fill-mode-both slide-in-from-bottom-2">
      {children}
    </div>
  );
}
