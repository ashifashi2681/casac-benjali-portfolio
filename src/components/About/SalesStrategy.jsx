"use client";

import { useRef } from "react";
import SectionTitle from "../ui/SectionTitle";
import Desc from "../ui/Desc";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { useGsap } from "@/hooks/useGsap";
import { SALES_STRATEGY } from "@/data/about";

const { title, description, paragraphs, stages } = SALES_STRATEGY;

function SalesStrategy() {
	const rootRef = useRef(null);

	useGsap(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const reducedMotion = window.matchMedia(
				"(prefers-reduced-motion: reduce)"
			).matches;

			/*
			 * Intro — description settles in after the heading reveal.
			 */
			const introItems = gsap.utils.toArray("[data-reveal]", root);
			let introTween;
			if (introItems.length) {
				introTween = gsap.from(introItems, {
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
			 * Career progression — milestones reveal sequentially
			 * while the connecting line draws progressively from
			 * Sales → Strategy → Coaching → Entrepreneurship.
			 */
			const progressionRoot = root.querySelector("[data-progression]");
			let progressionTl;
			if (progressionRoot) {
				const segments = gsap.utils.toArray(
					"[data-segment]",
					progressionRoot
				);
				const stageEls = gsap.utils.toArray(
					"[data-stage]",
					progressionRoot
				);

				progressionTl = gsap.timeline({
					scrollTrigger: {
						trigger: progressionRoot,
						start: "top 80%",
						toggleActions: "play none none reverse",
					},
				});

				if (stageEls.length) {
					progressionTl.from(stageEls, {
						y: 30,
						opacity: 0,
						duration: reducedMotion ? 0.01 : 0.75,
						ease: "power3.out",
						stagger: reducedMotion ? 0 : 0.34,
					});
				}

				if (segments.length) {
					progressionTl.fromTo(
						segments,
						{ scaleY: 0, scaleX: 0 },
						{
							scaleY: 1,
							scaleX: 1,
							duration: reducedMotion ? 0.01 : 0.42,
							ease: "power2.inOut",
							stagger: reducedMotion ? 0 : 0.34,
						},
						reducedMotion ? 0 : 0.4
					);
				}
			}

			return () => {
				introTween?.scrollTrigger?.kill();
				introTween?.kill();
				progressionTl?.scrollTrigger?.kill();
				progressionTl?.kill();
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
				className="pointer-events-none absolute left-1/2 top-0 z-0 h-[min(700px,75vw)] w-[min(700px,75vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,163,255,0.06)_0%,rgba(217,154,50,0.03)_45%,transparent_70%)]"
			/>

			<div className="relative z-1 mx-auto grid w-full max-w-[72rem] gap-[clamp(40px,5vw,64px)]">
				<SectionTitle title={title} align="center" />

				{/* short description + narrative */}
				<div className="mx-auto grid w-full max-w-[64rem] gap-[clamp(24px,3vw,36px)]">
					<p
						data-reveal=""
						className="m-0 text-balance text-center text-[clamp(1.05rem,0.9rem+0.55vw,1.4rem)] font-medium leading-[1.6] text-slate-300"
					>
						{description}
					</p>
					<div
						data-reveal=""
						className="grid gap-5 text-center sm:text-left lg:grid-cols-2 lg:gap-x-[clamp(40px,5vw,72px)]"
					>
						{paragraphs.map((paragraph, index) => (
							<Desc key={index} data={paragraph} />
						))}
					</div>
				</div>

				{/* career progression */}
				<div data-progression="" className="relative">
					<ol className="relative grid gap-12 pl-9 lg:grid-cols-5 lg:gap-6 lg:pl-0">
						{stages.map((stage, index) => {
							const isLast = index === stages.length - 1;

							return (
								<li
									key={stage.step}
									data-stage=""
									className="relative lg:flex lg:flex-col lg:pt-9"
								>
									{/* node */}
									<span
										aria-hidden="true"
										className="absolute left-[6px] top-[7px] flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center rounded-full border border-brand-blue/60 bg-brand-blue/20 lg:left-0 lg:top-[6px] lg:translate-x-0 lg:-translate-y-1/2"
									>
										<span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
									</span>

									{/* connecting segments — draw progressively */}
									{!isLast ? (
										<>
											<span
												aria-hidden="true"
												data-segment=""
												className="absolute left-[6px] top-[26px] h-[calc(100%+55px)] w-px origin-top scale-y-0 bg-gradient-to-b from-brand-blue/70 to-brand-gold/50 lg:hidden"
											/>
											<span
												aria-hidden="true"
												data-segment=""
												className="absolute left-[14px] right-[-24px] top-[6px] hidden h-px origin-left scale-x-0 bg-gradient-to-r from-brand-blue/70 to-brand-gold/50 lg:block"
											/>
										</>
									) : null}

									<div className="flex items-baseline gap-3 lg:flex-col lg:items-start lg:gap-2.5">
										<span className="text-xs font-bold tracking-[0.12em] text-slate-500">
											{stage.step}
										</span>
										<h3 className="m-0 text-md font-semibold leading-tight tracking-[-0.01em] text-slate-50">
											{stage.title}
										</h3>
									</div>
									<p className="m-0 mt-2.5 max-w-[38ch] text-sm leading-[1.6] text-slate-400 lg:max-w-none">
										{stage.caption}
									</p>
								</li>
							);
						})}
					</ol>
				</div>
			</div>
		</section>
	);
}

export default SalesStrategy

