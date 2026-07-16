import type { GithubIssue, DailyReport } from "../types/types.js";
import { getGithubIssues } from "./github.service.js";
import { buildPrompt } from "../prompts/github.prompt.js";
import { summarizeIssues } from "./bedrock.service.js";
import { saveReport } from "../utils/report.js";
import { sendEmail } from "./email.service.js";
import { Logger } from "../utils/logger.js";

export default class GitGuardianService {
  async run(): Promise<DailyReport | null> {
    const start = Date.now();

    try {
      Logger.info("Fetching GitHub issues...");

      const issues: GithubIssue[] = await getGithubIssues();

      Logger.info(`Fetched ${issues.length} issue(s).`);

      if (issues.length === 0) {
        Logger.info("No issues updated in the last 24 hours.");
        return null;
      }

      Logger.info("Building AI prompt...");

      const prompt = buildPrompt(issues);

      Logger.info("Calling Amazon Bedrock...");

      const markdown = await summarizeIssues(prompt);

      Logger.info("Saving report...");

      await saveReport(markdown);

      Logger.info("Sending email...");

      await sendEmail(markdown);

      Logger.info("Report delivered successfully.");

      return {
        generatedAt: new Date().toISOString(),
        markdown,
      };
    } catch (error) {
      Logger.error("GitGuardian service failed.", error);
      throw error;
    } finally {
      Logger.info(`Execution completed in ${Date.now() - start} ms`);
    }
  }
}