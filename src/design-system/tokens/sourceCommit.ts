const GIT_COMMIT_SHA_PATTERN = /^[0-9a-f]{40}$/i;

export function resolveTokenSourceCommit(
  vercelGitCommitSha: string | undefined,
): string {
  const commitSha = vercelGitCommitSha?.trim();
  return commitSha && GIT_COMMIT_SHA_PATTERN.test(commitSha)
    ? commitSha
    : "development";
}
