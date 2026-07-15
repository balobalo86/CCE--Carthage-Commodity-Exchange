import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { T } from "../theme";

export default function PriceChart({
  history,
  loB,
  hiB,
  refPx,
  accent,
  unit,
  lastLabel,
  height = 240,
}: {
  history: { t: number; p: number }[];
  loB: number;
  hiB: number;
  refPx: number;
  accent: string;
  unit: string;
  lastLabel: string;
  height?: number;
}) {
  return (
    <div style={{ height, direction: "ltr" }}>
      <ResponsiveContainer>
        <LineChart data={history} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <XAxis dataKey="t" hide />
          <YAxis
            domain={[loB * 0.999, hiB * 1.001]}
            width={62}
            tick={{ fill: T.muted, fontSize: 11, fontFamily: "IBM Plex Mono" }}
            tickFormatter={(v) => v.toLocaleString("en-US")}
            axisLine={{ stroke: T.line }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ background: T.panelUp, border: `1px solid ${T.line}`, borderRadius: 4, fontSize: 12, fontFamily: "IBM Plex Mono" }}
            labelFormatter={() => ""}
            formatter={(v: number) => [`${v.toLocaleString("en-US")} ${unit}`, lastLabel]}
          />
          <ReferenceLine y={hiB} stroke={T.down} strokeDasharray="4 4" />
          <ReferenceLine y={loB} stroke={T.down} strokeDasharray="4 4" />
          <ReferenceLine y={refPx} stroke={T.faint} strokeDasharray="2 6" />
          <Line type="monotone" dataKey="p" stroke={accent} strokeWidth={1.8} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
