import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: "#EBFF45",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: 17,
            fontWeight: 900,
            color: "#08080a",
            letterSpacing: "-0.5px",
            lineHeight: 1,
            marginBottom: 1,
          }}
        >
          A
        </span>
        {/* Bottom-right notch dot */}
        <div
          style={{
            position: "absolute",
            bottom: 3,
            right: 3,
            width: 6,
            height: 6,
            borderRadius: 9999,
            background: "#08080a",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
