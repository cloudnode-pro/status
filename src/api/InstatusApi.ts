import { Site } from "./Site";
import { SiteResponse } from "./SiteResponse";
import { MetricDataPoint } from "../models/MetricDataPoint";
import { Incident } from "./Incident";
import { Maintenance } from "./Maintenance";

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

  public async getIncidents(): Promise<Incident[]> {
    const res = await fetch(new URL("incidents", this.base));
    if (!res.ok) {
      throw new Error(`Failed to fetch incidents: ${res.status}`);
    }
    const data: { incidents: Incident[] } = await res.json();
    return data.incidents;
  }

  public async getMaintenances(): Promise<Maintenance[]> {
    const res = await fetch(new URL("maintenances", this.base));
    if (!res.ok) {
      throw new Error(`Failed to fetch maintenances: ${res.status}`);
    }
    const data: { maintenances: Maintenance[] } = await res.json();
    return data.maintenances;
  }

  public async getIncident(id: string): Promise<Incident> {
    const res = await fetch(new URL(`incidents/${id}`, this.base));
    if (!res.ok) {
      throw new Error(`Failed to fetch incident: ${res.status}`);
    }
    return res.json();
  }

  public async getMaintenance(id: string): Promise<Maintenance> {
    const res = await fetch(new URL(`maintenances/${id}`, this.base));
    if (!res.ok) {
      throw new Error(`Failed to fetch maintenance: ${res.status}`);
    }
    return res.json();
  }
}
