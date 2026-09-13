"use client";

import { useRef, useState } from "react";
import SectionTitle from "../ui/SectionTitle";
import Desc from "../ui/Desc";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { useGsap } from "@/hooks/useGsap";
import { JOURNEY } from "@/data/about";

const { eyebrow, heading, paragraphs, closing, milestones } = JOURNEY;
const LAST_INDEX = milestones.length - 1;

function Journey() {
	const rootRef = useRef(null);
	const [activeStep, setActiveStep] = useState(0);

	useGsap(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const reducedMotion = window.matchMedia(
				"(prefers-reduced-motion: reduce)"
			).matches;

			/*
			 * Narrative — settles in after the heading reveal.
			 */
			const narrativeItems = gsap.utils.toArray("[data-reveal]", root);
			let narrativeTween;
			if (narrativeItems.length) {
				narrativeTween = gsap.from(narrativeItems, {
					y: 34,
					opacity: 0,
					duration: reducedMotion ? 0.01 : 0.95,
					ease: "power3.out",
					stagger: 0.12,
					delay: reducedMotion ? 0 : 0.3,
					scrollTrigger: {
						trigger: root,
						start: "top 76%",
						toggleActions: "play none none reverse",
					},
				});
			}

			/*
			 * Journey timeline — the closing statement and each
			 * milestone fade up while the journey line draws
			 * progressively with scroll, promoting the milestone
			 * it passes.
			 */
			const journeyRoot = root.querySelector("[data-journey]");
			let journeyTween;
			let drawTrigger;
			if (journeyRoot) {
				const fillY = journeyRoot.querySelector("[data-fill-y]");
				const fillX = journeyRoot.querySelector("[data-fill-x]");
				const closingEl = journeyRoot.querySelector("[data-closing]");
				const stages = gsap.utils.toArray("[data-milestone]", journeyRoot);

				const revealTargets = closingEl ? [closingEl, ...stages] : stages;
				if (revealTargets.length) {
					journeyTween = gsap.from(revealTargets, {
						y: 28,
						opacity: 0,
						duration: reducedMotion ? 0.01 : 0.85,
						ease: "power3.out",
						stagger: reducedMotion ? 0 : 0.14,
						scrollTrigger: {
							trigger: journeyRoot,
							start: "top 85%",
							toggleActions: "play none none reverse",
						},
					});
				}

				const paint = (progress) => {
					if (fillY) gsap.set(fillY, { scaleY: progress });
					if (fillX) gsap.set(fillX, { scaleX: progress });
					const next = Math.min(
						LAST_INDEX,
						Math.floor(progress * milestones.length)
					);
					setActiveStep((current) => (current === next ? current : next));
				};

				if (reducedMotion) {
					paint(1);
				} else {
					drawTrigger = ScrollTrigger.create({
						trigger: journeyRoot,
						start: "top 85%",
						end: "top 30%",
						onUpdate: (self) => paint(self.progress),
					});
				}
			}

			return () => {
				narrativeTween?.scrollTrigger?.kill();
				narrativeTween?.kill();
				journeyTween?.scrollTrigger?.kill();
				journeyTween?.kill();
				drawTrigger?.kill();
				ScrollTrigger.getAll().forEach((trigger) => {
					if (root.contains(trigger.trigger)) trigger.kill();
				});
			};
		},
		{ scope: rootRef }
	);

	return (
		<section
			ref={rootRef}
			className="relative w-full overflow-hidden bg-background px-[clamp(24px,7vw,120px)] py-[clamp(96px,12vw,180px)]"
		>
			{/* ambient glow */}
			<span
				aria-hidden="true"
				className="pointer-events-none absolute bottom-[-10%] left-[-12%] z-0 h-[min(780px,80vw)] w-[min(780px,80vw)] rounded-full bg-[radial-gradient(circle_at_center,rgba(217,154,50,0.05)_0%,rgba(0,163,255,0.03)_45%,transparent_70%)]"
			/>

			<div className="relative z-1 mx-auto grid w-full max-w-[72rem] gap-[clamp(48px,6vw,88px)]">
				<SectionTitle subtitle={eyebrow} title={heading} />

				{/* narrative */}
				<div
					data-reveal=""
					className="grid gap-5 lg:grid-cols-2 lg:gap-x-[clamp(40px,5vw,72px)]"
				>
					{paragraphs.map((paragraph, index) => (
						<Desc key={index} data={paragraph} />
					))}
				</div>

				{/* journey timeline */}
				<div data-journey="">
					<h3
						data-closing=""
						className="m-0 max-w-24ch text-balance text-[clamp(1.4rem,1rem+1.6vw,2.4rem)] font-bold leading-[1.12] tracking-[-0.02em] text-slate-50"
					>
						{closing}
					</h3>

					<div className="relative mt-[clamp(40px,5vw,72px)]">
						{/* mobile track + fill */}
						<span
							aria-hidden="true"
							className="absolute bottom-1 left-[6px] top-1 w-px -translate-x-1/2 bg-white/10 lg:hidden"
						/>
						<span
							aria-hidden="true"
							data-fill-y=""
							className="absolute bottom-1 left-[6px] top-1 w-px origin-top -translate-x-1/2 scale-y-0 bg-gradient-to-b from-brand-blue via-brand-blue/70 to-brand-gold lg:hidden"
						/>
						{/* desktop track + fill */}
						<span
							aria-hidden="true"
							className="absolute left-0 right-0 top-[6px] hidden h-px -translate-y-1/2 bg-white/10 lg:block"
						/>
						<span
							aria-hidden="true"
							data-fill-x=""
							className="absolute left-0 right-0 top-[6px] hidden h-px origin-left -translate-y-1/2 scale-x-0 bg-gradient-to-r from-brand-blue via-brand-blue/70 to-brand-gold lg:block"
						/>

						<ol className="relative grid gap-[clamp(36px,5vw,52px)] lg:grid-cols-5 lg:gap-6">
							{milestones.map((milestone, index) => {
								const emphasis =
									index < activeStep
										? "passed"
										: index === activeStep
											? "active"
											: "upcoming";

								return (
									<li
										key={milestone.step}
										data-milestone=""
										className="relative pl-9 lg:flex lg:flex-col lg:pl-0 lg:pt-9"
									>
										<span
											aria-hidden="true"
											className={`absolute left-[6px] top-[7px] h-3 w-3 -translate-x-1/2 rounded-full border transition-[background-color,border-color,box-shadow] duration-500 lg:left-0 lg:top-[6px] lg:translate-x-0 lg:-translate-y-1/2 ${
												emphasis === "active"
													? "border-brand-blue bg-brand-blue shadow-[0_0_0_5px_rgba(0,163,255,0.14)]"
													: emphasis === "passed"
														? "border-brand-blue/60 bg-brand-blue/25"
														: "border-white/25 bg-surface"
											}`}
										/>
										<div className="flex items-baseline gap-3 lg:flex-col lg:items-start lg:gap-2.5">
											<span
												className={`text-xs font-bold tracking-[0.12em] transition-colors duration-500 ${
													emphasis === "active"
														? "text-brand-blue"
														: emphasis === "passed"
															? "text-slate-400"
															: "text-slate-600"
												}`}
											>
												{milestone.step}
											</span>
											<h4
												className={`m-0 text-base font-semibold leading-snug tracking-[-0.01em] transition-colors duration-500 ${
													emphasis === "active"
														? "text-slate-50"
														: emphasis === "passed"
															? "text-slate-300"
															: "text-slate-500"
												}`}
											>
												{milestone.title}
											</h4>
										</div>
										<p
											className={`m-0 mt-2.5 text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-500 lg:mt-auto lg:pt-3 ${
												emphasis === "active"
													? "text-brand-gold"
													: emphasis === "passed"
														? "text-slate-400"
														: "text-slate-600"
											}`}
										>
											{milestone.meta}
										</p>
									</li>
								);
							})}
						</ol>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Journey

