import { NoticeUpdate } from "./NoticeUpdate";
import { BaseComponent } from "./BaseComponent";

export interface Notice {
  id: string;
  name: { default: string };
  status: string;
  components: BaseComponent[];
  updates: NoticeUpdate[];
}
