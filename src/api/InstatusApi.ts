import { Site } from "./Site";
import { SiteResponse } from "./SiteResponse";
import { MetricDataPoint } from "../models/MetricDataPoint";

export class InstatusApi {
  private readonly base: URL;

  public constructor(id: string) {
    this.base = new URL(`https://api.instatus.com/public/${id}/`);
  }

  public async getSite(): Promise<Site> {
    const res = await fetch(this.base);
    if (!res.ok) {
      throw new Error(`Failed to fetch site: ${res.status}`);
    }
    const data: SiteResponse = await res.json();
    return data.site;
  }

  public async getMetricData(
    id: string,
    days: number = 1,
  ): Promise<MetricDataPoint[]> {
    const res = await fetch(
      new URL(`metrics/${id}/data?day=${days}`, this.base),
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch metric data: ${res.status}`);
    }

    const data: { data: MetricDataPoint[] } = await res.json();
    return data.data;
  }
}
