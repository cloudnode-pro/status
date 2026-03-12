import { Service } from "./Service";
import { SiteComponent } from "../api/SiteComponent";
import { ServiceGroup } from "./ServiceGroup";

export class Services {
  public readonly items: Service[];

  public constructor(items: Service[]) {
    this.items = items;
  }

  public static sort(a: SiteComponent, b: SiteComponent): number {
    return a.order - b.order;
  }

  public static mostSevere(services: Service[]): Service {
    return services.flatMap((s) => s instanceof ServiceGroup ? s.children : [s])
      .reduce((worst, curr) => curr.status > worst.status ? curr : worst);
  }

  public mostSevere(): Service {
    return Services.mostSevere(this.items);
  }
}
