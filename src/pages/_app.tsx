import Layout from "@/components/Layout";
import "@/styles/globals.scss";
import { SceneVideoProvider } from "@/context/SceneVideoContext";
import { AudioSpectrumProvider } from "@/context/AudioSpectrumContext";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import type { AppProps } from "next/app";

config.autoAddCss = false;

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <SceneVideoProvider>
            <AudioSpectrumProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </AudioSpectrumProvider>
        </SceneVideoProvider>
    );
};

export default App;
