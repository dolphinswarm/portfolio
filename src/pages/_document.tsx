import { Html, Head, Main, NextScript } from "next/document";
import { cabin, indieFlower } from "@/styles/fonts";

export default function Document() {
    return (
        <Html lang="en" className={`${cabin.variable} ${indieFlower.variable}`}>
            <Head />
            <body className={cabin.className}>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
