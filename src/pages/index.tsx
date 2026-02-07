import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.scss";

const Home = () => {
    return (
        <>
            <Head>
                <title>Brad Schmitz</title>
                <meta
                    name="description"
                    content="Portofolio site for Brad Schmitz, a creative developer specializing in interactive 3D experiences and audio-reactive visuals."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon/favicon.ico" />
            </Head>
        </>
    );
};

export default Home;
