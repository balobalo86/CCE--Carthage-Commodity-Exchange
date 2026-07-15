import type { CSSProperties, ReactNode } from "react";
import { T } from "../theme";

export function Chip({ children, color = T.muted, border = T.line }: { children: ReactNode; color?: string; border?: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        color,
        border: `1px solid ${border}`,
        borderRadius: 3,
        padding: "2px 7px",
        fontFamily: "'IBM Plex Mono', monospace",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function Panel({
  title,
  right,
  children,
  style,
}: {
  title?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 6, overflow: "hidden", ...style }}>
      {title && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "9px 14px",
            borderBottom: `1px solid ${T.line}`,
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: T.muted, fontFamily: "'IBM Plex Mono', monospace" }}>
            {title}
          </span>
          {right}
        </div>
      )}
      <div style={{ padding: 14 }}>{children}</div>
    </div>
  );
}

export function Row({ label, value, strong, color }: { label: ReactNode; value: ReactNode; strong?: boolean; color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "5px 0", borderBottom: `1px dashed ${T.line}` }}>
      <span style={{ color: T.muted, fontSize: 12.5 }}>{label}</span>
      <span
        style={{
          color: color || T.text,
          fontSize: 12.5,
          fontWeight: strong ? 600 : 400,
          fontFamily: "'IBM Plex Mono', monospace",
          textAlign: "end",
        }}
      >
        {value}
      </span>
    </div>
  );
}
