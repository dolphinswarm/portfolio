import * as React from "react";
import Head from "next/head";
import { Showcase, type ShowcaseItem } from "@/components/Showcase/Showcase";
import { useSceneVideo } from "@/context/SceneVideoContext";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const CODE_ITEMS: ShowcaseItem[] = [
  {
    slug: "parkinsons-vr",
    title: "Parkinson's VR Training",
    subtitle: "Virtual reality training sim",
    year: "2021",
    tags: ["Unity", "C#", "VR"],
    links: [
      { label: "GitHub", href: "https://github.com/dolphinswarm/Malone-University-Parkinson-s-VR-Training", icon: faGithub },
    ],
    screenSource: { kind: "video", src: "/branding/videos/code/parkinsons-vr.mp4" },
    thumbnailSource: { kind: "image", src: "/branding/img/code/parkinsons-vr.png" },
    body: (
      <>
        <p>
          A responsive “screen-first” layout: big preview up top on
          mobile, split view on desktop.
        </p>
        <p>
          This card list is meant to be short (≈10 items) and fun to
          browse with your thumb.
        </p>
      </>
    ),
  },
  {
    slug: "vrchery",
    title: "VRchery",
    subtitle: "Virtual reality archery game",
    year: "2019",
    tags: ["Unity", "C#", "VR"],
    links: [
      { label: "GitHub", href: "https://github.com/dolphinswarm/vrchery", icon: faGithub },
    ],
    screenSource: { kind: "image", src: "/branding/img/code/vrchery.png" },
    thumbnailSource: { kind: "image", src: "/branding/img/code/vrchery.png" },
    body: (
      <>
        <p>
          A responsive “screen-first” layout: big preview up top on
          mobile, split view on desktop.
        </p>
        <p>
          This card list is meant to be short (≈10 items) and fun to
          browse with your thumb.
        </p>
      </>
    ),
  },
  {
    slug: "r3f-portfolio",
    title: "3D Portfolio",
    subtitle: "Next.js + R3F",
    year: "2026",
    tags: ["Next.js", "TypeScript", "Three.js"],
    links: [
      { label: "GitHub", href: "https://github.com/", icon: faGithub },
    ],
    screenSource: { kind: "video", src: "/branding/videos/code/r3f-portfolio.mp4" },
    body: (
      <>
        <p>
          A responsive “screen-first” layout: big preview up top on
          mobile, split view on desktop.
        </p>
        <p>
          This card list is meant to be short (≈10 items) and fun to
          browse with your thumb.
        </p>
      </>
    ),
  },
];

const Code = () => {
  const { setMediaOverride, clearMediaOverride } = useSceneVideo();

  const onScreenMediaChange = React.useCallback(
    (media: { sourceType: "video" | "image"; source: string } | null) => {
      setMediaOverride(media);
    },
    [setMediaOverride],
  );

  React.useEffect(() => {
    return () => {
      clearMediaOverride();
    };
  }, [clearMediaOverride]);

  return (
    <>
      <Head>
        <title>Code</title>
        <meta name="description" content="Code projects and experiments." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Showcase
        pageTitle="Code"
        items={CODE_ITEMS}
        queryKey="project"
        onScreenMediaChange={onScreenMediaChange}
      />
    </>
  );
};

export default Code;
