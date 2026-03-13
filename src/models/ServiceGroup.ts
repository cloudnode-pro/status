import { Service } from "./Service";
import { Services } from "./Services";

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
    super(id, name, Services.mostSevere(children).status, [], showUptime);
    this.children = children;
    this.isCollapsed = isCollapsed;
  }
}
