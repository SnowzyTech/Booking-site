import { ImageResponse } from "next/og";

/* Generated favicon — an "L" monogram on the brand purple, so there's a real
   icon in tabs and search results until a designed one is supplied. */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#5b0f8b",
          color: "white",
          fontSize: 22,
          fontWeight: 700,
          fontFamily: "sans-serif",
          borderRadius: 6,
        }}
      >
        L
      </div>
    ),
    size
  );
}
