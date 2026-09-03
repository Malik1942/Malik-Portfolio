// No line of copy may end with a single word alone. Glue the last two words of
// a block with a no-break space so the final line always carries at least two,
// at every viewport width. CSS `text-wrap: pretty` / `balance` (see index.css)
// does the same job more gracefully where the browser supports it; this is the
// guarantee underneath. Runs before markdown emphasis is parsed, so a trailing
// `**` rides along with the last word.
//
// Short titles (fewer than five words) are left alone: gluing the last pair
// on a three-word card title ("Rules as Contracts") forces "as Contracts"
// onto the second line instead of wrapping at a natural break.
export function noOrphan(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length < 5) return text;
  return text.replace(/(\S)[ \t]+(\S+)\s*$/, "$1 $2");
}
