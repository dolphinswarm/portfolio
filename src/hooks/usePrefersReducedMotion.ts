import React from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
    const mql = window.matchMedia?.(QUERY);
    mql?.addEventListener?.("change", onChange);
    return () => mql?.removeEventListener?.("change", onChange);
};

const getSnapshot = () => window.matchMedia?.(QUERY).matches ?? false;

// The server can't know the visitor's setting; assume motion until hydrated.
const getServerSnapshot = () => false;

/**
 * Whether the visitor has asked their OS/browser to reduce motion. Updates
 * live if they change the setting while the page is open.
 */
export const usePrefersReducedMotion = () =>
    React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
