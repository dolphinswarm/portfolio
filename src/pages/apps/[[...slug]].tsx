import {
    ShowcasePage,
    getShowcaseStaticPaths,
    getShowcaseStaticProps,
    type ShowcasePageProps,
} from "@/components/Showcase/ShowcasePage";
import { APPS_ITEMS } from "@/data/apps";
import { SECTIONS } from "@/data/sections";

const Apps = ({ slug }: ShowcasePageProps) => (
    <ShowcasePage section={SECTIONS.apps} items={APPS_ITEMS} slug={slug} />
);

export const getStaticPaths = getShowcaseStaticPaths(APPS_ITEMS);
export const getStaticProps = getShowcaseStaticProps;

export default Apps;
