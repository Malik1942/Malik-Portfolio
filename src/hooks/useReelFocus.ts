import { useEffect, useState, type RefObject } from "react";
import { enterReelFocus } from "@/lib/reelFocus";

/** True while `ref` is the reel card nearest the middle of the viewport, among
 *  every card that has opted in with `enabled`. See lib/reelFocus. */
export function useReelFocus(ref: RefObject<Element | null>, enabled: boolean) {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) {
      setFocused(false);
      return;
    }
    const leave = enterReelFocus(element, (winner) => setFocused(winner === element));
    return () => {
      leave();
      setFocused(false);
    };
  }, [ref, enabled]);

  return focused;
}
