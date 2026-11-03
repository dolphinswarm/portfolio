import {
    ShowcasePage,
    getShowcaseStaticPaths,
    getShowcaseStaticProps,
    type ShowcasePageProps,
} from "@/components/Showcase/ShowcasePage";
import { SECTIONS } from "@/data/sections";
import { XR_GAMES_ITEMS } from "@/data/xr-games";

const XRGames = ({ slug }: ShowcasePageProps) => (
    <ShowcasePage
        section={SECTIONS["xr-games"]}
        items={XR_GAMES_ITEMS}
        slug={slug}
    />
);

export const getStaticPaths = getShowcaseStaticPaths(XR_GAMES_ITEMS);
export const getStaticProps = getShowcaseStaticProps;

export default XRGames;
