
export interface GeneratedCode {
  html: string;
  css: string;
  js: string;
  fullHtml: string;
}

export interface BuildHistory {
  id: string;
  prompt: string;
  timestamp: number;
  code: GeneratedCode;
}

export enum AppStatus {
  IDLE = 'IDLE',
  BUILDING = 'BUILDING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}
