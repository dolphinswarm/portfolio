import { Html, Head, Main, NextScript } from "next/document";
import { cabin, indieFlower } from "@/styles/fonts";

export default function Document() {
    return (
        <Html lang="en" className={`${cabin.variable} ${indieFlower.variable}`}>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, viewport-fit=cover"
                />
                <meta name="darkreader-lock" />
                <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
                <link rel="shortcut icon" href="/favicon/favicon.ico" />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon/favicon-16x16.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/favicon/apple-touch-icon.png"
                />
                <link rel="manifest" href="/favicon/site.webmanifest" />
            </Head>
            <body className={cabin.className}>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
