import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Component } from "./Component";
import { Service } from "../models/Service";
import { ServiceStatus } from "../models/ServiceStatus";

const STATUS_STYLES: Record<
  ServiceStatus,
  { color: string; label: string; icon: string }
> = {
  [ServiceStatus.OPERATIONAL]: {
    color: "text-emerald-400",
    label: "Operational",
    icon:
      `<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>`,
  },
  [ServiceStatus.UNDER_MAINTENANCE]: {
    color: "text-neutral-400",
    label: "Under Maintenance",
    icon:
      `<path d="M128 24a104 104 0 1 0 104 104A104.13 104.13 0 0 0 128 24m14.052 54.734a34.2 34.2 0 0 1 9.427 1.006 3.79 3.79 0 0 1 1.865 6.25l-17.76 19.265 2.682 12.485 12.484 2.677 19.266-17.782a3.79 3.79 0 0 1 6.25 1.865 34.4 34.4 0 0 1 1.02 8.333 34.122 34.122 0 0 1-47.833 31.282l-24.672 28.536a4 4 0 0 1-.187.203 15.168 15.168 0 0 1-21.448-21.453q.098-.095.203-.182l28.542-24.667a34.155 34.155 0 0 1 30.161-47.818" />`,
  },
  [ServiceStatus.DEGRADED_PERFORMANCE]: {
    color: "text-yellow-400",
    label: "Degraded Performance",
    icon:
      `<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"></path>`,
  },
  [ServiceStatus.PARTIAL_OUTAGE]: {
    color: "text-orange-400",
    label: "Partial Outage",
    icon:
      `<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"></path>`,
  },
  [ServiceStatus.MAJOR_OUTAGE]: {
    color: "text-red-400",
    label: "Major Outage",
    icon:
      `<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>`,
  },
};

@customElement("service-row")
export class ServiceRow extends Component {
  @property({ type: Object })
  public service!: Service;

  public override render() {
    const style = STATUS_STYLES[this.service.status];
    const bars = Array(90).fill(null);

    const today = new Date();
    const days = (n: number) =>
      new Date(today.getTime() - n * 86400000).toISOString().split("T")[0];

    return html`
      <div>
        <div class="flex justify-between">
          <div class="group/indicator relative flex items-center gap-2">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-5 ${style.color}"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <g .innerHTML="${style.icon}"></g>
              </svg>
              <span
                class="absolute top-full left-0 z-50 mt-1 block w-max rounded-lg bg-neutral-950/85 px-2 py-1 text-sm leading-normal font-medium text-white shadow-lg ring-1 ring-white/10 backdrop-blur-lg backdrop-invert ring-inset group-[:not(:hover)]/indicator:sr-only lg:-top-1 lg:-left-1 lg:mt-0 lg:-translate-x-full"
              >${style.label}</span>
            </span>
            <p class="font-medium text-white">${this.service.name}</p>
          </div>
          <div class="flex items-baseline gap-4">
            ${this.service.metrics.map((metric) =>
              html`
                <p class="hidden text-white sm:block">~${metric.percentile(
                  50,
                  1,
                )
                  .toFixed(
                    1,
                  )} ms</p>
              `
            )}
            <p class="${this.service.status === ServiceStatus.OPERATIONAL
              ? "text-emerald-400"
              : "text-neutral-300"}">100% uptime</p>
          </div>
        </div>
        <div
          class="mt-2 grid h-8 grid-cols-30 overflow-hidden rounded-sm sm:grid-cols-60 md:grid-cols-90 text-neutral-900 *:border-r *:last:border-r-0 [&>*:not(:nth-last-child(-n+30))]:max-sm:hidden [&>*:not(:nth-last-child(-n+60))]:max-md:hidden"
        >
          ${bars.map(() =>
            html`
              <div class="bg-neutral-800"></div>
            `
          )}
        </div>
        <div class="mt-1 flex justify-between">
          <p class="text-sm text-neutral-400 uppercase">
            <time datetime="${days(90)}" class="sm:hidden">30 days ago</time>
            <time datetime="${days(
              90,
            )}" class="hidden sm:inline md:hidden">60 days
              ago
            </time>
            <time datetime="${days(
              90,
            )}" class="hidden md:inline">90 days ago
            </time>
          </p>
          <p class="text-sm text-neutral-400 uppercase">
            <time datetime="${days(0)}">Today</time>
          </p>
        </div>
      </div>
    `;
  }
}
