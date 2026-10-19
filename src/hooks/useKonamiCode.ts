import React from "react";
import { useRouter } from "next/router";

const KONAMI_CODE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
] as const;

export const useKonamiCode = (
    onComplete?: () => void,
    navigateTo: string = "/bork",
) => {
    const router = useRouter();
    // A ref, not state: nothing renders from it, and navigating from inside a
    // state updater can fire twice in StrictMode.
    const inputSequenceRef = React.useRef<string[]>([]);

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const newSequence = [...inputSequenceRef.current, event.key].slice(
                -KONAMI_CODE.length,
            );
            if (newSequence.join("") === KONAMI_CODE.join("")) {
                inputSequenceRef.current = [];
                onComplete?.();
                void router.push(navigateTo);
                return;
            }
            inputSequenceRef.current = newSequence;
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [navigateTo, onComplete, router]);
};