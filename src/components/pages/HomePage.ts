import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Page } from "./Page";
import { ServiceGroup } from "../../models/ServiceGroup";
import { ServiceRow } from "../ServiceRow";
import { ServiceGroupRow } from "../ServiceGroupRow";
import { Services } from "../../models/Services";
import { InstatusApi } from "../../api/InstatusApi";
import { Notice } from "../../models/Notice";
import { Incident } from "../../models/Incident";
import { Service } from "../../models/Service";
import { NoticeUpdate } from "../../models/NoticeUpdate";
import { Maintenance } from "../../models/Maintenance";

@customElement("home-page")
export class HomePage extends Page {
  readonly #services: Promise<Services>;
  private rows!: ServiceRow[];

  @property({ type: Object })
  public api!: InstatusApi;

  @property({ type: Object })
  public services!: Services;

  @property({ type: Array })
  public notices!: Notice[];

  public constructor(api: InstatusApi, services: Promise<Services>) {
    super();
    this.api = api;
    this.#services = services;
  }

  public getRows(id: string): [ServiceRow] | [ServiceRow, ServiceGroupRow] {
    for (const row of this.rows) {
      if (row.service.id === id) {
        return [row];
      }

      if (row instanceof ServiceGroupRow) {
        const childRow = row.getRow(id);
        if (childRow !== null) {
          return [childRow, row];
        }
      }
    }

    throw new Error(`Could not find row for service ${id}`);
  }

  public override async connectedCallback() {
    super.connectedCallback();
    const [services, incidents, maintenances] = await Promise.all([
      this.#services,
      this.api.getIncidents(),
      this.api.getMaintenances(),
    ]);
    this.services = services;
    this.rows = this.services.items.map((service) => {
      if (service instanceof ServiceGroup) {
        return new ServiceGroupRow(service, []);
      }
      return new ServiceRow(service, []);
    });
    this.notices = [];

    for (const i of incidents) {
      const incident = new Incident(
        i.id,
        i.name.default,
        i.components,
        i.updates.map((u) =>
          new NoticeUpdate(
            u.id,
            new Date(u.started),
            Incident.parseStatus(u.status),
            u.message.default,
          )
        ),
        Incident.parseStatus(i.status),
        new Date(i.started),
        i.resolved === null ? null : new Date(i.resolved),
        Service.parseStatus(i.impact),
      );

      this.notices.push(incident);

      for (const affected of i.components) {
        for (const row of this.getRows(affected.id)) {
          row.notices.push(incident);
        }
      }
    }

    for (const m of maintenances) {
      const maintenance = new Maintenance(
        m.id,
        m.name.default,
        m.components,
        m.updates.map((u) =>
          new NoticeUpdate(
            u.id,
            new Date(u.started),
            Maintenance.parseStatus(u.status),
            u.message.default,
          )
        ),
        Maintenance.parseStatus(m.status),
        new Date(m.start),
        new Date(m.end),
      );
      this.notices.push(maintenance);

      for (const affected of m.components) {
        for (const row of this.getRows(affected.id)) {
          row.notices.push(maintenance);
        }
      }
    }
  }

  public override render() {
    return html`
      <div class="flex flex-col">
        ${this.rows}
      </div>
    `;
  }
}
