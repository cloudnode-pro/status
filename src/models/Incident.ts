import { BaseComponent } from "../api/BaseComponent";
import { NoticeStatus } from "./NoticeStatus";
import { Notice } from "./Notice";
import { NoticeUpdate } from "./NoticeUpdate";
import { ServiceStatus } from "./ServiceStatus";
import { Incident as IncidentAPI } from "../api/Incident";
import { Service } from "./Service";

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

  public static fromAPI(incident: IncidentAPI): Incident {
    return new Incident(
      incident.id,
      typeof incident.name === "string" ? incident.name : incident.name.default,
      incident.components,
      incident.updates.map((u) =>
        new NoticeUpdate(
          u.id,
          new Date(u.started),
          Incident.parseStatus(u.status),
          typeof u.message === "string" ? u.message : u.message.default,
        )
      ),
      Incident.parseStatus(incident.status),
      new Date(incident.started),
      incident.resolved === null ? null : new Date(incident.resolved),
      Service.parseStatus(incident.impact),
    );
  }
}
