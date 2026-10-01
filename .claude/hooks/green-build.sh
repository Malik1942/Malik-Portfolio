#!/bin/bash
# Stop hook for the green-build rule. Claude Code passes the Stop event
# JSON on stdin. Exit 0 with no output when the suite passes, when
# dependencies are not installed, or when this stop is already the
# continuation of a stop hook (stop_hook_active). On failure, print a
# decision that blocks the stop and hands the command output back.

input=$(cat)

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  exit 0
fi

# Same guard as the hooks guide: once a stop hook has continued the
# turn, allow this stop so a failing check cannot loop until the cap.
stop_hook_active=$(printf '%s' "$input" | node -e '
let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => { raw += chunk; });
process.stdin.on("end", () => {
  let active = false;
  try {
    active = JSON.parse(raw || "{}").stop_hook_active === true;
  } catch {
    active = false;
  }
  process.stdout.write(active ? "true" : "false");
});
')

if [ "$stop_hook_active" = "true" ]; then
  exit 0
fi

root=$(pwd)
while [ ! -f "$root/package.json" ]; do
  parent=$(dirname "$root")
  if [ "$parent" = "$root" ]; then
    exit 0
  fi
  root=$parent
done

# A fresh clone has no install. Skipping is a clean exit, not a failed build.
if [ ! -d "$root/node_modules" ]; then
  exit 0
fi

cd "$root" || exit 0

log=$(mktemp)
trap 'rm -f "$log"' EXIT

# pretest already runs tokens:build and typecheck, so this is the green build.
if npm test >"$log" 2>&1; then
  exit 0
fi

node -e '
const fs = require("fs");
const cap = 12000;
let body = fs.readFileSync(process.argv[1], "utf8");
if (body.length > cap) {
  body = "[earlier output truncated]\n" + body.slice(-cap);
}
const reason =
  "Green build failed. npm test exited non-zero. Its pretest runs tokens:build and typecheck, then vitest. Fix the failure before stopping.\n\n" +
  body;
process.stdout.write(JSON.stringify({ decision: "block", reason }));
' "$log"
