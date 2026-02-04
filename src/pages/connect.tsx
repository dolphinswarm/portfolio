import { ScreenOverlay } from "@/components/ScreenOverlay/ScreenOverlay";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faCopy, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
	faGithub,
	faInstagram,
	faLinkedin,
	faSoundcloud,
	faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import styles from "@/styles/Connect.module.scss";

const Connect = () => {
	const email = "brad.j.schmitz@gmail.com";
	const [copied, setCopied] = React.useState(false);

	const handleCopyEmail = async () => {
		try {
			await navigator.clipboard.writeText(email);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1400);
		} catch {
			// If clipboard is blocked, the mailto link is still available.
		}
	};

	return (
		<ScreenOverlay
			top={
				<>
					<p className={styles.lede}>Want to get in touch? Connect with me through any of the platforms below or send me an email!</p>
				</>
			}
			left={
				<div className={styles.container}>
					<section aria-label="Contact">
						<h2>Contact</h2>
						<div className={styles.emailRow}>
							<a className={styles.card} href={`mailto:${email}`}>
								<span className={styles.cardIcon}>
									<FontAwesomeIcon icon={faEnvelope}  />
								</span>
								<span className={styles.cardBody}>
									<span className={styles.cardTopRow}>
										<span className={styles.cardTitle}>{email}</span>
										<span className={styles.cardMeta}>Opens your mail app</span>
									</span>
								</span>
								<span className={styles.cardChevron} aria-hidden="true">
									<FontAwesomeIcon icon={faChevronRight}  />
								</span>
							</a>

							<button
								type="button"
								className={styles.copyButton}
								onClick={handleCopyEmail}
								disabled={copied}
								aria-label={copied ? "Email copied" : "Copy email"}
								title={copied ? "Copied" : "Copy"}
							>
								<FontAwesomeIcon icon={faCopy}  />
								{copied ? "Copied" : "Copy"}
							</button>
						</div>
					</section>

					<section aria-label="Links">
						<h2>Links</h2>
						<div className={styles.stack}>
							<a className={styles.card} href="https://github.com/dolphinswarm" target="_blank" rel="noreferrer">
								<span className={styles.cardIcon}>
									<FontAwesomeIcon icon={faGithub}  />
								</span>
								<span className={styles.cardBody}>
									<span className={styles.cardTopRow}>
										<span className={styles.cardTitle}>GitHub</span>
										<span className={styles.cardMeta}>Code + pinned projects</span>
									</span>
								</span>
								<span className={styles.cardChevron} aria-hidden="true">
									<FontAwesomeIcon icon={faChevronRight}  />
								</span>
							</a>

							<a className={styles.card} href="https://www.linkedin.com/in/bradley-schmitz/" target="_blank" rel="noreferrer">
								<span className={styles.cardIcon}>
									<FontAwesomeIcon icon={faLinkedin}  />
								</span>
								<span className={styles.cardBody}>
									<span className={styles.cardTopRow}>
										<span className={styles.cardTitle}>LinkedIn</span>
										<span className={styles.cardMeta}>Experience + history</span>
									</span>
								</span>
								<span className={styles.cardChevron} aria-hidden="true">
									<FontAwesomeIcon icon={faChevronRight}  />
								</span>
							</a>

							<a className={styles.card} href="https://soundcloud.com/dolphinswarm" target="_blank" rel="noreferrer">
								<span className={styles.cardIcon}>
									<FontAwesomeIcon icon={faSoundcloud}  />
								</span>
								<span className={styles.cardBody}>
									<span className={styles.cardTopRow}>
										<span className={styles.cardTitle}>SoundCloud</span>
										<span className={styles.cardMeta}>Music + sketches</span>
									</span>
								</span>
								<span className={styles.cardChevron} aria-hidden="true">
									<FontAwesomeIcon icon={faChevronRight}  />
								</span>
							</a>

							<a className={styles.card} href="https://www.youtube.com/@brad.j.schmitz" target="_blank" rel="noreferrer">
								<span className={styles.cardIcon}>
									<FontAwesomeIcon icon={faYoutube}  />
								</span>
								<span className={styles.cardBody}>
									<span className={styles.cardTopRow}>
										<span className={styles.cardTitle}>YouTube</span>
										<span className={styles.cardMeta}>Videos + reels</span>
									</span>
								</span>
								<span className={styles.cardChevron} aria-hidden="true">
									<FontAwesomeIcon icon={faChevronRight}  />
								</span>
							</a>

							<a className={styles.card} href="https://www.instagram.com/dolphinswarm.music/" target="_blank" rel="noreferrer">
								<span className={styles.cardIcon}>
									<FontAwesomeIcon icon={faInstagram}  />
								</span>
								<span className={styles.cardBody}>
									<span className={styles.cardTopRow}>
										<span className={styles.cardTitle}>Instagram</span>
										<span className={styles.cardMeta}>Updates + visuals</span>
									</span>
								</span>
								<span className={styles.cardChevron} aria-hidden="true">
									<FontAwesomeIcon icon={faChevronRight}  />
								</span>
							</a>
						</div>
					</section>
				</div>
			}
			right={<div aria-hidden="true" />} // TODO something fun here!
		/>
	);
};

export default Connect;
