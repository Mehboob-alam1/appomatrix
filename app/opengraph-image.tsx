import { ImageResponse } from "next/og";

export const alt = "Appo Matrix — software studio in Gilgit-Baltistan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1B7FBB",
          color: "white",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, textTransform: "uppercase" }}>
          Appo Matrix
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: -2, lineHeight: 1 }}>
            Software that ships
          </div>
          <div style={{ fontSize: 28, opacity: 0.9 }}>Gilgit-Baltistan · Web, mobile, and SaaS</div>
        </div>
      </div>
    ),
    size,
  );
}
