import { Service } from "./Service";
import { ServiceStatus } from "./ServiceStatus";

export class ServiceGroup extends Service {
  public readonly children: Service[];

  public constructor(id: string, name: string, children: Service[]) {
    const status = children.reduce(
      (worst, child) => child.status > worst ? child.status : worst,
      ServiceStatus.OPERATIONAL,
    );
    super(id, name, status, []);
    this.children = children;
  }
}
