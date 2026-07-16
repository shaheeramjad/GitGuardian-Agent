import {
  GetParametersCommand,
  SSMClient,
} from "@aws-sdk/client-ssm";

const client = new SSMClient({
  region: process.env.AWS_REGION ?? "us-east-1",
});

let cache: Record<string, string> | null = null;

export async function loadConfig() {
  if (cache) return cache;

  const command = new GetParametersCommand({
    Names: [
      "/gitguardian/github/token",
      "/gitguardian/github/owner",
      "/gitguardian/github/repo",
      "/gitguardian/email/from",
      "/gitguardian/email/to",
      "/gitguardian/bedrock/model",
    ],
    WithDecryption: true,
  });

  const result = await client.send(command);

  cache = {};

  for (const p of result.Parameters ?? []) {
    cache[p.Name!] = p.Value!;
  }

  return cache;
}