import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { loadConfig } from "../config/loader.js";

export async function summarizeIssues(prompt: string): Promise<string> {
  const cfg = await loadConfig();

  const region = cfg["/gitguardian/aws/region"] ?? process.env.AWS_REGION ?? "us-east-1";
  const modelId = cfg["/gitguardian/bedrock/modelId"];

  const client = new BedrockRuntimeClient({ region });

  const command = new ConverseCommand({
    modelId,

    messages: [
      {
        role: "user",
        content: [
          {
            text: prompt,
          },
        ],
      },
    ],

    inferenceConfig: {
      temperature: 0.2,
      maxTokens: 3000,
    },
  });

  const response = await client.send(command);

  return (
    response.output?.message?.content?.[0]?.text ??
    "No response generated."
  );
}