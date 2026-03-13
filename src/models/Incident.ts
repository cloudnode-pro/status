import { BaseComponent } from "../api/BaseComponent";
import { NoticeStatus } from "./NoticeStatus";
import { Notice } from "./Notice";
import { NoticeUpdate } from "./NoticeUpdate";
import { ServiceStatus } from "./ServiceStatus";

export class Incident extends Notice {
  public constructor(
    id: string,
    name: string,
    components: BaseComponent[],
    updates: NoticeUpdate[],
    status: NoticeStatus,
    started: Date,
    resolved: Date | null,
    impact: ServiceStatus,
  ) {
    super(id, name, components, updates, status, started, resolved, impact);
  }

  public static parseStatus(status: string): NoticeStatus {
    switch (status) {
      case "INVESTIGATING":
        return NoticeStatus.INCIDENT_INVESTIGATING;
      case "IDENTIFIED":
        return NoticeStatus.INCIDENT_IDENTIFIED;
      case "MONITORING":
        return NoticeStatus.INCIDENT_MONITORING;
      case "RESOLVED":
        return NoticeStatus.INCIDENT_RESOLVED;
      default:
        throw new Error(`Unknown incident status: ${status}`);
    }
  }
}
