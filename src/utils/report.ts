import fs from "fs/promises";
import dayjs from "dayjs";

export async function saveReport(markdown: string) {
  const date = dayjs().format("YYYY-MM-DD");

  const filename = `reports/${date}.md`;

  // Ensure the reports directory exists
  await fs.mkdir("reports", { recursive: true });

  await fs.writeFile(filename, markdown);

  return filename;
}