import type { GithubIssue } from "../types/types.js";

export function buildPrompt(issues: GithubIssue[]): string {
  return `
You are a Senior Software Engineering Manager.

Analyze the GitHub issues below.

For EACH issue include exactly:

## Issue #<number>

Priority: High | Medium | Low

Summary:

Possible Root Cause:

Recommended Fix:

Estimated Engineering Effort:
Small | Medium | Large

Risk:
Low | Medium | High

----------------------------------

After all issues include:

# Executive Summary

- Total Issues
- High Priority Count
- Medium Priority Count
- Low Priority Count

# Engineering Trends

Mention recurring patterns.

# Overall Repository Health

Give one paragraph.

Return VALID MARKDOWN ONLY.

Issues:

${JSON.stringify(issues, null, 2)}
`;
}