import { ServiceStatus } from "./ServiceStatus";
import { Metric } from "./Metric";
import { Notice } from "./Notice";

export class Service {
  public readonly id: string;
  public readonly name: string;
  public readonly status: ServiceStatus;
  public readonly metrics: Metric[];
  public readonly notices: Notice[];
  public readonly showUptime: boolean;

  public constructor(
    id: string,
    name: string,
    status: ServiceStatus,
    metrics: Metric[],
    notices: Notice[],
    showUptime: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.metrics = metrics;
    this.notices = notices;
    this.showUptime = showUptime;
  }

  public static parseStatus(status: string): ServiceStatus {
    switch (status) {
      case "OPERATIONAL":
        return ServiceStatus.OPERATIONAL;
      case "UNDERMAINTENANCE":
        return ServiceStatus.UNDER_MAINTENANCE;
      case "DEGRADEDPERFORMANCE":
        return ServiceStatus.DEGRADED_PERFORMANCE;
      case "PARTIALOUTAGE":
        return ServiceStatus.PARTIAL_OUTAGE;
      case "MAJOROUTAGE":
        return ServiceStatus.MAJOR_OUTAGE;
      default:
        throw new Error(`Unknown service status: ${status}`);
    }
  }
}
