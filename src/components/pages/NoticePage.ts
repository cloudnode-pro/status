import { customElement, state } from "lit/decorators.js";
import { Page } from "./Page";
import { InstatusApi } from "../../api/InstatusApi";
import { Notice } from "../../models/Notice";
import { Incident } from "../../models/Incident";
import { Maintenance } from "../../models/Maintenance";
import { html, nothing } from "lit";
import { ServiceStatus } from "../../models/ServiceStatus";
import { Time } from "../../Time";
import { UpdatesFeed } from "../UpdatesFeed";

@customElement("notice-page")
export class NoticePage extends Page {
  private static readonly IMPACT_BADGES: Record<
    ServiceStatus,
    { style: string; label: string }
  > = {
    [ServiceStatus.OPERATIONAL]: {
      style: "text-neutral-400 bg-neutral-400/10 ring-neutral-400/10",
      label: "Notice",
    },
    [ServiceStatus.UNDER_MAINTENANCE]: {
      style: "text-blue-400 bg-blue-400/10 ring-blue-400/10",
      label: "Maintenance",
    },
    [ServiceStatus.DEGRADED_PERFORMANCE]: {
      style: "text-amber-400 bg-amber-400/10 ring-amber-400/10",
      label: "Degraded Performance",
    },
    [ServiceStatus.PARTIAL_OUTAGE]: {
      style: "text-orange-400 bg-orange-400/10 ring-orange-400/10",
      label: "Partial Outage",
    },
    [ServiceStatus.MAJOR_OUTAGE]: {
      style: "text-red-400 bg-red-400/10 ring-red-400/10",
      label: "Major Outage",
    },
  };

  private readonly type: "incidents" | "maintenance";
  private readonly noticeId: string;
  private readonly api: InstatusApi;

  @state()
  private notice?: Notice;

  public constructor(
    type: "incidents" | "maintenance",
    id: string,
    api: InstatusApi,
  ) {
    super();
    this.type = type;
    this.noticeId = id;
    this.api = api;
  }

  public override async connectedCallback() {
    super.connectedCallback();
    switch (this.type) {
      case "incidents": {
        this.notice = Incident.fromAPI(
          await this.api.getIncident(this.noticeId),
        );
        break;
      }
      case "maintenance": {
        this.notice = Maintenance.fromAPI(
          await this.api.getMaintenance(this.noticeId),
        );
        break;
      }
    }
  }

  public override render() {
    if (this.notice === undefined) {
      return nothing;
    }

    const nbsp = "\u00A0";
    const start = new Time.DateTime(this.notice.started);
    const end = this.notice.ended === null
      ? null
      : new Time.DateTime(this.notice.ended);
    const duration = new Time.Duration(this.notice.duration());

    const impactBadge = NoticePage.IMPACT_BADGES[this.notice.impact];

    return html`
      <a
        href="/"
        class="sm:hidden inline-flex gap-2 mb-4 text-neutral-400 text-sm items-center font-medium focus-visible:outline-2 outline-blue-400 outline-offset-2 rounded-md"
      >
        <span class="p-1 bg-white/10 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4 fill-current"
            viewBox="0 0 256 256"
            aria-hidden="true"
          >
            <path
              d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z"
            >
            </path>
          </svg>
        </span>
        Back to overview
      </a>
      <div class="flex items-center gap-4">
        <a
          href="/"
          class="rounded-full text-neutral-400 transition-colors hover:text-white hidden focus-visible:outline-2 outline-blue-400 sm:block"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-7 fill-current"
            viewBox="0 0 256 256"
            aria-hidden="true"
          >
            <path
              d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm40,112H107.31l18.35,18.34a8,8,0,0,1-11.32,11.32l-32-32a8,8,0,0,1,0-11.32l32-32a8,8,0,0,1,11.32,11.32L107.31,120H168a8,8,0,0,1,0,16Z"
            >
            </path>
          </svg>
          <span class="sr-only">Back to overview</span>
        </a>
        <h3 class="text-2xl font-medium text-white">${this.notice.name}</h3>
      </div>
      <div class="mt-2 flex flex-wrap items-center gap-2">
        <p
          class="w-max text-sm rounded-full px-2 py-0.5 ring-1 ring-inset ${impactBadge
            .style}"
        >
          ${impactBadge.label}
        </p>
        <p class="text-sm text-neutral-400">
          ${this.notice instanceof Maintenance && end !== null
            ? html`
              Scheduled for
              <time datetime="${start.toISOString()}">${start.toString()
                .replace(" ", nbsp)}
              </time>${nbsp}–${nbsp}
              <time
                datetime="${end.toISOString()}"
              >${end.getDay().is(start.getDay())
                ? end.toTimeString()
                : end.toString().replace(" ", nbsp)}
              </time> (<time datetime="${duration.toISOString()}">${duration
                .toString()}</time>).
            `
            : html`
              Occurred on
              <time datetime="${start.toISOString()}">${start.toString()
                .replace(" ", nbsp)}</time>. ${this.notice.ended === null
                ? "Ongoing for"
                : "Resolved after"} <time
                datetime="${duration.toISOString()}"
              >${duration.toString()}</time>.
            `}
        </p>
      </div>
      <dl class="mt-4 flex gap-2 items-center flex-wrap">
        <dt class="font-medium text-neutral-400">Affected services</dt>
        <dd>
          <ul class="flex gap-1 flex-wrap">
            ${this.notice.components.map((c) =>
              html`
                <li class="text-sm text-neutral-300 rounded-full bg-white/10 px-2 py-0.5">
                  ${c.name.default}
                </li>
              `
            )}
          </ul>
        </dd>
      </dl>

      <div class="mt-8">
        <div class="flex mb-2 items-center justify-between">
          <h4 class="font-medium text-neutral-400">Updates</h4>
          ${this.notice.ended === null || this.notice.ended > new Date()
            ? html`
              <button
                class="relative rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/10 outline-offset-2 outline-blue-400 transition-colors select-none ring-inset hover:bg-white/15 focus-visible:outline-2"
              >
                Subscribe
              </button>
            `
            : nothing}
        </div>
        <div class="pl-1">
          ${new UpdatesFeed(this.notice.updates)}
        </div>
      </div>
    `;
  }
}
