import GitGuardianService from "../services/app.service.js";
import { Logger } from "../utils/logger.js";
import type { Context } from "aws-lambda";

async function main(): Promise<void> {
  const service = new GitGuardianService();

  Logger.info("Starting GitGuardian Agent...");

  await service.run();

  Logger.info("GitGuardian Agent completed successfully.");
}

export const handler = async (
  _event: unknown,
  _context: Context
) => {
  try {
    await main();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "GitGuardian Agent completed successfully.",
      }),
    };
  } catch (error) {
    Logger.error("GitGuardian Agent failed.", error);

    throw error; // Let Lambda mark the invocation as failed
  }
};

// Local development
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    Logger.error("Local execution failed.", error);
    process.exit(1);
  });
}