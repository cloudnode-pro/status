import { MetricDataPoint } from "./MetricDataPoint";

export class Metric {
  public readonly id: string;
  public readonly name: string;
  public readonly suffix: string;
  public readonly data: MetricDataPoint[];

  public constructor(
    id: string,
    name: string,
    suffix: string,
    data: MetricDataPoint[],
  ) {
    this.id = id;
    this.name = name;
    this.suffix = suffix;
    this.data = data;
  }

  public percentile(p: number, days: number = 1): number {
    const filtered = this.data.filter((pt) =>
      pt.timestamp >= Date.now() - days * 86400000
    ).sort((a, b) => a.value - b.value);
    if (filtered.length === 0) {
      return 0;
    }
    const pos = (filtered.length - 1) * (p / 100);
    const lower = Math.floor(pos);
    const upper = Math.ceil(pos);
    const fraction = pos - lower;
    return filtered[lower].value +
      fraction * (filtered[upper].value - filtered[lower].value);
  }
}
