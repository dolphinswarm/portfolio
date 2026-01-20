import { Header } from "./Header";
import { Footer } from "./Footer";
import { Base3DScene } from "./3D/Base";
import { useGetRouterSceneProps } from "@/hooks/useGetRouterSceneProps";
import { useSceneVideo } from "@/context/SceneVideoContext";
import styles from "@/styles/Layout.module.scss";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const sceneProps = useGetRouterSceneProps();
    const { mediaOverride } = useSceneVideo();
    return (
        <div className={styles.shell}>
            <Header />
            <main className={styles.main}>
                {children}
                <Base3DScene
                    {...sceneProps}
                    media={mediaOverride ?? sceneProps.media}
                />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
