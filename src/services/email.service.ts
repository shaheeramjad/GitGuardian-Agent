import {
  SESClient,
  SendEmailCommand,
} from "@aws-sdk/client-ses";

import { loadConfig } from "../config/loader.js";
import { marked } from "marked";

export async function sendEmail(report: string) {
  const cfg = await loadConfig();

  const region = cfg["/gitguardian/aws/region"] ?? process.env.AWS_REGION ?? "us-east-1";
  const emailFrom = cfg["/gitguardian/email/from"] ?? process.env.EMAIL_FROM ?? "";
  const emailTo = cfg["/gitguardian/email/to"] ?? process.env.EMAIL_TO ?? "";

  const client = new SESClient({ region });

  const command = new SendEmailCommand({
    Source: emailFrom,

    Destination: {
      ToAddresses: [emailTo],
    },

    Message: {
      Subject: {
        Data: `GitGuardian • Daily Engineering Report • ${new Date().toDateString()}`,
      },

      Body: {
        Html: {
          Data: await marked(report),
        },

        Text: {
          Data: report,
        },
      },
    },
  });

  return client.send(command);
}