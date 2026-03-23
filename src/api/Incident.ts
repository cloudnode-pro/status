import { Notice } from "./Notice";

export interface Incident extends Notice {
  started: string;
  resolved: string | null;
  duration: number;
  impact: string;
}
