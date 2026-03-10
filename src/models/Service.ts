import { ServiceStatus } from "./ServiceStatus";
import { Metric } from "./Metric";

export class Service {
  public readonly id: string;
  public readonly name: string;
  public readonly status: ServiceStatus;
  public readonly metrics: Metric[];

  public constructor(
    id: string,
    name: string,
    status: ServiceStatus,
    metrics: Metric[],
  ) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.metrics = metrics;
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
