import { inngest } from "../client";
import {
  getPullRequestDiff,
  postReviewComment,
} from "@/module/github/lib/github";
import { retrieveContext } from "@/module/ai/lib/rag";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import prisma from "@/lib/db";

export const generateReview = inngest.createFunction(
  { id: "generate-review", concurrency: 5 },
  { event: "pr.review.requested" },

  async ({ event, step }) => {
    const { owner, repoName, pullRequestNumber, userId } = event.data;

    const { diff, title, description, token } = await step.run(
      "fetch-pr-data",
      async () => {
        const account = await prisma.account.findFirst({
          where: {
            userId: userId,
            providerId: "github",
          },
        });

        if (!account?.accessToken) {
          throw new Error("No GitHub access token found");
        }

        const data = await getPullRequestDiff(
          account.accessToken,
          owner,
          repoName,
          pullRequestNumber
        );
        return { ...data, token: account.accessToken };
      }
    );

    const context = await step.run("retrieve-context", async () => {
      const query = `${title}\n${description}`;

      return await retrieveContext(query, `${owner}/${repoName}`, 5);
    });

    const review = await step.run("generate-ai-review", async () => {
      const prompt = `You are a senior software engineer and expert code reviewer with deep expertise in software architecture, security, performance optimization, and best practices. Your task is to provide a thorough, actionable, and constructive code review.

## Pull Request Information
**Title:** ${title}
**Description:** ${description || "No description provided"}

## Relevant Codebase Context
${
  context.length > 0 ? context.join("\n\n") : "No additional context available."
}

## Code Changes (Diff)
\`\`\`diff
${diff}
\`\`\`

---

## Your Review Must Include:

### 1. 📝 Walkthrough
Provide a **file-by-file breakdown** of the changes:
- What each file modification does
- How the changes relate to each other
- The overall purpose and impact of the PR

### 2. 🔄 Sequence Diagram
Create a **Mermaid JS sequence diagram** showing the flow of the changes (if applicable).
\`\`\`mermaid
sequenceDiagram
    participant A as Component
    participant B as Service
    A->>B: Request
    B-->>A: Response
\`\`\`
**Rules for the diagram:**
- Use simple, descriptive participant names (no special characters)
- Keep labels short and alphanumeric (avoid quotes, braces, parentheses)
- Only include if the changes involve meaningful interactions
- If not applicable, write "N/A - Changes do not involve sequential interactions"

### 3. 📋 Summary
A **2-3 sentence overview** of what this PR accomplishes and its significance.

### 4. ✅ Strengths
Highlight what's done **well**:
- Good design patterns used
- Clean code practices
- Proper error handling
- Good test coverage (if applicable)
- Performance considerations

### 5. 🚨 Issues & Concerns
Identify problems with **severity levels**:

| Severity | Icon | Description |
|----------|------|-------------|
| Critical | 🔴 | Bugs, security vulnerabilities, data loss risks |
| Major | 🟠 | Performance issues, architectural concerns, missing error handling |
| Minor | 🟡 | Code smells, style inconsistencies, minor improvements |
| Nitpick | 🔵 | Optional suggestions, personal preferences |

For each issue, provide:
- **Location:** File and line number (if identifiable)
- **Problem:** What's wrong
- **Impact:** Why it matters
- **Solution:** How to fix it with code example if helpful

### 6. 💡 Suggestions for Improvement
Provide **specific, actionable recommendations**:
- Code refactoring opportunities
- Better naming conventions
- Missing edge cases to handle
- Documentation improvements
- Test cases to add

### 7. 🎯 Final Verdict
Give an overall assessment:
- **APPROVE** ✅ - Ready to merge (minor issues at most)
- **REQUEST CHANGES** 🔄 - Needs fixes before merging
- **NEEDS DISCUSSION** 💬 - Architectural/design decisions to discuss

### 8. 🎭 Code Review Poem
End with a **short, creative poem** (4-6 lines) that captures the essence of these changes in a memorable way.

---

**Important Guidelines:**
- Be constructive, not destructive - focus on improving the code
- Acknowledge good work before pointing out issues
- Provide specific examples and code snippets when suggesting fixes
- Consider the context and constraints the author may have faced
- Prioritize issues by severity - focus on what matters most

Format your entire response in clean, well-structured markdown.`;

      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt,
      });

      return text;
    });

    await step.run("post-comment", async () => {
      await postReviewComment(
        token,
        owner,
        repoName,
        pullRequestNumber,
        review
      );
    });

    await step.run("save-review", async () => {
      const repository = await prisma.repository.findFirst({
        where: {
          owner,
          name: repoName,
        },
      });

      if (repository) {
        await prisma.review.create({
          data: {
            repositoryId: repository.id,
            pullRequestNumber,
            pullRequestTitle: title,
            pullRequestURL: `https://github.com/${owner}/${repoName}/pull/${pullRequestNumber}`,
            review,
            status: "completed",
          },
        });
      }
    });
    return { success: true };
  }
);
