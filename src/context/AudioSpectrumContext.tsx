import React from "react";
import * as THREE from "three";

type AudioSpectrumContextValue = {
    texture: THREE.DataTexture | null;
    /** Number of frequency bins (texture width). */
    size: number;
    isConnected: boolean;
    attachMediaElement: (el: HTMLMediaElement | null) => void;
    resume: () => Promise<void>;
    detach: () => void;
};

const AudioSpectrumContext =
    React.createContext<AudioSpectrumContextValue | null>(null);

const getAudioContextCtor = () => {
    if (typeof window === "undefined") return null;
    const w = window as unknown as {
        AudioContext?: typeof AudioContext;
        webkitAudioContext?: typeof AudioContext;
    };
    return w.AudioContext ?? w.webkitAudioContext ?? null;
};

export const AudioSpectrumProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [texture, setTexture] = React.useState<THREE.DataTexture | null>(
        null,
    );
    const [size, setSize] = React.useState(0);
    const [isConnected, setIsConnected] = React.useState(false);

    const mediaElRef = React.useRef<HTMLMediaElement | null>(null);
    const audioCtxRef = React.useRef<AudioContext | null>(null);
    const sourceRef = React.useRef<MediaElementAudioSourceNode | null>(null);
    const analyserRef = React.useRef<AnalyserNode | null>(null);
    const dataRef = React.useRef<Uint8Array<ArrayBuffer> | null>(null);
    const textureRef = React.useRef<THREE.DataTexture | null>(null);
    const rafRef = React.useRef<number | null>(null);

    const stopRaf = React.useCallback(() => {
        if (rafRef.current == null) return;
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
    }, []);

    const detach = React.useCallback(() => {
        if (typeof window !== "undefined") stopRaf();

        setIsConnected(false);
        mediaElRef.current = null;

        try {
            sourceRef.current?.disconnect();
        } catch {
            // no-op
        }
        try {
            analyserRef.current?.disconnect();
        } catch {
            // no-op
        }

        sourceRef.current = null;
        analyserRef.current = null;
        dataRef.current = null;

        setTexture((prev) => {
            prev?.dispose();
            return null;
        });
        textureRef.current = null;
        setSize(0);

        const ctx = audioCtxRef.current;
        audioCtxRef.current = null;
        if (ctx) {
            void ctx.close().catch(() => {
                // no-op
            });
        }
    }, [stopRaf]);

    const ensureAudioContext = React.useCallback(() => {
        if (audioCtxRef.current) return audioCtxRef.current;
        const Ctor = getAudioContextCtor();
        if (!Ctor) return null;
        try {
            const ctx = new Ctor();
            audioCtxRef.current = ctx;
            return ctx;
        } catch {
            return null;
        }
    }, []);

    const startRaf = React.useCallback(() => {
        if (typeof window === "undefined") return;
        if (rafRef.current != null) return;

        const tick = () => {
            const analyser = analyserRef.current;
            const data = dataRef.current;
            const tex = textureRef.current;

            if (analyser && data && tex) {
                try {
                    analyser.getByteFrequencyData(data);
                    tex.needsUpdate = true;
                } catch {
                    // no-op
                }
            }

            rafRef.current = window.requestAnimationFrame(tick);
        };

        rafRef.current = window.requestAnimationFrame(tick);
    }, []);

    const attachMediaElement = React.useCallback(
        (el: HTMLMediaElement | null) => {
            if (typeof window === "undefined") return;
            if (!el) {
                detach();
                return;
            }

            if (mediaElRef.current === el && isConnected) return;

            // Reset any previous graph/texture.
            detach();
            mediaElRef.current = el;

            const ctx = ensureAudioContext();
            if (!ctx) return;

            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256; // => 128 bins; keep it cheap for mobile
            analyser.smoothingTimeConstant = 0.8;

            let source: MediaElementAudioSourceNode;
            try {
                source = ctx.createMediaElementSource(el);
            } catch {
                // Can happen if we try to attach the same element twice in a single context.
                // Fall back to a fresh context on next attach.
                return;
            }

            source.connect(analyser);
            analyser.connect(ctx.destination);

            const binCount = analyser.frequencyBinCount;
            // TS (DOM lib) can be picky about ArrayBuffer vs ArrayBufferLike.
            // Back it with a concrete ArrayBuffer for compatibility.
            const data = new Uint8Array(new ArrayBuffer(binCount));

            const spectrumTex = new THREE.DataTexture(
                data,
                binCount,
                1,
                THREE.RedFormat,
                THREE.UnsignedByteType,
            );
            spectrumTex.flipY = false;
            spectrumTex.generateMipmaps = false;
            spectrumTex.minFilter = THREE.LinearFilter;
            spectrumTex.magFilter = THREE.LinearFilter;
            spectrumTex.wrapS = THREE.ClampToEdgeWrapping;
            spectrumTex.wrapT = THREE.ClampToEdgeWrapping;
            spectrumTex.unpackAlignment = 1;
            spectrumTex.colorSpace = THREE.NoColorSpace;
            spectrumTex.needsUpdate = true;

            sourceRef.current = source;
            analyserRef.current = analyser;
            dataRef.current = data;
            textureRef.current = spectrumTex;

            setTexture(spectrumTex);
            setSize(binCount);
            setIsConnected(true);

            startRaf();
        },
        [detach, ensureAudioContext, isConnected, startRaf],
    );

    const resume = React.useCallback(async () => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        if (ctx.state === "running") return;
        try {
            await ctx.resume();
        } catch {
            // no-op
        }
    }, []);

    React.useEffect(() => {
        return () => {
            detach();
        };
    }, [detach]);

    const value = React.useMemo<AudioSpectrumContextValue>(
        () => ({
            texture,
            size,
            isConnected,
            attachMediaElement,
            resume,
            detach,
        }),
        [texture, size, isConnected, attachMediaElement, resume, detach],
    );

    return (
        <AudioSpectrumContext.Provider value={value}>
            {children}
        </AudioSpectrumContext.Provider>
    );
};

export const useAudioSpectrum = () => {
    const ctx = React.useContext(AudioSpectrumContext);
    if (!ctx) {
        throw new Error(
            "useAudioSpectrum must be used within AudioSpectrumProvider",
        );
    }
    return ctx;
};
