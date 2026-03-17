import { customElement, property } from "lit/decorators.js";
import { Component } from "./Component";
import { Notice } from "../models/Notice";
import { Maintenance } from "../models/Maintenance";
import { html, nothing } from "lit";
import { EnumMappings } from "../EnumMappings";
import { ServiceStatus } from "../models/ServiceStatus";
import { NoticeOverview } from "./NoticeOverview";

@customElement("active-notices")
export class ActiveNotices extends Component {
  private static readonly MAINTENANCE_COLLAPSE_DAYS = 3;

  @property({ type: Array })
  public readonly notices: Notice[];

  public constructor(notices: Notice[]) {
    super();
    this.notices = notices;
  }

  public maintenances(): Maintenance[] {
    const threshold = new Date(
      Date.now() + ActiveNotices.MAINTENANCE_COLLAPSE_DAYS * 86400000,
    );
    return this.notices.filter((n) =>
      n instanceof Maintenance && n.started > threshold
    ) as Maintenance[];
  }

  public active(): Notice[] {
    const threshold = new Date(
      Date.now() + ActiveNotices.MAINTENANCE_COLLAPSE_DAYS * 86400000,
    );
    return this.notices.filter((n) =>
      n.ended === null || (n.ended > new Date() && n.started <= threshold)
    );
  }

  public override render() {
    const active = this.active();
    const maintenances = this.maintenances();
    return html`
      ${active.length === 0 ? nothing : html`
        <ul class="flex flex-col space-y-12 mb-6">
          ${active.map((n) =>
            html`
              <li>${new NoticeOverview(n)}</li>
            `
          )}
        </ul>
      `} ${maintenances.length === 0 ? nothing : html`
        <details
          class="group/upcoming -mx-3 mb-6 rounded-xl p-3 ring-white/5 ring-inset open:ring-1 md:-mx-4 md:p-4"
        >
          <summary
            class="flex cursor-pointer items-center gap-3 rounded-md outline-offset-2 outline-blue-400 focus-visible:outline-2"
          >
            <span class="group/indicator relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-5 ${EnumMappings
                  .SERVICE_STATUS_STYLES[ServiceStatus.UNDER_MAINTENANCE]
                  .color}"
                viewBox="0 0 256 256"
                aria-hidden="true"
                .innerHTML="${EnumMappings
                  .SERVICE_STATUS_STYLES[ServiceStatus.UNDER_MAINTENANCE].icon}"
              >
              </svg>
              <span
                class="absolute top-full left-0 z-50 mt-1 block w-max rounded-lg bg-neutral-800 px-2 py-1 text-sm leading-normal font-medium text-white shadow-md ring-1 ring-white/10 ring-inset not-group-hover/indicator:sr-only lg:-top-1 lg:-left-1 lg:mt-0 lg:-translate-x-full"
              >
                ${EnumMappings
                  .SERVICE_STATUS_STYLES[ServiceStatus.UNDER_MAINTENANCE]
                  .label}
              </span>
            </span>
            <span class="font-medium text-white">
              ${maintenances.length === 1
                ? "One maintenance is"
                : `${maintenances.length} maintenance periods are`} scheduled
            </span>
          </summary>
          <ul class="flex flex-col mt-4 space-y-4">
            ${maintenances.map((n) =>
              html`
                <li>${new NoticeOverview(n)}</li>
              `
            )}
          </ul>
        </details>
      `}
    `;
  }
}
