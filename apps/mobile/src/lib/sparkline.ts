const BLOCKS = "▁▂▃▄▅▆▇█";

export function sparkline(values: number[], width = 32): string {
  if (values.length === 0) return "";
  const sample = values.length > width ? values.filter((_, i) => i % Math.ceil(values.length / width) === 0) : values;
  const min = Math.min(...sample);
  const max = Math.max(...sample);
  const range = max - min || 1;
  return sample.map((v) => BLOCKS[Math.min(BLOCKS.length - 1, Math.floor(((v - min) / range) * (BLOCKS.length - 1)))]).join("");
}
