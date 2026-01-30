import { ScreenOverlay } from "@/components/ScreenOverlay/ScreenOverlay";

const Connect = () => {
	return (
		<ScreenOverlay
			top={
				<p>
					The best way to reach me is email, but feel free to connect on any of
					the platforms below.
				</p>
			}
			left={
				<>
					<h2>Email</h2>
					<ul>
						<li>
							<a href="mailto:your@email.com">your@email.com</a>
						</li>
					</ul>

					<h2>Availability</h2>
					<ul>
						<li>Open to: full-time / contract / collabs</li>
						<li>Timezone: (e.g. ET / PT / UTC)</li>
						<li>Preferred: async first, 1–2 sync touchpoints/week</li>
					</ul>
				</>
			}
			right={
				<>
					<h2>Social</h2>
					<ul>
						<li>
							<a href="https://github.com/" target="_blank" rel="noreferrer">
								GitHub
							</a>
						</li>
						<li>
							<a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
								LinkedIn
							</a>
						</li>
						<li>
							<a href="https://" target="_blank" rel="noreferrer">
								(Your other link)
							</a>
						</li>
					</ul>

					<h2>Resume</h2>
					<ul>
						<li>
							<a href="/" target="_blank" rel="noreferrer">
								Download PDF
							</a>
						</li>
					</ul>
				</>
			}
		/>
	);
};

export default Connect;
