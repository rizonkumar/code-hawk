import { reviewPullRequest } from "@/module/ai/actions";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = request.headers.get("x-github-event");
    if (event === "ping") {
      return NextResponse.json({
        message: "pong",
        status: 200,
      });
    }

    if (event === "pull_request") {
      const action = body.action;
      const repo = body.repository.full_name;
      const pullRequestNumber = body.number;

      const [owner, repoName] = repo.split("/");

      if (action === "opened" || action === "synchronize") {
        reviewPullRequest(owner, repoName, pullRequestNumber)
          .then(() => {
            console.log(
              `Pull Request Processed Successfully for ${owner}/${repoName}#${pullRequestNumber}`
            );
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    return NextResponse.json({
      message: "Event Processed Successfully",
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Internal Server Error",
      status: 500,
    });
  }
}
