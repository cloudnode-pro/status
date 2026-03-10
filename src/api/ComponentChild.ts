export interface ComponentChild {
  id: string;
  name: { default: string };
  description: { default: string };
  status: string;
  order: number;
  showUptime: boolean;
  archivedAt: string | null;
  startDate: string | null;
}
