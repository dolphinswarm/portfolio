import { Cabin, Indie_Flower } from "next/font/google";

export const cabin = Cabin({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-cabin",
});

export const indieFlower = Indie_Flower({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-indie",
});
