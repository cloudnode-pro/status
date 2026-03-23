export interface NoticeUpdate {
  id: string;
  started: string;
  status: string;
  message: { default: string } | string;
  attachments: string[];
}
