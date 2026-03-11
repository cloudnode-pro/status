import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { InstatusApi } from "../../api/InstatusApi";
import { Site } from "../../api/Site";
import { Page } from "./Page";
import { Service } from "../../models/Service";
import { ServiceRow } from "../ServiceRow";
import { Metric } from "../../models/Metric";

@customElement("home-page")
export class HomePage extends Page {
  @property({ type: Object })
  public site!: Site;

  @property({ type: Object })
  public api!: InstatusApi;

  @state()
  private services: Service[] = [];

  public override async connectedCallback() {
    super.connectedCallback();
    this.services = await Promise.all(
      this.site.components
        .sort((a, b) => a.order - b.order)
        .map(async (c) => {
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
          );
        }),
    );
  }

  public override render() {
    return html`
      <div class="mt-4 flex flex-col gap-6">
        ${this.services.map((service) => {
          const row = new ServiceRow();
          row.service = service;
          return row;
        })}
      </div>
    `;
  }
}
