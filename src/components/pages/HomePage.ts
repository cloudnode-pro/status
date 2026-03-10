import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Page } from "./Page";
import { Site } from "../../api/Site";
import { Service } from "../../models/Service";
import { ServiceRow } from "../ServiceRow";

@customElement("home-page")
export class HomePage extends Page {
  @property({ type: Object })
  public site!: Site;

  public override render() {
    const services = this.site.components.sort((a, b) => a.order - b.order).map(
      (c) => new Service(c.id, c.name.default, Service.parseStatus(c.status)),
    );

    return html`
      <div class="mt-4 flex flex-col gap-6">
        ${services.map((service) => {
          const row = new ServiceRow();
          row.service = service;
          return row;
        })}
      </div>
    `;
  }
}
