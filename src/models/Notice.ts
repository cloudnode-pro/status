import { BaseComponent } from "../api/BaseComponent";
import { NoticeUpdate } from "./NoticeUpdate";
import { ServiceStatus } from "./ServiceStatus";
import { NoticeStatus } from "./NoticeStatus";

export abstract class Notice {
  public readonly id: string;
  public readonly name: string;
  public readonly components: BaseComponent[];
  public readonly updates: NoticeUpdate[];
  public readonly status: NoticeStatus;
  public readonly started: Date;
  public readonly ended: Date | null;
  public readonly impact: ServiceStatus;

  public constructor(
    id: string,
    name: string,
    components: BaseComponent[],
    updates: NoticeUpdate[],
    status: NoticeStatus,
    started: Date,
    ended: Date | null,
    impact: ServiceStatus,
  ) {
    this.id = id;
    this.name = name;
    this.components = components;
    this.updates = updates;
    this.status = status;
    this.started = new Date(Math.floor(started.getTime() / 60000) * 60000);
    this.ended = ended === null
      ? null
      : new Date(Math.ceil(ended.getTime() / 60000) * 60000);
    this.impact = impact;
  }

  public get duration(): number {
    return (this.ended?.getTime() ?? Date.now()) - this.started.getTime();
  }
}
