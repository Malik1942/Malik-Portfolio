import process from "node:process";
import { createGithubPublisher } from "./github";
import { publishTokensFromRequest } from "./publish-core";

export async function POST(request: Request): Promise<Response> {
  return publishTokensFromRequest(
    request,
    { passwordHash: process.env.DESIGN_SYSTEM_PUBLISH_PASSWORD_HASH },
    () => createGithubPublisher({
      token: process.env.GITHUB_TOKEN ?? "",
      owner: process.env.GITHUB_OWNER ?? "",
      repo: process.env.GITHUB_REPO ?? "",
    }),
  );
}

export default { fetch: POST };
