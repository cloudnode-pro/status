import { BaseComponent } from "../api/BaseComponent";
import { NoticeStatus } from "./NoticeStatus";
import { Notice } from "./Notice";
import { NoticeUpdate } from "./NoticeUpdate";

export class Maintenance extends Notice {
  public readonly status: NoticeStatus;
  public readonly start: Date;
  public readonly end: Date;
  public readonly duration: number;

  public constructor(
    id: string,
    name: string,
    components: BaseComponent[],
    updates: NoticeUpdate[],
    status: NoticeStatus,
    start: Date,
    end: Date,
    duration: number,
  ) {
    super(id, name, components, updates);
    this.status = status;
    this.start = start;
    this.end = end;
    this.duration = duration;
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
