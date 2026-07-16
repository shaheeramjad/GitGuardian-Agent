import dotenv from "dotenv";

dotenv.config();

export const config = {
  githubToken: process.env.GITHUB_TOKEN!,
  owner: process.env.GITHUB_OWNER!,
  repo: process.env.GITHUB_REPO!,
  region: process.env.AWS_REGION!,
  emailFrom: process.env.EMAIL_FROM!,
  emailTo: process.env.EMAIL_TO!,
};