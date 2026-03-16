import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { Component } from "./Component";
import { Notice } from "../models/Notice";
import { ServiceRow } from "./ServiceRow";
import { NoticeStatus } from "../models/NoticeStatus";
import { ServiceStatus } from "../models/ServiceStatus";

@customElement("service-day-tooltip")
export class ServiceDayTooltip extends Component {
  @property({ type: Array })
  public notices: Notice[];

  @property({ type: Object })
  public day: Date;

  @state()
  public started: Date | null;

  private static readonly STATUS_NAMES: Record<NoticeStatus, string> = {
    [NoticeStatus.INCIDENT_IDENTIFIED]: "Identified",
    [NoticeStatus.INCIDENT_INVESTIGATING]: "Investigating",
    [NoticeStatus.INCIDENT_MONITORING]: "Monitoring",
    [NoticeStatus.INCIDENT_RESOLVED]: "Resolved",
    [NoticeStatus.MAINTENANCE_NOT_STARTED_YET]: "Planned",
    [NoticeStatus.MAINTENANCE_IN_PROGRESS]: "In progress",
    [NoticeStatus.MAINTENANCE_COMPLETED]: "Completed",
  };

  public constructor(notices: Notice[], day: Date, started: Date | null) {
    super();
    this.notices = notices.sort((a, b) =>
      a.started.getTime() - b.started.getTime()
    );
    this.day = day;
    this.started = started;
  }

  private static duration(ms: number): { iso: string; human: string } {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const iso = "P" +
      (days ? `${days}D` : "") +
      (hours || minutes ? "T" : "") +
      (hours ? `${hours}H` : "") +
      (minutes ? `${minutes}M` : "");

    const parts = [
      days && `${days} ${days === 1 ? "day" : "days"}`,
      hours && `${hours} ${hours === 1 ? "hour" : "hours"}`,
      minutes && `${minutes} ${minutes === 1 ? "minute" : "minutes"}`,
    ].filter(Boolean) as string[];

    const human = parts.length > 1
      ? parts.slice(0, -1).join(", ") + " and " + parts.at(-1)
      : parts[0] ?? "0 minutes";

    return { iso, human };
  }

