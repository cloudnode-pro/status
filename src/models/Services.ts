import { Service } from "./Service";
import { SiteComponent } from "../api/SiteComponent";

export class Services {
  public readonly items: Service[];

  public constructor(items: Service[]) {
    this.items = items;
  }

  public static sort(a: SiteComponent, b: SiteComponent): number {
    return a.order - b.order;
  }

  public static mostSevere(services: Service[]): Service {
    return services.reduce((worst, curr) =>
      curr.status > worst.status ? curr : worst
    );
  }

  public mostSevere(): Service {
    return Services.mostSevere(this.items);
  }
}
