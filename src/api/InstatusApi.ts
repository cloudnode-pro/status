import { Site } from "./Site";
import { SiteResponse } from "./SiteResponse";

export class InstatusApi {
  private readonly base: URL;

  public constructor(id: string) {
    this.base = new URL(`https://api.instatus.com/public/${id}`);
  }

  public async getSite(): Promise<Site> {
    const res = await fetch(this.base);
    if (!res.ok) {
      throw new Error(`Failed to fetch site: ${res.status}`);
    }
    const data: SiteResponse = await res.json();
    return data.site;
  }
}
