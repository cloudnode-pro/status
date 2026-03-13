import { BaseComponent } from "../api/BaseComponent";
import { NoticeStatus } from "./NoticeStatus";
import { Notice } from "./Notice";
import { NoticeUpdate } from "./NoticeUpdate";

export class Incident extends Notice {
  public readonly status: NoticeStatus;
  public readonly started: Date;
  public readonly resolved: Date | null;
  public readonly impact: string;

  public constructor(
    id: string,
    name: string,
    components: BaseComponent[],
    updates: NoticeUpdate[],
    status: NoticeStatus,
    started: Date,
    resolved: Date | null,
    impact: string,
  ) {
    super(id, name, components, updates);
    this.status = status;
    this.started = started;
    this.resolved = resolved;
    this.impact = impact;
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
