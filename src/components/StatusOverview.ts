import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Component } from "./Component";
import { MainStatus } from "../models/MainStatus";
import { Services } from "../models/Services";
import { Service } from "../models/Service";

@customElement("status-overview")
export class StatusOverview extends Component {
  static readonly STYLES: Record<MainStatus, {
    bg: string;
    color: string;
    icon: string;
    message: string | ((service: Service) => string);
  }> = {
    [MainStatus.UP]: {
      bg: "bg-emerald-400/5 ring-emerald-400/5",
      color: "fill-emerald-400",
      icon:
        `<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>`,
      message: "All systems operational",
    },
    [MainStatus.ONE_UNDER_MAINTENANCE]: {
      bg: "bg-indigo-400/5 ring-indigo-400/5",
      color: "fill-indigo-400",
      icon:
        `<path d="M128 24a104 104 0 1 0 104 104A104.13 104.13 0 0 0 128 24m14.052 54.734a34.2 34.2 0 0 1 9.427 1.006 3.79 3.79 0 0 1 1.865 6.25l-17.76 19.265 2.682 12.485 12.484 2.677 19.266-17.782a3.79 3.79 0 0 1 6.25 1.865 34.4 34.4 0 0 1 1.02 8.333 34.122 34.122 0 0 1-47.833 31.282l-24.672 28.536a4 4 0 0 1-.187.203 15.168 15.168 0 0 1-21.448-21.453q.098-.095.203-.182l28.542-24.667a34.155 34.155 0 0 1 30.161-47.818" />`,
      message: (s) => `${s.name} under maintenance`,
    },
    [MainStatus.ONE_DEGRADED_PERFORMANCE]: {
      bg: "bg-yellow-400/5 ring-yellow-400/5",
      color: "fill-yellow-400",
      icon:
        `<path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"></path>`,
      message: (s) => `${s.name} experiencing degraded performance`,
    },
    [MainStatus.ONE_PARTIAL_OUTAGE]: {
      bg: "bg-orange-400/5 ring-orange-400/5",
      color: "fill-orange-400",
      icon:
        `<path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"></path>`,
      message: (s) => `${s.name} experiencing partial outage`,
    },
    [MainStatus.ONE_MAJOR_OUTAGE]: {
      bg: "bg-red-400/5 ring-red-400/5",
      color: "fill-red-400",
      icon:
        `<path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM165.66,154.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>`,
      message: (s) => `${s.name} experiencing major outage`,
    },
    [MainStatus.SOME_UNDER_MAINTENANCE]: {
      bg: "bg-indigo-400/5 ring-indigo-400/5",
      color: "fill-indigo-400",
      icon:
        `<path d="M128 24a104 104 0 1 0 104 104A104.13 104.13 0 0 0 128 24m14.052 54.734a34.2 34.2 0 0 1 9.427 1.006 3.79 3.79 0 0 1 1.865 6.25l-17.76 19.265 2.682 12.485 12.484 2.677 19.266-17.782a3.79 3.79 0 0 1 6.25 1.865 34.4 34.4 0 0 1 1.02 8.333 34.122 34.122 0 0 1-47.833 31.282l-24.672 28.536a4 4 0 0 1-.187.203 15.168 15.168 0 0 1-21.448-21.453q.098-.095.203-.182l28.542-24.667a34.155 34.155 0 0 1 30.161-47.818" />`,
      message: "System under maintenance",
    },
    [MainStatus.SOME_DEGRADED_PERFORMANCE]: {
      bg: "bg-yellow-400/5 ring-yellow-400/5",
      color: "fill-yellow-400",
      icon:
        `<path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"></path>`,
      message: "Experiencing partially degraded performance",
    },
    [MainStatus.SOME_PARTIAL_OUTAGE]: {
      bg: "bg-orange-400/5 ring-orange-400/5",
      color: "fill-orange-400",
      icon:
        `<path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"></path>`,
      message: "Experiencing minor outage",
    },
    [MainStatus.SOME_MAJOR_OUTAGE]: {
      bg: "bg-red-400/5 ring-red-400/5",
      color: "fill-red-400",
      icon:
        `<path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM165.66,154.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>`,
      message: "Experiencing partial outage",
    },
    [MainStatus.ALL_UNDER_MAINTENANCE]: {
      bg: "bg-indigo-400/5 ring-indigo-400/5",
      color: "fill-indigo-400",
      icon:
        `<path d="M128 24a104 104 0 1 0 104 104A104.13 104.13 0 0 0 128 24m14.052 54.734a34.2 34.2 0 0 1 9.427 1.006 3.79 3.79 0 0 1 1.865 6.25l-17.76 19.265 2.682 12.485 12.484 2.677 19.266-17.782a3.79 3.79 0 0 1 6.25 1.865 34.4 34.4 0 0 1 1.02 8.333 34.122 34.122 0 0 1-47.833 31.282l-24.672 28.536a4 4 0 0 1-.187.203 15.168 15.168 0 0 1-21.448-21.453q.098-.095.203-.182l28.542-24.667a34.155 34.155 0 0 1 30.161-47.818" />`,
      message: "Under maintenance",
    },
    [MainStatus.ALL_DEGRADED_PERFORMANCE]: {
      bg: "bg-yellow-400/5 ring-yellow-400/5",
      color: "fill-yellow-400",
      icon:
        `<path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"></path>`,
      message: "Experiencing degraded performance",
    },
    [MainStatus.ALL_PARTIAL_OUTAGE]: {
      bg: "bg-orange-400/5 ring-orange-400/5",
      color: "fill-orange-400",
      icon:
        `<path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"></path>`,
      message: "Experiencing partial outage",
    },
    [MainStatus.ALL_MAJOR_OUTAGE]: {
      bg: "bg-red-400/5 ring-red-400/5",
      color: "fill-red-400",
      icon:
        `<path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM165.66,154.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>`,
      message: "Experiencing major outage",
    },
  };

