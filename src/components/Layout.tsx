import { Header } from "./Header";
import { Base3DScene } from "./3D/Base";
import { useGetRouterSceneProps } from "@/hooks/useGetRouterSceneProps";
import { useSceneVideo } from "@/context/SceneVideoContext";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import styles from "@/styles/Layout.module.scss";
import { cabin, indieFlower } from "@/styles/fonts";

const Layout = ({ children }: { children: React.ReactNode }) => {
    useKonamiCode();
    const sceneProps = useGetRouterSceneProps();
    const { mediaOverride } = useSceneVideo();
    return (
        <div
            className={`${styles.shell} ${cabin.className} ${cabin.variable} ${indieFlower.variable}`}
        >
            <Header />
            <main className={styles.main}>
                {children}
                <Base3DScene
                    {...sceneProps}
                    media={mediaOverride ?? sceneProps.media}
                />
            </main>
        </div>
    );
};

export default Layout;
