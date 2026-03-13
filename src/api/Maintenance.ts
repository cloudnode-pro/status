import { Notice } from "./Notice";

export interface Maintenance extends Notice {
  start: string;
  end: string;
  duration: number;
}