  private readonly services: Promise<Services>;

  @property({ type: String })
  public mainStatus: string = "UP";

  @state()
  private resolvedService: Service | null = null;

  public constructor(mainStatus: string, services: Promise<Services>) {
    super();
    this.mainStatus = mainStatus;
    this.services = services;
  }

  private static parseMainStatus(status: string): MainStatus {
    switch (status) {
      case "UP":
        return MainStatus.UP;
      case "ONEUNDERMAINTENANCE":
        return MainStatus.ONE_UNDER_MAINTENANCE;
      case "ONEDEGRADEDPERFORMANCE":
        return MainStatus.ONE_DEGRADED_PERFORMANCE;
      case "ONEPARTIALOUTAGE":
        return MainStatus.ONE_PARTIAL_OUTAGE;
      case "ONEMAJOROUTAGE":
        return MainStatus.ONE_MAJOR_OUTAGE;
      case "SOMEUNDERMAINTENANCE":
        return MainStatus.SOME_UNDER_MAINTENANCE;
      case "SOMEDEGRADEDPERFORMANCE":
        return MainStatus.SOME_DEGRADED_PERFORMANCE;
      case "SOMEPARTIALOUTAGE":
        return MainStatus.SOME_PARTIAL_OUTAGE;
      case "SOMEMAJOROUTAGE":
        return MainStatus.SOME_MAJOR_OUTAGE;
      case "ALLUNDERMAINTENANCE":
        return MainStatus.ALL_UNDER_MAINTENANCE;
      case "ALLDEGRADEDPERFORMANCE":
        return MainStatus.ALL_DEGRADED_PERFORMANCE;
      case "ALLPARTIALOUTAGE":
        return MainStatus.ALL_PARTIAL_OUTAGE;
      case "ALLMAJOROUTAGE":
        return MainStatus.ALL_MAJOR_OUTAGE;
      default:
        throw new Error(`Unknown main status: ${status}`);
    }
  }

  public override async connectedCallback() {
    super.connectedCallback();
    const status = StatusOverview.parseMainStatus(this.mainStatus);
    if (
      status >= MainStatus.ONE_UNDER_MAINTENANCE &&
      status <= MainStatus.ONE_MAJOR_OUTAGE
    ) {
      const services = await this.services;
      this.resolvedService = services.mostSevere();
    }
  }

  public override render() {
    const status = StatusOverview.parseMainStatus(this.mainStatus);
    const style = StatusOverview.STYLES[status];
    const message = typeof style.message === "function"
      ? (this.resolvedService ? style.message(this.resolvedService) : "")
      : style.message;

    return html`
      <div class="flex items-center justify-center gap-2 p-6 md:px-8 md:py-10">
        <div class="p-2 ${style.bg} rounded-full ring-1 ring-inset">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-6 ${style.color}"
            viewBox="0 0 256 256"
            aria-hidden="true"
            .innerHTML="${style.icon}"
          >
          </svg>
        </div>
        <h2 class="text-lg font-medium text-white md:text-xl">${message}</h2>
      </div>
    `;
  }
}
