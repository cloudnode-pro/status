import { BaseComponent } from "../api/BaseComponent";
import { NoticeStatus } from "./NoticeStatus";
import { Notice } from "./Notice";
import { NoticeUpdate } from "./NoticeUpdate";
import { ServiceStatus } from "./ServiceStatus";

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
}
