import { ServiceStatus } from "./ServiceStatus";
import { Metric } from "./Metric";

export class Service {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string | null;
  public readonly status: ServiceStatus;
  public readonly metrics: Metric[];
  public readonly started: Date | null;
  public readonly showUptime: boolean;

  public constructor(
    id: string,
    name: string,
    description: string | null,
    status: ServiceStatus,
    metrics: Metric[],
    started: Date | null,
    showUptime: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.metrics = metrics;
    this.started = started;
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
