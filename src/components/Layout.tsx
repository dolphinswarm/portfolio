import { Header } from "./Header";
import { Footer } from "./Footer";
import { Base3DScene } from "./3D/Base";
import { useGetRouterSceneProps } from "@/hooks/useGetRouterSceneProps";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const sceneProps = useGetRouterSceneProps();
    return (
        <>
            <Header />
            <main>
                {children}
                <Base3DScene {...sceneProps} />
            </main>
            <Footer />
        </>
    );
};

export default Layout;