  public override render() {
    const now = new Date();
    const days = (n: number) =>
      new Date(now.getTime() - n * 86400000).toISOString().split("T")[0];
    const tomorrow = new Date(this.day);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return html`
      <div
        class="absolute -inset-x-2 top-full z-50 rounded-xl bg-neutral-800 shadow-md ring-1 ring-white/10 ring-inset not-group-hover/bar:not-group-focus-visible/bar:not-group-has-focus-visible/bar:sr-only"
      >
        <div
          class="grid grid-cols-3 items-center border-b border-white/10 px-3 py-2 leading-none"
        >
          <span class="text-xs text-neutral-500" aria-hidden="true">
            <time datetime="${days(30)}" class="sm:hidden">30 days ago</time>
            <time datetime="${days(
              60,
            )}" class="hidden sm:inline md:hidden">60 days
              ago
            </time>
            <time datetime="${days(
              90,
            )}" class="hidden md:inline">90 days ago </time>
          </span>
          <time
            datetime="${this.day.toISOString().split("T")[0]}"
            class="text-center text-sm font-medium text-neutral-300"
          >${this.day.toLocaleString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}</time>
          <time
            datetime="${days(0)}"
            aria-hidden="true"
            class="text-right text-xs text-neutral-500"
          >Today</time>
        </div>
        ${this.notices.length > 0
          ? html`
            <ul class="px-3 py-1">
              ${this.notices.map((n) => {
                const style = ServiceRow.STATUS_STYLES[n.impact];
                const duration = ServiceDayTooltip.duration(n.duration());
                return html`
                  <li
                    class="relative flex items-center gap-2 py-2 rounded-lg has-focus-visible:outline-2 outline-offset-2 outline-blue-400"
                  >
                    <div class="group/indicator relative z-10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="size-5 ${style.color}"
                        viewBox="0 0 256 256"
                        aria-hidden="true"
                        .innerHTML="${style.icon}"
                      >
                      </svg>
                      <span
                        class="absolute top-full left-0 z-50 mt-1 block w-max rounded-lg bg-neutral-800 px-2 py-1 text-sm leading-normal font-medium text-white shadow-md ring-1 ring-white/10 ring-inset not-group-hover/indicator:sr-only lg:-top-1 lg:-left-1 lg:mt-0 lg:-translate-x-full"
                      >${style.label}</span>
                    </div>
                    <a
                      href="/notices/${n.id}"
                      class="font-medium text-white focus-visible:outline-none"
                    >
                      ${n.name}
                      <span class="absolute inset-0"></span>
                    </a>

                    <div class="mx-2 flex-1 border-t border-white/10"></div>
                    <p class="text-sm text-neutral-400">${n.ended === null ||
                        n.started.getTime() > now.getTime()
                      ? ServiceDayTooltip.STATUS_NAMES[n.status]
                      : html`
                        Resolved after <time datetime="${duration
                          .iso}">${duration.human}</time>
                      `}</p>
                  </li>
                `;
              })}
            </ul>
          `
          : html`
            <div class="flex items-center justify-center gap-2 py-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                aria-hidden="true"
                class="size-5 ${this.started === null ||
                    this.started.getTime() < tomorrow.getTime()
                  ? ServiceRow.STATUS_STYLES[ServiceStatus.OPERATIONAL].color
                  : "fill-neutral-400"}"
              >
                <path
                  d="${this.started === null ||
                      this.started.getTime() < tomorrow.getTime()
                    ? "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"
                    : "M180,128a12,12,0,0,1-12,12H88a12,12,0,0,1,0-24h80A12,12,0,0,1,180,128Zm56,0A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z"}"
                >
                </path>
              </svg>
              <p class="font-medium text-white">${this.started === null ||
                  this.started.getTime() < tomorrow.getTime()
                ? ServiceRow.STATUS_STYLES[ServiceStatus.OPERATIONAL].label
                : "Not monitored"}</p>
            </div>
          `}
        <div class="p-3">
          <div class="relative h-1.5 rounded-full bg-white/10" aria-hidden="true">
            ${(() => {
              const monitorStart = this.started == null
                ? this.day.getTime()
                : Math.max(this.started.getTime(), this.day.getTime());
              const monitorEnd = Math.min(Date.now(), tomorrow.getTime());

              if (monitorStart >= monitorEnd) return nothing;

              const toPercent = (ms: number) =>
                (ms - this.day.getTime()) / 864000;
              const toWidth = (start: number, end: number) =>
                (end - start) / 864000;

              const clampedNotices = this.notices
                .map((n) => ({
                  start: Math.max(
                    n.started.getTime(),
                    this.day.getTime(),
                    monitorStart,
                  ),
                  end: Math.max(n.started.getTime(), this.day.getTime()) +
                    n.duration(this.day),
                  impact: n.impact,
                }))
                .filter((n) => n.start < n.end);

              const greenSegments: { start: number; end: number }[] = [];
              let cursor = monitorStart;
              for (const n of clampedNotices) {
                if (cursor < n.start) {
                  greenSegments.push({
                    start: cursor,
                    end: Math.min(n.start, monitorEnd),
                  });
                }
                cursor = Math.max(cursor, n.end);
              }
              if (cursor < monitorEnd) {
                greenSegments.push({ start: cursor, end: monitorEnd });
              }

              return html`
                ${greenSegments.map((s) =>
                  html`
                    <div class="absolute h-full rounded-full ${ServiceRow
                      .STATUS_STYLES[ServiceStatus.OPERATIONAL]
                      .bar}" style="${styleMap({
                        left: `${toPercent(s.start)}%`,
                        width: `${toWidth(s.start, s.end)}%`,
                      })}"></div>
                  `
                )} ${this.notices.map((n) =>
                  html`
                    <div class="absolute h-full rounded-full ${ServiceRow
                      .STATUS_STYLES[n.impact].bar}" style="${styleMap({
                        left: `${
                          toPercent(
                            Math.max(n.started.getTime(), this.day.getTime()),
                          )
                        }%`,
                        width: `${n.duration(this.day) / 864000}%`,
                        zIndex: n.impact,
                      })}"></div>
                  `
                )}
              `;
            })()}
          </div>
        </div>
      </div>
    `;
  }
}
