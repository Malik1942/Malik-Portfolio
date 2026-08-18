// No line of copy may end with a single word alone. Glue the last two words of
// a block with a no-break space so the final line always carries at least two,
// at every viewport width. CSS `text-wrap: pretty` / `balance` (see index.css)
// does the same job more gracefully where the browser supports it; this is the
// guarantee underneath. Runs before markdown emphasis is parsed, so a trailing
// `**` rides along with the last word.
export function noOrphan(text: string): string {
  return text.replace(/(\S)[ \t]+(\S+)\s*$/, "$1 $2");
}
