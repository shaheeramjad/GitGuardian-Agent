import axios from "axios";
import { loadConfig } from "../config/loader.js";
import { Logger } from "../utils/logger.js";
import type { GithubIssue } from "../types/types.js";

export async function getGithubIssues(): Promise<GithubIssue[]> {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const cfg = await loadConfig();

  const owner = cfg["/gitguardian/github/owner"];
  const repo = cfg["/gitguardian/github/repo"];
  const token = cfg["/gitguardian/github/token"];

  const missing: string[] = [];
  if (!token) missing.push("/gitguardian/github/token");
  if (!owner) missing.push("/gitguardian/github/owner");
  if (!repo) missing.push("/gitguardian/github/repo");

  if (missing.length > 0) {
    const msg = `Missing GitHub configuration: ${missing.join(", ")}`;
    Logger.error(msg);
    throw new Error(msg);
  }

  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/issues?state=all&sort=updated&direction=desc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  return response.data
    .filter((issue: any) => !issue.pull_request)
    .filter((issue: any) => {
      return new Date(issue.updated_at) >= yesterday;
    })
    .map((issue: any) => ({
      number: issue.number,
      title: issue.title,
      body: issue.body ?? "",
      url: issue.html_url,
      author: issue.user.login,
      labels: issue.labels.map((l: any) => l.name),
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
    }));
}