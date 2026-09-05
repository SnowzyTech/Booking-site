/*
 * Clients has an icon in the admin rail but no design in _mockups/ — the Figma
 * export did not include it. This placeholder keeps the rail navigable rather
 * than 404-ing; the real screen is built once the frame is supplied.
 */
export default function ClientsPage() {
  return (
    <div className="px-[68px] pt-[60px]">
      <h1 className="text-[22px] font-semibold text-[#111]">Clients</h1>
      <p className="mt-3 max-w-[520px] text-[14px] leading-relaxed text-[#6f6f6f]">
        No design has been supplied for this screen yet. It is referenced by the
        admin rail in the mockups but was not part of the Figma export.
      </p>
    </div>
  );
}
