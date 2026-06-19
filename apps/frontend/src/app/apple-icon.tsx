import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "#EBFF45",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#08080a",
            letterSpacing: "-3px",
            lineHeight: 1,
            marginBottom: 4,
          }}
        >
          A
        </span>
        {/* Bottom-right notch dot */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            right: 18,
            width: 30,
            height: 30,
            borderRadius: 9999,
            background: "#08080a",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
