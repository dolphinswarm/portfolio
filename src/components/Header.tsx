import Link from "next/link";
import React from "react";
import { pages } from "@/utils/consts";

export const Header = () => {
    return (
        <header>
            {pages.map((page) => (
                <h1 key={page}>
                    <Link href={`/${page}`}>{page}</Link>
                </h1>
            ))}
        </header>
    );
};
