import { Service } from "./Service";
import { Services } from "./Services";
import { Notice } from "./Notice";

export class ServiceGroup extends Service {
  public readonly children: Service[];
  public readonly isCollapsed: boolean;

  public constructor(
    id: string,
    name: string,
    children: Service[],
    notices: Notice[],
    showUptime: boolean,
    isCollapsed: boolean,
  ) {
    super(
      id,
      name,
      Services.mostSevere(children).status,
      [],
      notices,
      showUptime,
    );
    this.children = children;
    this.isCollapsed = isCollapsed;
  }
}
