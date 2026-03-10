import { ServiceStatus } from "./ServiceStatus";

export class Service {
  public readonly id: string;
  public readonly name: string;
  public readonly status: ServiceStatus;

  public constructor(id: string, name: string, status: ServiceStatus) {
    this.id = id;
    this.name = name;
    this.status = status;
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
