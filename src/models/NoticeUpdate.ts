import { NoticeStatus } from "./NoticeStatus";

export class NoticeUpdate {
  public readonly id: string;
  public readonly started: Date;
  public readonly status: NoticeStatus;
  public readonly message: string;

  public constructor(
    id: string,
    started: Date,
    status: NoticeStatus,
    message: string,
  ) {
    this.id = id;
    this.started = started;
    this.status = status;
    this.message = message;
  }
}
