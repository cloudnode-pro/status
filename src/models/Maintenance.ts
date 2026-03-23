import { BaseComponent } from "../api/BaseComponent";
import { NoticeStatus } from "./NoticeStatus";
import { Notice } from "./Notice";
import { NoticeUpdate } from "./NoticeUpdate";
import { ServiceStatus } from "./ServiceStatus";
import { Maintenance as MaintenanceAPI } from "../api/Maintenance";

export class Maintenance extends Notice {
  public override readonly ended: Date;

  public constructor(
    id: string,
    name: string,
    components: BaseComponent[],
    updates: NoticeUpdate[],
    status: NoticeStatus,
    start: Date,
    end: Date,
  ) {
    super(
      id,
      name,
      components,
      updates,
      status,
      start,
      end,
      ServiceStatus.UNDER_MAINTENANCE,
    );
    this.ended = end;
  }

  public static parseStatus(status: string): NoticeStatus {
    switch (status) {
      case "NOTSTARTEDYET":
        return NoticeStatus.MAINTENANCE_NOT_STARTED_YET;
      case "INPROGRESS":
        return NoticeStatus.MAINTENANCE_IN_PROGRESS;
      case "COMPLETED":
        return NoticeStatus.MAINTENANCE_COMPLETED;
      default:
        throw new Error(`Unknown maintenance status: ${status}`);
    }
  }

  public static fromAPI(maintenance: MaintenanceAPI): Maintenance {
    return new Maintenance(
      maintenance.id,
      typeof maintenance.name === "string"
        ? maintenance.name
        : maintenance.name.default,
      maintenance.components,
      maintenance.updates.map((u) =>
        new NoticeUpdate(
          u.id,
          new Date(u.started),
          Maintenance.parseStatus(u.status),
          typeof u.message === "string" ? u.message : u.message.default,
        )
      ),
      Maintenance.parseStatus(maintenance.status),
      new Date(maintenance.start),
      new Date(
        maintenance.resolved === null
          ? new Date(maintenance.start).getTime() +
            (maintenance.duration * 60000)
          : maintenance.resolved,
      ),
    );
  }
}
