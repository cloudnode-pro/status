import { BaseComponent } from "../api/BaseComponent";
import { NoticeUpdate } from "./NoticeUpdate";

export abstract class Notice {
  public readonly id: string;
  public readonly name: string;
  public readonly components: BaseComponent[];
  public readonly updates: NoticeUpdate[];

  public constructor(
    id: string,
    name: string,
    components: BaseComponent[],
    updates: NoticeUpdate[],
  ) {
    this.id = id;
    this.name = name;
    this.components = components;
    this.updates = updates;
  }
}
