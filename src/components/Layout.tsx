import { Header } from "./Header";
import { Footer } from "./Footer";
import { Base3DScene } from "./3D/Base";
import { useGetRouterSceneProps } from "@/hooks/useGetRouterSceneProps";
import { useSceneVideo } from "@/context/SceneVideoContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const sceneProps = useGetRouterSceneProps();
    const { videoSrcOverride } = useSceneVideo();
    return (
        <>
            <Header />
            <main>
                {children}
                <Base3DScene
                    {...sceneProps}
                    videoSrc={videoSrcOverride ?? sceneProps.videoSrc}
                />
            </main>
            <Footer />
        </>
    );
};

export default Layout;
