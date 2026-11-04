import { ScreenOverlay } from "@/components/ScreenOverlay/ScreenOverlay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBriefcase,
    faToolbox,
    faGraduationCap,
    faShapes,
    faVrCardboard,
    faMusic,
    faBrain,
    faComputer,
    faCat,
    faHandPointer,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import styles from "@/styles/About.module.scss";
import { SEO } from "@/components/SEO";
import { ContactLinks } from "@/components/ContactLinks/ContactLinks";

const About = () => {
    return (
        <>
            <SEO
                title="About Brad Schmitz, Creative Technologist in Denver"
                fullTitle
                description="Background, experience, toolkit, and contact info for Brad Schmitz: creative technologist, software engineer, and musician in Denver, CO, and M.S. Creative Technology & Design student at CU Boulder's ATLAS Institute."
                path="/about"
            />
            <ScreenOverlay
                top={
                    <>
                        <h1 className="visually-hidden">About Brad Schmitz</h1>
                        <p className={styles.introParagraph}>
                            Hello! I'm <strong>Bradley Schmitz</strong> (he/him)
                            - or just Brad if you want fewer syllables. I'm a
                            software engineer, creative technologist, and
                            musician based in Denver, CO. I'm originally from
                            the cornfields of Northwest Ohio, studied at Miami
                            University (Ohio), and previously lived in San
                            Francisco, CA, and Los Angeles, CA. These days I'm
                            also working on my M.S. in Creative Technology &
                            Design at CU Boulder's ATLAS Institute.
                        </p>
                        <p className={styles.introParagraph}>
                            I'm drawn to creative coding and interactive systems
                            - such as virtual/augmented reality, projection
                            mapping, installations, and live visuals - that make
                            light, sound, motion, and space feel responsive and
                            alive. I love seeing where technology, art, and
                            music intersect to create truly immersive and
                            engaging experiences.
                        </p>
                        <ContactLinks />
                    </>
                }
                left={
                    <>
                        <div className={styles.group}>
                            <h2>
                                <span className={styles.sectionHeader}>
                                    <FontAwesomeIcon
                                        className={styles.sectionIcon}
                                        icon={faBrain}
                                    />
                                    Interests
                                </span>
                            </h2>
                            <ul className={styles.iconList}>
                                <li>
                                    <FontAwesomeIcon
                                        className={styles.sectionIcon}
                                        icon={faHandPointer}
                                    />{" "}
                                    Human-computer interaction via web, mobile,
                                    games, etc.
                                </li>
                                <li>
                                    <FontAwesomeIcon
                                        className={styles.sectionIcon}
                                        icon={faComputer}
                                    />{" "}
                                    Creative coding and generative art
                                </li>
                                <li>
                                    <FontAwesomeIcon
                                        className={styles.sectionIcon}
                                        icon={faShapes}
                                    />{" "}
                                    Immersive / interactive installations and
                                    spatial experiences
                                </li>
                                <li>
                                    <FontAwesomeIcon
                                        className={styles.sectionIcon}
                                        icon={faVrCardboard}
                                    />{" "}
                                    Virtual and augmented reality
                                </li>
                                <li>
                                    <FontAwesomeIcon
                                        className={styles.sectionIcon}
                                        icon={faMusic}
                                    />{" "}
                                    Generative and live music/sound design
                                </li>
                                <li>
                                    <FontAwesomeIcon
                                        className={styles.sectionIcon}
                                        icon={faCat}
                                    />{" "}
                                    Cats
                                </li>
                            </ul>
                        </div>
                        <div className={styles.group}>
                            <h2>
                                <span className={styles.sectionHeader}>
                                    <FontAwesomeIcon
                                        className={styles.sectionIcon}
                                        icon={faToolbox}
                                    />
                                    Toolkit
                                </span>
                            </h2>
                            <ul>
                                <li>
                                    <strong>Programming Languages:</strong>{" "}
                                    TypeScript/JavaScript, C#, C/C++, Python,
                                    Java
                                </li>
                                <li>
                                    <strong>Web:</strong> React, Next.js,
                                    NodeJS, HTML/CSS/Sass
                                </li>
                                <li>
                                    <strong>Other Tech:</strong>.NET Framework,
                                    SQL (MySQL/PostgreSQL/Microsoft SQL Server),
                                    git, Perforce
                                </li>
                                <li>
                                    <strong>3D/Creative:</strong> Three.js/R3F,
                                    Unity, Unreal, OpenGL/GLSL, Vulkan,
                                    TouchDesigner, Adobe Suite
                                </li>
                                <li>
                                    <strong>Music/Audio:</strong> Ableton Live,
                                    Max/MSP, Audacity, MIDI
                                </li>
                                <li>
                                    <strong>Instruments:</strong> Saxophone
                                    (alto, tenor, soprano, baritone), guitar
                                    (electric, acoustic, resonator), banjo
                                    (three-finger, clawhammer), bass, piano
                                </li>
                            </ul>
                        </div>
                    </>
                }
                right={
                    <>
                        <div className={styles.group}>
                            <h2>
                                <span className={styles.sectionHeader}>
                                    <FontAwesomeIcon
                                        className={styles.sectionIcon}
                                        icon={faBriefcase}
                                    />
                                    Work Experience
                                </span>
                            </h2>
                            <section
                                className={styles.entryList}
                                aria-label="Work experience"
                            >
                                <article className={styles.entry}>
                                    <header className={styles.entryTop}>
                                        <h3 className={styles.entryTitle}>
                                            ClickTime
                                        </h3>
                                    </header>
                                    <div className={styles.entryBody}>
                                        <p className={styles.entryPrimary}>
                                            Software Engineer{" "}
                                            <span className={styles.entrySep}>
                                                •
                                            </span>
                                            <span className={styles.entryMeta}>
                                                <time dateTime="2023-10">
                                                    Oct 2023
                                                </time>{" "}
                                                - Present
                                            </span>
                                        </p>
                                        <p className={styles.entryPrimary}>
                                            Associate Software Engineer{" "}
                                            <span className={styles.entrySep}>
                                                •
                                            </span>
                                            <span className={styles.entryMeta}>
                                                <time dateTime="2021-06">
                                                    Jun 2021
                                                </time>{" "}
                                                -{" "}
                                                <time dateTime="2022-10">
                                                    Oct 2022
                                                </time>
                                                ;{" "}
                                                <time dateTime="2023-07">
                                                    Jul 2023
                                                </time>{" "}
                                                -{" "}
                                                <time dateTime="2023-10">
                                                    Oct 2023
                                                </time>
                                            </span>
                                        </p>
                                        <p className={styles.entryPrimary}>
                                            Software Development Intern, Student
                                            Contractor{" "}
                                            <span className={styles.entrySep}>
                                                •
                                            </span>
                                            <span className={styles.entryMeta}>
                                                <time dateTime="2020-06">
                                                    Jun 2020
                                                </time>{" "}
                                                -{" "}
                                                <time dateTime="2021-02">
                                                    Feb 2021
                                                </time>
                                            </span>
                                        </p>
                                        <p
                                            className={`${styles.entryLine} ${styles.muted} ${styles.entryImpact}`}
                                        >
                                            Full-stack features for a SaaS web
                                            app and REST API (C#, .NET, React,
                                            TypeScript, SQL), plus testing, code
                                            review, CI/CD, and mentoring
                                            interns.
                                        </p>
                                    </div>
                                </article>

                                <article className={styles.entry}>
                                    <header className={styles.entryTop}>
                                        <h3 className={styles.entryTitle}>
                                            XR Studios
                                        </h3>
                                    </header>
                                    <div className={styles.entryBody}>
                                        <p className={styles.entryPrimary}>
                                            Creative Technologist{" "}
                                            <span className={styles.entrySep}>
                                                •
                                            </span>
                                            <span className={styles.entryMeta}>
                                                <time dateTime="2022-10">
                                                    Oct 2022
                                                </time>{" "}
                                                -{" "}
                                                <time dateTime="2023-06">
                                                    Jun 2023
                                                </time>
                                            </span>
                                        </p>
                                        <p
                                            className={`${styles.entryLine} ${styles.muted} ${styles.entryImpact}`}
                                        >
                                            Ran and maintained a large-format
                                            LED volume for virtual production,
                                            built internal tools, administered
                                            Perforce, and optimized Unreal and
                                            Unity scenes to render in real time
                                            on stage.
                                        </p>
                                    </div>
                                </article>

                                <article className={styles.entry}>
                                    <header className={styles.entryTop}>
                                        <h3 className={styles.entryTitle}>
                                            Miami University ETBD
                                        </h3>
                                    </header>
                                    <div className={styles.entryBody}>
                                        <p className={styles.entryPrimary}>
                                            Research Assistant & VR Developer{" "}
                                            <span className={styles.entrySep}>
                                                •
                                            </span>
                                            <span className={styles.entryMeta}>
                                                <time dateTime="2020-01">
                                                    Jan 2020
                                                </time>{" "}
                                                -{" "}
                                                <time dateTime="2021-04">
                                                    Apr 2021
                                                </time>
                                            </span>
                                        </p>
                                        <p
                                            className={`${styles.entryLine} ${styles.muted} ${styles.entryImpact}`}
                                        >
                                            Built VR/AR simulations with Dr.
                                            Eric Hodgson, including{" "}
                                            <Link href="/xr-games/parkinsons-vr">
                                                Parkinson's VR Training
                                            </Link>
                                            , and kept the hardware running in
                                            the Smale Interactive Visualization
                                            Center, including its four-wall
                                            CAVE.
                                        </p>
                                    </div>
                                </article>

                                <article className={styles.entry}>
                                    <header className={styles.entryTop}>
                                        <h3 className={styles.entryTitle}>
                                            London Computer Systems
                                        </h3>
                                    </header>
                                    <div className={styles.entryBody}>
                                        <p className={styles.entryPrimary}>
                                            Software Development Intern{" "}
                                            <span className={styles.entrySep}>
                                                •
                                            </span>
                                            <span className={styles.entryMeta}>
                                                <time dateTime="2019-05">
                                                    May 2019
                                                </time>{" "}
                                                -{" "}
                                                <time dateTime="2019-08">
                                                    Aug 2019
                                                </time>
                                            </span>
                                        </p>
                                        <p className={styles.entryPrimary}>
                                            Quality Assurance Intern{" "}
                                            <span className={styles.entrySep}>
                                                •
                                            </span>
                                            <span className={styles.entryMeta}>
                                                <time dateTime="2018-05">
                                                    May 2018
                                                </time>{" "}
                                                -{" "}
                                                <time dateTime="2018-08">
                                                    Aug 2018
                                                </time>
                                            </span>
                                        </p>
                                        <p
                                            className={`${styles.entryLine} ${styles.muted} ${styles.entryImpact}`}
                                        >
                                            Built C#/.NET REST API endpoints and
                                            NUnit tests for Rent Manager 12, a
                                            property management platform, after
                                            a summer of QA testing its desktop
                                            app.
                                        </p>
                                    </div>
                                </article>
                            </section>
                        </div>
                        <div className={styles.group}>
                            <h2>
                                <span className={styles.sectionHeader}>
                                    <FontAwesomeIcon
                                        className={styles.sectionIcon}
                                        icon={faGraduationCap}
                                    />
                                    Education
                                </span>
                            </h2>
                            <section
                                className={styles.entryList}
                                aria-label="Education"
                            >
                                <article className={styles.entry}>
                                    <header className={styles.entryTop}>
                                        <h3 className={styles.entryTitle}>
                                            University of Colorado Boulder
                                        </h3>
                                    </header>
                                    <div className={styles.entryBody}>
                                        <p className={styles.entryPrimary}>
                                            M.S. Creative Technology & Design{" "}
                                            <span className={styles.entrySep}>
                                                •
                                            </span>
                                            <span className={styles.entryMeta}>
                                                Expected{" "}
                                                <time dateTime="2028-04">
                                                    Apr 2028
                                                </time>
                                            </span>
                                        </p>
                                        <p
                                            className={`${styles.entryLine} ${styles.muted} ${styles.small}`}
                                        >
                                            ATLAS Institute, Creative Industries
                                            focus{" "}
                                            <span className={styles.entrySep}>
                                                •
                                            </span>{" "}
                                            ATLAS Graduate Student Award (Fall
                                            2026)
                                        </p>
                                    </div>
                                </article>

                                <article className={styles.entry}>
                                    <header className={styles.entryTop}>
                                        <h3 className={styles.entryTitle}>
                                            Miami University
                                        </h3>
                                    </header>
                                    <div className={styles.entryBody}>
                                        <h4>
                                            Degrees <em>(Awarded May 2021)</em>
                                        </h4>
                                        <p
                                            className={`${styles.entryPrimary} ${styles.indent}`}
                                        >
                                            B.S. Computer Science{" "}
                                            <span className={styles.entrySep}>
                                                •
                                            </span>{" "}
                                            B.A. Interactive Media Studies
                                        </p>
                                        <p
                                            className={`${styles.entryLine} ${styles.muted} ${styles.small} ${styles.indent}`}
                                        >
                                            Minors: Music Composition; Music
                                            Performance (Saxophone)
                                        </p>
                                        <h4>Honors</h4>
                                        <p
                                            className={`${styles.entryLine} ${styles.small} ${styles.muted} ${styles.indent}`}
                                        >
                                            <em>Summa cum laude</em> (GPA 4.0){" "}
                                            <span className={styles.entrySep}>
                                                •
                                            </span>{" "}
                                            University Honors w/ Distinction{" "}
                                            <span className={styles.entrySep}>
                                                •
                                            </span>{" "}
                                            Outstanding Senior in Emerging
                                            Technology
                                        </p>
                                    </div>
                                </article>
                            </section>
                        </div>
                    </>
                }
            />
        </>
    );
};

export default About;
