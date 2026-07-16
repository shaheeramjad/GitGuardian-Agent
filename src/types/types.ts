export interface GithubIssue {
  number: number;
  title: string;
  body: string;
  url: string;
  author: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DailyReport {
  generatedAt: string;
  markdown: string;
}