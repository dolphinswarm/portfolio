import React from "react";
import type { ThreeElements } from "@react-three/fiber";
import { PillarEnergyMaterial } from "./PillarEnergyMaterial";
import { useVideoPalette } from "@/hooks/useVideoPalette";

export type PillarsProps = {
    count?: number;
    startZ?: number;
    endZ?: number;
    xOffset?: number;
    y?: number;
    size?: [number, number, number];
    sourceVideo?: HTMLVideoElement | null;
} & Omit<ThreeElements["group"], "children">;

/** Simple cube pillars on both sides of the screen extending backwards. */
export const Pillars = ({
    count = 3,
    startZ = -1.5,
    endZ = -14,
    xOffset = 3.8,
    y = 1.3,
    size = [0.8, 2.6, 0.8],
    sourceVideo = null,
    ...groupProps
}: PillarsProps) => {
    const step = count <= 1 ? 0 : (endZ - startZ) / (count - 1);

    const palette = useVideoPalette(sourceVideo, {
        sampleSize: 16,
        fps: 12,
        smoothing: 0.22,
    });
    const colorA = palette.average;
    const colorB = palette.vibrant;

    return (
        <group {...groupProps}>
            {Array.from({ length: count }).map((_, index) => {
                const z = startZ + step * index;
                return (
                    <React.Fragment key={index}>
                        <mesh position={[-xOffset, y, z]}>
                            <boxGeometry args={size} />
                            <PillarEnergyMaterial
                                seed={index * 10 + 1}
                                intensity={1.5}
                                speed={0.6}
                                colorA={colorA}
                                colorB={colorB}
                            />
                        </mesh>
                        <mesh position={[xOffset, y, z]}>
                            <boxGeometry args={size} />
                            <PillarEnergyMaterial
                                seed={index * 10 + 2}
                                intensity={1.5}
                                speed={0.6}
                                colorA={colorA}
                                colorB={colorB}
                            />
                        </mesh>
                    </React.Fragment>
                );
            })}
        </group>
    );
};
