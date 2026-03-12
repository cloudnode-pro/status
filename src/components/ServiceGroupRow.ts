import { html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ServiceRow } from "./ServiceRow";
import { ServiceGroup } from "../models/ServiceGroup";
import { ServiceStatus } from "../models/ServiceStatus";

@customElement("service-group-row")
export class ServiceGroupRow extends ServiceRow {
  @property({ type: Object })
  public override service!: ServiceGroup;

  protected override renderIcon(): TemplateResult {
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="size-5 fill-neutral-300 transition-transform ease-out group-open/services:rotate-90"
        viewBox="0 0 256 256"
      >
        <path
          d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm29.66,109.66-40,40a8,8,0,0,1-11.32-11.32L140.69,128,106.34,93.66a8,8,0,0,1,11.32-11.32l40,40A8,8,0,0,1,157.66,133.66Z"
        >
        </path>
      </svg>
    `;
  }

  public override render(): TemplateResult {
    return html`
      <details
        class="group/services -m-4 mb-2 rounded-xl p-4 ring-white/5 open:mb-6 open:ring-1"
        ?open="${!this.service.isCollapsed ||
          this.service.children.some((c) =>
            c.status !== ServiceStatus.OPERATIONAL
          )}"
      >
        <summary class="block cursor-pointer">
          ${this.renderTop()}
          <div class="group-open/services:hidden">
            ${this.renderBars()} ${this.renderBottom()}
          </div>
        </summary>
        ${this.service.children.map((child) => {
          const row = new ServiceRow();
          row.service = child;
          row.classList.add("block", "mt-4");
          return row;
        })}
      </details>
    `;
  }
}
