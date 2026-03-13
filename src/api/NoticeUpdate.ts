export interface NoticeUpdate {
  id: string;
  started: string;
  status: string;
  message: { default: string };
  attachments: string[];
}
