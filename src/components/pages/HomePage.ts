import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { InstatusApi } from "../../api/InstatusApi";
import { Site } from "../../api/Site";
import { Page } from "./Page";
import { Service } from "../../models/Service";
import { ServiceGroup } from "../../models/ServiceGroup";
import { ServiceRow } from "../ServiceRow";
import { ServiceGroupRow } from "../ServiceGroupRow";
import { Metric } from "../../models/Metric";

@customElement("home-page")
export class HomePage extends Page {
  @property({ type: Object })
  public site!: Site;

  @property({ type: Object })
  public api!: InstatusApi;

  @state()
  private services: (Service | ServiceGroup)[] = [];

  public override async connectedCallback() {
    super.connectedCallback();
    this.services = await Promise.all(
      this.site.components
        .sort((a, b) => a.order - b.order)
        .map(async (c) => {
          if (c.isParent) {
            const children = await Promise.all(
              c.children
                .sort((a, b) => a.order - b.order)
                .map(async (child) => {
                  return new Service(
                    child.id,
                    child.name.default,
                    Service.parseStatus(child.status),
                    [],
                    child.showUptime,
                  );
                }),
            );
            return new ServiceGroup(
              c.id,
              c.name.default,
              children,
              c.showUptime,
              c.isCollapsed,
            );
          }
          const metrics = await Promise.all(
            c.metrics.map(async (m) => {
              const data = await this.api.getMetricData(m.id, 90);
              return new Metric(m.id, m.name.default, m.suffix, data);
            }),
          );
          return new Service(
            c.id,
            c.name.default,
            Service.parseStatus(c.status),
            metrics,
            c.showUptime,
          );
        }),
    );
  }

  public override render() {
    return html`
      <div class="mt-4 flex flex-col gap-6">
        ${this.services.map((service) => {
          if (service instanceof ServiceGroup) {
            const row = new ServiceGroupRow();
            row.service = service;
            return row;
          }
          const row = new ServiceRow();
          row.service = service;
          return row;
        })}
      </div>
    `;
  }
}
