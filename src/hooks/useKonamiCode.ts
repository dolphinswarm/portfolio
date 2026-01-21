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
    const [inputSequence, setInputSequence] = React.useState<string[]>([]);

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            setInputSequence((prevSequence) => {
                const newSequence = [...prevSequence, event.key].slice(
                    -KONAMI_CODE.length,
                );
                if (newSequence.join("") === KONAMI_CODE.join("")) {
                    onComplete?.();
                    void router.push(navigateTo);
                    return [];
                }
                return newSequence;
            });
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [navigateTo, onComplete, router]);
};