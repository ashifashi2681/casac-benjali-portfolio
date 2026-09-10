"use client";

import { useRef } from "react";
import SectionTitle from "../ui/SectionTitle/SectionTitle";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { useGsap } from "@/hooks/useGsap";

const STAGES = [
	{
		num: "01",
		title: "Business Strategy",
		description:
			"Clearer direction for stronger business decisions and sustainable growth.",
	},
	{
		num: "02",
		title: "Growth Strategy",
		description:
			"Identifying opportunities and developing practical approaches for business expansion.",
	},
	{
		num: "03",
		title: "Sales Strategy",
		description:
			"Strengthening sales direction, customer engagement, and revenue performance.",
	},
	{
		num: "04",
		title: "Marketing & Branding",
		description:
			"Building stronger market positioning, brand presence, and customer connection.",
	},
	{
		num: "05",
		title: "Leadership & Organisation",
		description:
			"Developing leadership capabilities and organisational performance.",
	},
	{
		num: "06",
		title: "Operational Efficiency",
		description:
			"Improving processes, productivity, and execution for better business performance.",
	},
];

const JOURNEY = ["Understand", "Strategise", "Execute", "Improve", "Grow"];


function StrategicConsulting() {
	const rootRef = useRef(null);

	useGsap(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

			/*
			 * Section entry â€” header + intro.
			 */
			gsap.from(`[data-reveal]`, {
				y: 48,
				opacity: 0,
				duration: reducedMotion ? 0.01 : 1,
				ease: "expo.out",
				stagger: 0.12,
				scrollTrigger: {
					trigger: root,
					start: "top 78%",
					toggleActions: "play none none reverse",
				},
			});

			/*
			 * Stage journey â€” each stage activates while the others stay subdued.
			 * Progress line grows with scroll across the pinned stage.
			 */
			const stageItems = gsap.utils.toArray(`[data-stage]`, root);
			const progressFill = root.querySelector(`[data-progress-fill]`);
			const journeyScroll = root.querySelector(`[data-journey-scroll]`);

			stageItems.forEach((stage, i) => {
				gsap.fromTo(
					stage,
					{ opacity: 0.22, y: 26, filter: "blur(2px)" },
					{
						opacity: 1,
						y: 0,
						filter: "blur(0px)",
						duration: reducedMotion ? 0.01 : 0.7,
						ease: "power3.out",
						scrollTrigger: {
							trigger: stage,
							start: "top 70%",
							end: "bottom 45%",
							toggleActions: "play reverse play reverse",
						},
						onStart: () => {
							gsap.to(progressFill, {
								scaleY: (i + 1) / stageItems.length,
								duration: reducedMotion ? 0.01 : 0.6,
								ease: "power2.out",
								overwrite: "auto",
							});
						},
						onReverseComplete: () => {
							gsap.to(progressFill, {
								scaleY: i / stageItems.length,
								duration: reducedMotion ? 0.01 : 0.5,
								ease: "power2.out",
								overwrite: "auto",
							});
						},
					}
				);
			});

			/*
			 * Closing journey words.
			 */
			const journeyWords = gsap.utils.toArray(`[data-journey-word]`, root);

			journeyWords.forEach((word, i) => {
				gsap.fromTo(
					word,
					{ opacity: 0.18, y: 14 },
					{
						opacity: 1,
						y: 0,
						duration: reducedMotion ? 0.01 : 0.6,
						ease: "power2.out",
						scrollTrigger: {
							trigger: `[data-journey]`,
							start: `top ${74 - i * 5}%`,
							toggleActions: "play reverse play reverse",
						},
					}
				);
			});

			/*
			 * Outro CTA reveal.
			 */
			const outro = root.querySelector(`[data-outro]`);
			const outroTrigger = gsap.from(outro, {
				y: 48,
				opacity: 0,
				duration: reducedMotion ? 0.01 : 1,
				ease: "expo.out",
				scrollTrigger: {
					trigger: outro,
					start: "top 84%",
					toggleActions: "play none none reverse",
				},
			});

			return () => {
				outroTrigger?.scrollTrigger?.kill();
				outroTrigger?.kill();
				ScrollTrigger.getAll().forEach((trigger) => {
					if (root.contains(trigger.trigger)) trigger.kill();
				});
			};
		},
		{
			scope: rootRef,
		}
	);

	return (
		<section ref={rootRef} className="relative w-full overflow-hidden bg-[#050505]">
			{/* ambient glow */}
			<span
				aria-hidden="true"
				className="pointer-events-none absolute right-[-10%] top-[10%] z-0 h-[min(720px,75vw)] w-[min(720px,75vw)] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_65%)]"
			/>

			{/* HEADER / INTRO */}
			<div className="relative z-1 w-full px-[clamp(24px,7vw,120px)] pt-[clamp(96px,12vw,180px)]">
				<div className="mx-auto grid w-full max-w-[72rem] gap-[clamp(32px,4vw,56px)]">
					<SectionTitle title="Strategic Consulting" />

					<div className="grid gap-6">
						<p data-reveal="" className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
							01 / Consulting
						</p>

						<h3
							data-reveal=""
							className="m-0 max-w-22ch text-[clamp(1.7rem,1.2rem+2.2vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-slate-50"
						>
							Strategy That Moves Businesses Forward
						</h3>

						<div data-reveal="" className="grid max-w-62ch gap-5 text-[clamp(0.95rem,0.85rem+0.35vw,1.15rem)] leading-[1.7] text-slate-400">
							<p className="m-0">
								Casac Benjali provides{" "}
								<strong className="font-semibold text-slate-50">strategic business consulting</strong> to help
								organisations identify opportunities, overcome challenges, improve performance, and build
								practical strategies for sustainable growth.
							</p>
							<p className="m-0">
								With strategic consulting experience dating back to{" "}
								<strong className="font-semibold text-slate-50">2011 in Dubai</strong>, his approach combines
								strategic thinking with practical business and entrepreneurial experience across{" "}
								<strong className="font-semibold text-slate-50">India and the GCC</strong>.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* STAGE JOURNEY â€” sticky rail with progress line */}
			<div data-journey-scroll="" className="relative z-1 mt-[clamp(72px,9vw,140px)] px-[clamp(24px,7vw,120px)]">
				<div className="mx-auto grid w-full max-w-[72rem] gap-[clamp(36px,5vw,64px)]">
					<p data-reveal="" className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
						Consulting Expertise
					</p>

					<div className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-[clamp(20px,3vw,48px)]">
						{/* progress rail */}
						<div className="relative w-px bg-white/12" aria-hidden="true">
							<div
								data-progress-fill=""
								className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-white"
							/>
						</div>

						<ul className="grid gap-[clamp(48px,7vw,110px)]">
							{STAGES.map((stage) => (
								<li
									data-stage=""
									key={stage.num}
									className="grid gap-3"
								>
									<div className="grid items-baseline gap-[clamp(14px,2vw,32px)] sm:grid-cols-[auto_minmax(0,1fr)]">
										<span
											aria-hidden="true"
											className="text-[clamp(2rem,1.4rem+2.4vw,4rem)] font-extrabold leading-none tracking-[-0.05em] text-white/20 tabular-nums"
										>
											{stage.num}
									</span>
									<div className="grid gap-3">
										<h4 className="m-0 text-[clamp(1.4rem,1.05rem+1.6vw,2.8rem)] font-bold leading-[1.08] tracking-[-0.02em] text-slate-50">
											{stage.title}
										</h4>
										<p className="m-0 max-w-56ch leading-[1.65] text-slate-400">{stage.description}</p>
									</div>
								</div>
							</li>
						))}
						</ul>
					</div>
				</div>
			</div>

			{/* CLOSING JOURNEY + CTA */}
			<div
				data-journey=""
				className="relative z-1 mt-[clamp(96px,12vw,180px)] px-[clamp(24px,7vw,120px)] pb-[clamp(96px,12vw,180px)]"
			>
				<div className="mx-auto grid w-full max-w-[72rem] gap-[clamp(36px,5vw,64px)]">
					<div data-reveal="" className="grid gap-5">
						<p className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">From Strategy to Execution</p>
						<h4 className="m-0 max-w-40ch text-[clamp(1.4rem,1rem+1.8vw,2.8rem)] font-bold leading-[1.08] tracking-[-0.02em] text-slate-50">
							Strategic consulting is focused on turning business challenges and opportunities into{" "}
							<span className="text-slate-400">clear strategies, practical action, and measurable progress</span>.
						</h4>
					</div>

					<div className="flex flex-wrap items-baseline gap-x-[clamp(14px,2.4vw,32px)] gap-y-3">
						{JOURNEY.map((word, i) => (
							<span key={word} className="inline-flex items-baseline gap-[clamp(14px,2.4vw,32px)]">
								<span
									data-journey-word=""
									className="text-[clamp(1.5rem,1rem+2.2vw,3.4rem)] font-extrabold leading-none tracking-[-0.04em] text-slate-50"
								>
									{word}
								</span>
								{i < JOURNEY.length - 1 ? (
									<span aria-hidden="true" className="text-[clamp(1rem,0.7rem+1.2vw,1.8rem)] font-bold text-slate-700">
										â†’
									</span>
								) : null}
							</span>
						))}
					</div>

					<div data-outro="" className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4">
						{[
							{ label: "Explore Strategic Consulting", href: "/contact" },
							{ label: "Book a Consultation", href: "/contact" },
						].map((link) => (
							<a
								key={link.label}
								href={link.href}
								className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-50 transition-colors duration-300 hover:text-white"
							>
								<span className="border-b border-white/25 pb-1 transition-colors duration-300 group-hover:border-white/70">
									{link.label}
								</span>
								<span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
									â†’
								</span>
							</a>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default StrategicConsulting;
