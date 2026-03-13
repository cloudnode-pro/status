import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Page } from "./Page";
import { ServiceGroup } from "../../models/ServiceGroup";
import { ServiceRow } from "../ServiceRow";
import { ServiceGroupRow } from "../ServiceGroupRow";
import { Services } from "../../models/Services";
import { InstatusApi } from "../../api/InstatusApi";

@customElement("home-page")
export class HomePage extends Page {
  readonly #services: Promise<Services>;
  public constructor(api: InstatusApi, services: Promise<Services>) {
    super();
    this.api = api;
    this.#services = services;
  }

  public override async connectedCallback() {
    super.connectedCallback();
    this.services = await this.#services;
  }

  @property({ type: Object })
  public api!: InstatusApi;

  @property({ type: Object })
  public services!: Services;

  public override render() {
    return html`
      <div class="flex flex-col">
        ${this.services.items.map((service) => {
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
