import { Service } from "./Service";
import { ServiceStatus } from "./ServiceStatus";

export class ServiceGroup extends Service {
  public readonly children: Service[];
  public readonly isCollapsed: boolean;

  public constructor(
    id: string,
    name: string,
    children: Service[],
    showUptime: boolean,
    isCollapsed: boolean,
  ) {
    const status = children.reduce(
      (worst, child) => child.status > worst ? child.status : worst,
      ServiceStatus.OPERATIONAL,
    );
    super(id, name, status, [], showUptime);
    this.children = children;
    this.isCollapsed = isCollapsed;
  }
}
