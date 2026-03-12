import { Service } from "./Service";

export class Services {
  public readonly items: Service[];

  public constructor(items: Service[]) {
    this.items = items;
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
