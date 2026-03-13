import { Notice } from "./Notice";

export interface Maintenance extends Notice {
  start: string;
  resolved: string;
  duration: number;
}
