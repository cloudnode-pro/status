import { BaseComponent } from "./BaseComponent";

export interface SiteComponent extends BaseComponent {
  description: { default: string };
  showUptime: boolean;
  isParent: boolean;
  isCollapsed: boolean;
  archivedAt: string | null;
  startDate: string | null;
  metrics: {
    id: string;
    name: {
      default: string;
    };
    suffix: string;
    active: boolean;
  }[];
  group: null;
  children: SiteComponent[];
}
