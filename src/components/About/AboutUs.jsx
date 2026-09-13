"use client";

import { useRef } from "react";
import SectionTitle from "../ui/SectionTitle";
import Desc from "../ui/Desc";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { useGsap } from "@/hooks/useGsap";
import { ABOUT_US } from "@/data/about";

const { eyebrow, heading, paragraphs, cta, timeline } = ABOUT_US;

function AboutUs() {
	const rootRef = useRef(null);

	useGsap(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const reducedMotion = window.matchMedia(
				"(prefers-reduced-motion: reduce)"
			).matches;

			/*
			 * Supporting narrative + CTA — settles in after the
			 * heading reveal (SectionTitle handles the heading itself).
			 */
			const narrativeItems = gsap.utils.toArray("[data-reveal]", root);
			let narrativeTween;
			if (narrativeItems.length) {
				narrativeTween = gsap.from(narrativeItems, {
					y: 34,
					opacity: 0,
					duration: reducedMotion ? 0.01 : 0.95,
					ease: "power3.out",
					stagger: 0.14,
					delay: reducedMotion ? 0 : 0.35,
					scrollTrigger: {
						trigger: root,
						start: "top 74%",
						toggleActions: "play none none reverse",
					},
				});
			}

			/*
			 * Professional evolution — the career path draws
			 * progressively while each stage settles into view.
			 */
			const evolutionRoot = root.querySelector("[data-evolution]");
			let evolutionTl;
			if (evolutionRoot) {
				const fill = evolutionRoot.querySelector("[data-evolution-fill]");
				const stages = gsap.utils.toArray("[data-stage]", evolutionRoot);

				evolutionTl = gsap.timeline({
					scrollTrigger: {
						trigger: evolutionRoot,
						start: "top 80%",
						toggleActions: "play none none reverse",
					},
				});

				if (fill) {
					evolutionTl.fromTo(
						fill,
						{ scaleY: 0 },
						{
							scaleY: 1,
							duration: reducedMotion ? 0.01 : 1.9,
							ease: "power2.inOut",
						},
						0
					);
				}

				if (stages.length) {
					evolutionTl.from(
						stages,
						{
							y: 26,
							opacity: 0,
							duration: reducedMotion ? 0.01 : 0.8,
							ease: "power3.out",
							stagger: reducedMotion ? 0 : 0.42,
							immediateRender: true,
						},
						reducedMotion ? 0 : 0.3
					);
				}
			}

			return () => {
				narrativeTween?.scrollTrigger?.kill();
				narrativeTween?.kill();
				evolutionTl?.scrollTrigger?.kill();
				evolutionTl?.kill();
				ScrollTrigger.getAll().forEach((trigger) => {
					if (root.contains(trigger.trigger)) trigger.kill();
				});
			};
		},
		{ scope: rootRef }
	);

	const handleExploreClick = (event) => {
		const target = document.getElementById(cta.href.replace("#", ""));
		if (!target) return; // no in-page target yet — native anchor behaviour
		event.preventDefault();
		target.scrollIntoView({
			behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
				.matches
				? "auto"
				: "smooth",
			block: "start",
		});
	};

	return (
		<section
			ref={rootRef}
			className="relative w-full overflow-hidden bg-background px-[clamp(24px,7vw,120px)] py-[clamp(96px,12vw,180px)]"
		>
			{/* ambient glow */}
			<span
				aria-hidden="true"
				className="pointer-events-none absolute right-[-12%] top-[-8%] z-0 h-[min(820px,85vw)] w-[min(820px,85vw)] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,163,255,0.07)_0%,rgba(217,154,50,0.035)_45%,transparent_70%)]"
			/>

			<div className="relative z-1 mx-auto grid w-full max-w-[72rem] items-start gap-[clamp(48px,7vw,96px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
				{/* LEFT — personal introduction */}
				<div className="grid gap-[clamp(32px,4vw,48px)]">
					<SectionTitle subtitle={eyebrow} title={heading} />

					<div data-reveal="" className="grid gap-5">
						{paragraphs.map((paragraph, index) => (
							<Desc key={index} data={paragraph} />
						))}
					</div>

					<div data-reveal="">
						<a
							href={cta.href}
							onClick={handleExploreClick}
							className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-slate-50 transition-colors duration-300 hover:text-white"
						>
							<span className="border-b border-white/25 pb-1 transition-colors duration-300 group-hover:border-brand-blue">
								{cta.label}
							</span>
							<span
								aria-hidden="true"
								className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
							>
								→
							</span>
						</a>
					</div>
				</div>

				{/* RIGHT — professional evolution */}
				<div data-evolution="" className="relative">
					<p className="m-0 mb-[clamp(28px,3.5vw,44px)] text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
						Professional Evolution
					</p>

					<div className="relative">
						{/* track */}
						<span
							aria-hidden="true"
							className="absolute bottom-[6px] left-[6px] top-[6px] w-px -translate-x-1/2 bg-white/10"
						/>
						{/* progress fill — draws as the section enters the viewport */}
						<span
							aria-hidden="true"
							data-evolution-fill=""
							className="absolute bottom-[6px] left-[6px] top-[6px] w-px origin-top -translate-x-1/2 scale-y-0 bg-gradient-to-b from-brand-blue via-brand-blue/70 to-brand-gold"
						/>

						<ol className="relative grid gap-[clamp(40px,4.5vw,56px)]">
							{timeline.map((stage) => (
								<li
									key={stage.step}
									data-stage=""
									className="relative pl-9"
								>
									<span
										aria-hidden="true"
										className="absolute left-[6px] top-[7px] h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-white/25 bg-surface"
									/>
									<div className="flex items-baseline gap-3">
										<span className="text-xs font-bold tracking-[0.12em] text-slate-500">
											{stage.step}
										</span>
										<h3 className="m-0 text-md font-semibold leading-tight tracking-[-0.01em] text-slate-50">
											{stage.title}
										</h3>
									</div>
									<p className="m-0 mt-2.5 max-w-[46ch] text-sm leading-[1.65] text-slate-400">
										{stage.tagline}
									</p>
								</li>
							))}
						</ol>
					</div>
				</div>
			</div>
		</section>
	);
}

export default AboutUs
