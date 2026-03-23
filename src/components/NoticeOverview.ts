import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Component } from "./Component";
import { Notice } from "../models/Notice";
import { EnumMappings } from "../EnumMappings";
import { Time } from "../Time";
import { UpdatesFeed } from "./UpdatesFeed";
import { Maintenance } from "../models/Maintenance";

@customElement("notice-overview")
export class NoticeOverview extends Component {
  @state()
  private readonly notice: Notice;

  public constructor(notice: Notice) {
    super();
    this.notice = notice;
  }

  public override render() {
    const start = new Time.DateTime(this.notice.started);
    const end = this.notice.ended === null
      ? null
      : new Time.DateTime(this.notice.ended);
    const duration = new Time.Duration(this.notice.duration());

    const nbsp = "\u00A0";

    return html`
      <div class="relative">
        <div class="flex items-center justify-between mb-2">
          <div>
            <div class="flex flex-row-reverse items-center justify-end gap-3">
              <a
                href="/${this.notice instanceof Maintenance
                  ? "maintenance"
                  : "incidents"}/${this.notice.id}"
                class="text-lg font-medium text-white"
              >
                ${this.notice.name}<span class="absolute inset-0"></span>
              </a>
              <span class="group/indicator relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-5 ${EnumMappings
                    .SERVICE_STATUS_STYLES[
                      this.notice.impact
                    ]
                    .color}"
                  viewBox="0 0 256 256"
                  aria-hidden="true"
                  .innerHTML="${EnumMappings
                    .SERVICE_STATUS_STYLES[
                      this.notice.impact
                    ]
                    .icon}"
                >
                </svg>
                <span
                  class="absolute top-full left-0 z-50 mt-1 block w-max rounded-lg bg-neutral-800 px-2 py-1 text-sm leading-normal font-medium text-white shadow-md ring-1 ring-white/10 ring-inset not-group-hover/indicator:sr-only lg:-top-1 lg:-left-1 lg:mt-0 lg:-translate-x-full"
                >
                  ${EnumMappings
                    .SERVICE_STATUS_STYLES[
                      this.notice.impact
                    ]
                    .label}
                </span>
              </span>
            </div>
            ${this.notice instanceof Maintenance && end !== null
              ? html`
                <p class="text-sm leading-loose text-neutral-400">
                  Scheduled for
                  <time datetime="${start.toISOString()}">${start.toString()
                    .replace(" ", nbsp)}</time>${nbsp}–${nbsp}<time
                    datetime="${end.toISOString()}"
                  >${end.getDay().is(start.getDay())
                    ? end.toTimeString()
                    : end.toString().replace(" ", nbsp)}</time>
                  <time
                    class="rounded-full bg-white/10 px-2 py-0.5 ring-1 ring-white/10 ring-inset"
                    datetime="${duration.toISOString()}"
                  >${duration
                    .toString()}</time>
                </p>
              `
              : nothing}
          </div>
          <button
            class="relative rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/10 outline-offset-2 outline-blue-400 transition-colors select-none ring-inset hover:bg-white/15 focus-visible:outline-2"
          >
            Subscribe
          </button>
        </div>
        ${new UpdatesFeed(this.notice.updates)}
      </div>
    `;
  }
}
