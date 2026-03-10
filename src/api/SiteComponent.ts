import { ComponentChild } from "./ComponentChild";

export interface SiteComponent {
  id: string;
  name: { default: string };
  description: { default: string };
  status: string;
  order: number;
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
  children: ComponentChild[];
}
