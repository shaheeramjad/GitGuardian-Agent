import { SSMClient, GetParametersByPathCommand } from "@aws-sdk/client-ssm";

export async function loadConfig(): Promise<Record<string, string>> {
  const region = process.env.AWS_REGION ?? "us-east-1";
  const client = new SSMClient({ region });

  const defaults: Record<string, string> = {
    "/gitguardian/github/token": process.env.GITHUB_TOKEN ?? "",
    "/gitguardian/github/owner": process.env.GITHUB_OWNER ?? "",
    "/gitguardian/github/repo": process.env.GITHUB_REPO ?? "",
    "/gitguardian/email/from": process.env.EMAIL_FROM ?? "",
    "/gitguardian/email/to": process.env.EMAIL_TO ?? "",
    "/gitguardian/bedrock/modelId": process.env.BEDROCK_MODEL_ID ?? "amazon.nova-lite-v1:0",
  };

  try {
    const cmd = new GetParametersByPathCommand({
      Path: "/gitguardian",
      Recursive: true,
      WithDecryption: true,
    });

    const resp = await client.send(cmd);

    const out: Record<string, string> = { ...defaults };

    for (const p of resp.Parameters ?? []) {
      if (p.Name && p.Value) {
        out[p.Name] = p.Value;
      }
    }

    return out;
  } catch (err) {
    // If SSM fails (no creds or access), fall back to env-based defaults
    return defaults;
  }
}
