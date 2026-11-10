import {
    ShowcasePage,
    getShowcaseStaticPaths,
    getShowcaseStaticProps,
    type ShowcasePageProps,
} from "@/components/Showcase/ShowcasePage";
import { INSTALLATION_ITEMS } from "@/data/installations";
import { SECTIONS } from "@/data/sections";

const Installations = ({ slug }: ShowcasePageProps) => (
    <ShowcasePage
        section={SECTIONS.installations}
        items={INSTALLATION_ITEMS}
        slug={slug}
    />
);

export const getStaticPaths = getShowcaseStaticPaths(INSTALLATION_ITEMS);
export const getStaticProps = getShowcaseStaticProps;

export default Installations;
