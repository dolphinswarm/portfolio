import { ScreenOverlay } from "@/components/ScreenOverlay/ScreenOverlay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBriefcase,
    faToolbox,
    faGraduationCap,
    faShapes,
    faLink,
    faFilePdf,
    faVrCardboard,
    faMusic,
    faBrain,
    faComputer,
    faCat,
    faHandPointer,
} from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/About.module.scss";

const About = () => {
    return (
        <ScreenOverlay
            top={
                <>
                    <p>
                        Hello! I'm <strong>Bradley Schmitz</strong> (he/him) -
                        or just Brad if you want fewer syllables. I'm a software
                        engineer, creative technologist, and musician based in
                        Denver, CO. I'm originally from the cornfields of
                        Northwest Ohio, studied at Miami University (Ohio), and
                        previously lived in San Francisco, CA, and Los Angeles,
                        CA.
                    </p>
                    <br />
                    <p>
                        I'm drawn to creative coding and interactive systems -
                        such as virtual/augmented reality, projection mapping,
                        installations, and live visuals - that make light,
                        sound, motion, and space feel responsive and alive. I
                        love seeing where technology, art, and music intersect
                        to create truly immersive and engaging experiences.
                    </p>
                </>
            }
            left={
                <>
                    <h2>
                        <span className={styles.sectionHeader}>
                            <FontAwesomeIcon
                                className={styles.sectionIcon}
                                icon={faBrain}
                            />
                            Interests
                        </span>
                    </h2>
                    <ul>
                        <li>
                            <FontAwesomeIcon
                                className={styles.sectionIcon}
                                icon={faHandPointer}
                            />{" "}
                            Human-computer interaction via web, mobile, games,
                            etc.
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
                            Immersive / interactive installations and spatial
                            experiences
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
                    <br />
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
                            TypeScript/JavaScript, C#, C/C++, Python, Java
                        </li>
                        <li>
                            <strong>Web:</strong> React, Next.js, NodeJS,
                            HTML/CSS/Sass
                        </li>
                        <li>
                            <strong>Other Tech:</strong>.NET Framework, SQL
                            (MySQL/PostgreSQL/Microsoft SQL Server), git,
                            Perforce
                        </li>
                        <li>
                            <strong>3D/Creative:</strong> Three.js/R3F, Unity,
                            Unreal, OpenGL/GLSL, Vulkan, TouchDesigner, Adobe
                            Suite
                        </li>
                        <li>
                            <strong>Music/Audio:</strong> Ableton Live, Max/MSP,
                            Audacity, MIDI
                        </li>
                        <li>
                            <strong>Instruments:</strong> Saxophone (alto,
                            tenor, soprano, baritone), guitar (electric,
                            acoustic, resonator), banjo (three-finger,
                            clawhammer), bass, piano
                        </li>
                    </ul>
                    <br />
                    <h2>
                        <span className={styles.sectionHeader}>
                            <FontAwesomeIcon
                                className={styles.sectionIcon}
                                icon={faLink}
                            />
                            Links
                        </span>
                    </h2>
                    <div className={styles.linkButtons}>
                        <a
                            className={styles.resumeButton}
                            href="/resume.pdf"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FontAwesomeIcon icon={faFilePdf} fixedWidth />{" "}
                            Resume (PDF)
                        </a>
                    </div>
                </>
            }
            right={
                <>
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
                                <h3 className={styles.entryTitle}>ClickTime</h3>
                            </header>
                            <div className={styles.entryBody}>
                                <p className={styles.entryPrimary}>
                                    Software Engineer{" "}
                                    <span className={styles.entrySep}>•</span>
                                    <span className={styles.entryMeta}>
                                        <time dateTime="2023-10">Oct 2023</time>{" "}
                                        - Present
                                    </span>
                                </p>
                                <p className={styles.entryPrimary}>
                                    Associate Software Engineer{" "}
                                    <span className={styles.entrySep}>•</span>
                                    <span className={styles.entryMeta}>
                                        <time dateTime="2021-06">Jun 2021</time>{" "}
                                        -{" "}
                                        <time dateTime="2022-10">Oct 2022</time>
                                        ;{" "}
                                        <time dateTime="2023-07">Jul 2023</time>{" "}
                                        -{" "}
                                        <time dateTime="2023-10">Oct 2023</time>
                                    </span>
                                </p>
                                <p className={styles.entryPrimary}>
                                    Software Development Intern, Student
                                    Contractor{" "}
                                    <span className={styles.entrySep}>•</span>
                                    <span className={styles.entryMeta}>
                                        <time dateTime="2020-06">Jun 2020</time>{" "}
                                        -{" "}
                                        <time dateTime="2021-02">Feb 2021</time>
                                    </span>
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
                                    <span className={styles.entrySep}>•</span>
                                    <span className={styles.entryMeta}>
                                        <time dateTime="2022-10">Oct 2022</time>{" "}
                                        -{" "}
                                        <time dateTime="2023-06">Jun 2023</time>
                                    </span>
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
                                    <span className={styles.entrySep}>•</span>
                                    <span className={styles.entryMeta}>
                                        <time dateTime="2019-05">May 2019</time>{" "}
                                        -{" "}
                                        <time dateTime="2019-08">Aug 2019</time>
                                    </span>
                                </p>
                                <p className={styles.entryPrimary}>
                                    Quality Assurance Intern{" "}
                                    <span className={styles.entrySep}>•</span>
                                    <span className={styles.entryMeta}>
                                        <time dateTime="2018-05">May 2018</time>{" "}
                                        -{" "}
                                        <time dateTime="2018-08">Aug 2018</time>
                                    </span>
                                </p>
                            </div>
                        </article>
                    </section>
                    <br />
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
                                    <span className={styles.entrySep}>•</span>{" "}
                                    B.A. Interactive Media Studies
                                </p>
                                <p
                                    className={`${styles.entryLine} ${styles.muted} ${styles.small} ${styles.indent}`}
                                >
                                    Minors: Music Composition; Music Performance
                                    (Saxophone)
                                </p>
                                <h4>Awards &amp; Honors</h4>
                                <p
                                    className={`${styles.entryLine} ${styles.small} ${styles.muted} ${styles.indent}`}
                                >
                                    <em>Summa cum laude</em> (GPA 4.0){" "}
                                    <span className={styles.entrySep}>•</span>{" "}
                                    University Honors w/ Distinction{" "}
                                    <span className={styles.entrySep}>•</span>{" "}
                                    Computer Science Departmental Honors{" "}
                                    <span className={styles.entrySep}>•</span>{" "}
                                    President's List (all semesters){" "}
                                    <span className={styles.entrySep}>•</span>{" "}
                                    Outstanding Senior in Emerging Technology,
                                    Overall Excellence in ETBD Awards{" "}
                                    <span className={styles.entrySep}>•</span>{" "}
                                    Top 10 First-Year and Second-Year Student in
                                    the College of Engineering and Computing
                                    (presented by Tau Beta Pi){" "}
                                    <span className={styles.entrySep}>•</span>{" "}
                                    Lockheed Martin (now Lilly) Leadership
                                    Institute Leadership Certificate
                                </p>
                            </div>
                        </article>
                    </section>
                </>
            }
        />
    );
};

export default About;
