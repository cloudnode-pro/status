import { ServiceStatus } from "./models/ServiceStatus";
import { NoticeStatus } from "./models/NoticeStatus";

export namespace EnumMappings {
  export const SERVICE_STATUS_STYLES: Record<
    ServiceStatus,
    { color: string; bar: string; label: string; icon: string }
  > = {
    [ServiceStatus.OPERATIONAL]: {
      color: "fill-emerald-400",
      bar: "bg-emerald-500",
      label: "Operational",
      icon:
        `<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>`,
    },
    [ServiceStatus.UNDER_MAINTENANCE]: {
      color: "fill-blue-400",
      bar: "bg-blue-400",
      label: "Under maintenance",
      icon:
        `<path d="M128 24a104 104 0 1 0 104 104A104.13 104.13 0 0 0 128 24m14.052 54.734a34.2 34.2 0 0 1 9.427 1.006 3.79 3.79 0 0 1 1.865 6.25l-17.76 19.265 2.682 12.485 12.484 2.677 19.266-17.782a3.79 3.79 0 0 1 6.25 1.865 34.4 34.4 0 0 1 1.02 8.333 34.122 34.122 0 0 1-47.833 31.282l-24.672 28.536a4 4 0 0 1-.187.203 15.168 15.168 0 0 1-21.448-21.453q.098-.095.203-.182l28.542-24.667a34.155 34.155 0 0 1 30.161-47.818" />`,
    },
    [ServiceStatus.DEGRADED_PERFORMANCE]: {
      color: "fill-amber-400",
      bar: "bg-amber-400",
      label: "Degraded performance",
      icon:
        `<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"></path>`,
    },
    [ServiceStatus.PARTIAL_OUTAGE]: {
      color: "fill-orange-400",
      bar: "bg-orange-400",
      label: "Partial outage",
      icon:
        `<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"></path>`,
    },
    [ServiceStatus.MAJOR_OUTAGE]: {
      color: "fill-red-400",
      bar: "bg-red-400",
      label: "Major outage",
      icon:
        `<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>`,
    },
  };

  export const NOTICE_STATUS_NAMES: Record<NoticeStatus, string> = {
    [NoticeStatus.INCIDENT_IDENTIFIED]: "Identified",
    [NoticeStatus.INCIDENT_INVESTIGATING]: "Investigating",
    [NoticeStatus.INCIDENT_MONITORING]: "Monitoring",
    [NoticeStatus.INCIDENT_RESOLVED]: "Resolved",
    [NoticeStatus.MAINTENANCE_NOT_STARTED_YET]: "Planned",
    [NoticeStatus.MAINTENANCE_IN_PROGRESS]: "In progress",
    [NoticeStatus.MAINTENANCE_COMPLETED]: "Completed",
  };
}
