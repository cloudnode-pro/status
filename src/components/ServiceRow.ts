import { html, nothing, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import markdownit from "markdown-it";
import { Component } from "./Component";
import { Service } from "../models/Service";
import { ServiceStatus } from "../models/ServiceStatus";
import { Notice } from "../models/Notice";
import { ServiceDayTooltip } from "./ServiceDayTooltip";

@customElement("service-row")
export class ServiceRow extends Component {
  private static readonly MD = markdownit();

  public static readonly STATUS_STYLES: Record<
    ServiceStatus,
    { color: string; bar: string; label: string; icon: string }
  > = {
    [ServiceStatus.OPERATIONAL]: {
      color: "fill-emerald-400",
      bar: "bg-emerald-500",
      label: "Operational",
      icon:
        `<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>`,
    },
    [ServiceStatus.UNDER_MAINTENANCE]: {
      color: "fill-indigo-400",
      bar: "bg-blue-400",
      label: "Under maintenance",
      icon:
        `<path d="M128 24a104 104 0 1 0 104 104A104.13 104.13 0 0 0 128 24m14.052 54.734a34.2 34.2 0 0 1 9.427 1.006 3.79 3.79 0 0 1 1.865 6.25l-17.76 19.265 2.682 12.485 12.484 2.677 19.266-17.782a3.79 3.79 0 0 1 6.25 1.865 34.4 34.4 0 0 1 1.02 8.333 34.122 34.122 0 0 1-47.833 31.282l-24.672 28.536a4 4 0 0 1-.187.203 15.168 15.168 0 0 1-21.448-21.453q.098-.095.203-.182l28.542-24.667a34.155 34.155 0 0 1 30.161-47.818" />`,
    },
    [ServiceStatus.DEGRADED_PERFORMANCE]: {
      color: "fill-amber-400",
      bar: "bg-amber-400",
      label: "Degraded performance",
      icon:
        `<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"></path>`,
    },
    [ServiceStatus.PARTIAL_OUTAGE]: {
      color: "fill-orange-400",
      bar: "bg-orange-400",
      label: "Partial outage",
      icon:
        `<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"></path>`,
    },
    [ServiceStatus.MAJOR_OUTAGE]: {
      color: "fill-red-400",
      bar: "bg-red-400",
      label: "Major outage",
      icon:
        `<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>`,
    },
  };

  private static readonly WEIGHTS: Record<ServiceStatus, number> = {
    [ServiceStatus.OPERATIONAL]: 0,
    [ServiceStatus.UNDER_MAINTENANCE]: 0,
    [ServiceStatus.DEGRADED_PERFORMANCE]: 0,
    [ServiceStatus.PARTIAL_OUTAGE]: 0.3,
    [ServiceStatus.MAJOR_OUTAGE]: 1,
  };

  @property({ type: Object })
  public service: Service;

  @property({ type: Array })
  public notices: Notice[];

  public constructor(service: Service, notices: Notice[]) {
    super();
    this.service = service;
    this.notices = notices;
  }

  private static bar(
    day: Date,
    notices: Notice[],
    started: Date | null,
  ): TemplateResult {
    const tomorrow = new Date(day);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (started !== null && started.getTime() > tomorrow.getTime()) {
      return html`
        <div
          class="group/bar flex"
        >
          <div
            class="size-full bg-white/10 group-first/bar:rounded-l-sm group-last/bar:rounded-r-sm group-hover/bar:brightness-70"
          >
          </div>
          ${new ServiceDayTooltip(
            notices,
            day,
            started,
          )}
        </div>
      `;
    }

    if (notices.length === 0) {
      return html`
        <div
          class="group/bar flex"
        >
          <div
            class="size-full ${ServiceRow
              .STATUS_STYLES[ServiceStatus.OPERATIONAL]
              .bar} group-first/bar:rounded-l-sm group-last/bar:rounded-r-sm group-hover/bar:brightness-70"
          >
          </div>
          ${new ServiceDayTooltip(notices, day, started)}
        </div>
      `;
    }

    const worst = notices.reduce((w, n) => n.impact > w.impact ? n : w);
    return html`
      <div
        class="group/bar flex outline-offset-2 outline-blue-400 [:has(:focus-visible)]:z-10 [:has(:focus-visible)]:outline-2"
      >
        <div
          class="size-full ${ServiceRow.STATUS_STYLES[worst.impact]
            .bar} group-first/bar:rounded-l-sm group-last/bar:rounded-r-sm group-hover/bar:brightness-70 group-[:has(:focus-visible)]/bar:brightness-70"
        >
        </div>
        ${new ServiceDayTooltip(notices, day, started)}
      </div>
    `;
  }

  public uptime(days: number): number {
    const now = Date.now();
    const periodStart = now - days * 86400000;
    const totalMs = now - periodStart;

    const relevant = this.notices.filter((n) =>
      n.started.getTime() < now &&
      (n.ended === null || n.ended.getTime() > periodStart)
    );

    let downtime = 0;

    for (const notice of relevant) {
      const overlapStart = Math.max(notice.started.getTime(), periodStart);
      const overlapEnd = Math.min(notice.ended?.getTime() ?? now, now);
      const overlapMs = overlapEnd - overlapStart;

      const higherSeverityOverlap = relevant
        .filter((other) =>
          other.id !== notice.id &&
          other.impact > notice.impact
        )
        .reduce((total, other) => {
          const oStart = Math.max(other.started.getTime(), overlapStart);
          const oEnd = Math.min(other.ended?.getTime() ?? now, overlapEnd);
          return oStart < oEnd ? total + (oEnd - oStart) : total;
        }, 0);

      downtime += ServiceRow.WEIGHTS[notice.impact] *
        (overlapMs - higherSeverityOverlap);
    }

    return 1 - downtime / totalMs;
  }

  protected noticesForDay(day: Date): Notice[] {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const nextDayStart = new Date(dayStart);
    nextDayStart.setDate(dayStart.getDate() + 1);

    return this.notices.filter((n) =>
      n.started.getTime() < nextDayStart.getTime() &&
      (n.ended === null || n.ended.getTime() >= dayStart.getTime())
    );
  }

  protected renderIcon(): TemplateResult {
    const style = ServiceRow.STATUS_STYLES[this.service.status];
    return html`
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-5 ${style.color}"
          viewBox="0 0 256 256"
          aria-hidden="true"
          .innerHTML="${style.icon}"
        >
        </svg>
        <span
          class="absolute top-full left-0 z-50 mt-1 block w-max rounded-lg bg-neutral-800 px-2 py-1 text-sm leading-normal font-medium text-white shadow-lg ring-1 ring-white/10 ring-inset group-[:not(:hover)]/indicator:sr-only lg:-top-1 lg:-left-1 lg:mt-0 lg:-translate-x-full"
        >${style.label}</span>
      </span>
    `;
  }

  protected renderTop(): TemplateResult {
    return html`
      <div class="flex justify-between">
        <div class="relative flex items-center gap-2">
          <div class="group/indicator relative flex items-center gap-2">
            ${this.renderIcon()}
            <p class="font-medium text-white">${this.service.name}</p>
          </div>
          ${this.service.description === null ? nothing : html`
            <div class="group/description relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-4 fill-neutral-400"
                viewBox="0 0 256 256"
                aria-hidden="true"
              >
                <path
                  d="M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z"
                >
                </path>
              </svg>
              <div
                class="prose prose-neutral prose-invert prose-sm top-full left-0 absolute z-50 block w-max rounded-lg bg-neutral-800 px-2 py-1 text-white font-medium shadow-lg ring-1 ring-white/10 ring-inset group-[:not(:hover)]/description:sr-only lg:-top-2 lg:left-full lg:mt-0 lg:translate-x-1 max-w-sm"
              >
                ${unsafeHTML(
                  ServiceRow.MD.render(this.service.description),
                )}
              </div>
            </div>
          `}
        </div>
        <div class="flex items-baseline gap-4">
          ${this.service.metrics.map((metric) =>
            html`
              <p class="hidden text-white sm:block">~${metric.percentile(
                50,
                1,
              ).toLocaleString(undefined, {
                maximumFractionDigits: 1,
              })} ms</p>
            `
          )} ${this.service.showUptime
            ? html`
              <p class="${this.service.status === ServiceStatus.OPERATIONAL
                ? "text-emerald-400"
                : "text-neutral-300"}">${(this.uptime(90) * 100).toLocaleString(
                  undefined,
                  { minimumFractionDigits: 1, maximumFractionDigits: 2 },
                )}% uptime</p>
            `
            : nothing}
        </div>
      </div>
    `;
  }

  protected renderBars(): TemplateResult {
    const now = new Date();
    const bars = Array.from({ length: 90 }, (_, i) => {
      const day = new Date(now.getTime() - (89 - i) * 86400000);
      day.setHours(0, 0, 0, 0);
      return ServiceRow.bar(day, this.noticesForDay(day), this.service.started);
    });

    return html`
      <div
        class="relative mt-2 grid h-8 grid-cols-30 rounded-sm *:border-r *:border-neutral-900 *:last:border-r-0 sm:grid-cols-60 md:grid-cols-90 [&>:not(:nth-last-child(-n+30))]:max-sm:hidden [&>:not(:nth-last-child(-n+60))]:max-md:hidden"
      >
        ${bars}
      </div>
    `;
  }

  protected renderBottom(): TemplateResult {
    const today = new Date();
    const days = (n: number) =>
      new Date(today.getTime() - n * 86400000).toISOString().split("T")[0];

    return html`
      <div class="mt-1 flex justify-between">
        <p class="text-sm text-neutral-400">
          <time datetime="${days(30)}" class="sm:hidden">30 days ago</time>
          <time datetime="${days(
            60,
          )}" class="hidden sm:inline md:hidden">60 days ago
          </time>
          <time datetime="${days(
            90,
          )}" class="hidden md:inline">90 days ago
          </time>
        </p>
        <p class="text-sm text-neutral-400">
          <time datetime="${days(0)}">Today</time>
        </p>
      </div>
    `;
  }

  public override render(): TemplateResult {
    this.classList.add("mt-2", "mb-6");
    return html`
      ${this.renderTop()} ${this.renderBars()} ${this.renderBottom()}
    `;
  }
}
