"use client";

import { useRef } from "react";
import SectionTitle from "../ui/SectionTitle/SectionTitle";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { useGsap } from "@/hooks/useGsap";

const EXPERTISE = [
	{
		num: "01",
		title: "Strategic Consultant",
		tagline: "Strategy That Moves Businesses Forward",
		description:
			"Casac Benjali helps businesses identify opportunities, address critical challenges, improve operational efficiency, and develop practical strategies for sustainable growth.",
		focus: [
			"Business Strategy",
			"Growth Strategy",
			"Business Performance",
			"Operational Efficiency",
			"Organisational Development",
		],
		tint: "rgba(120, 160, 255, 0.08)",
	},
	{
		num: "02",
		title: "Performance Business Coach",
		tagline: "Transforming Potential Into Performance",
		description:
			"Through structured business coaching, Casac Benjali helps entrepreneurs and business professionals strengthen their strategic thinking, leadership capabilities, personal effectiveness, and execution.",
		focus: [
			"Entrepreneurship",
			"Business Strategy",
			"Leadership",
			"Personal Development",
			"Business Growth",
			"Performance",
		],
		tint: "rgba(255, 180, 110, 0.08)",
	},
	{
		num: "03",
		title: "Sales Coach",
		tagline: "Turning Sales Teams Into Peak Performers",
		description:
			"With professional roots in sales, Casac Benjali brings practical sales experience to coaching individuals and teams to improve their sales capabilities, customer engagement, conversion, productivity, and revenue performance.",
		focus: [
			"Sales Performance",
			"Sales Strategy",
			"Customer Engagement",
			"Conversion Improvement",
			"Negotiation",
			"High-Performance Selling",
		],
		tint: "rgba(130, 235, 190, 0.08)",
	},
	{
		num: "04",
		title: "Leadership Coach",
		tagline: "Developing Leaders Who Create Impact",
		description:
			"Casac Benjali works with business leaders, managers, and management teams to strengthen leadership capabilities, build high-performing teams, make better decisions, and improve organisational performance.",
		focus: [
			"Leadership Mindset",
			"Team Building",
			"People Management",
			"Decision Making",
			"Communication",
			"Strategic Leadership",
		],
		tint: "rgba(190, 140, 255, 0.08)",
	},
	{
		num: "05",
		title: "Serial Entrepreneur",
		tagline: "Building Businesses Through Execution",
		description:
			"Beyond consulting and coaching, Casac Benjali brings hands-on entrepreneurial experience from building and managing businesses across multiple industries.",
		focus: [
			"Entrepreneurship",
			"Business Development",
			"Execution",
			"Business Growth",
			"Strategic Thinking",
		],
		tint: "rgba(255, 130, 150, 0.08)",
	},
	{
		num: "06",
		title: "Global Trainer",
		tagline: "Developing People. Strengthening Performance.",
		description:
			"Casac Benjali delivers customised training and development programmes for entrepreneurs, sales professionals, business leaders, teams, and organisations, designed around specific business objectives, people capabilities, and performance requirements.",
		focus: [
			"Leadership",
			"Sales",
			"Entrepreneurship",
			"Team Performance",
			"Business Strategy",
			"Personal Development",
		],
		tint: "rgba(240, 220, 130, 0.08)",
	},
];

const TOTAL = EXPERTISE.length;

function MyExpertise() {
	const rootRef = useRef(null);
	const activeIndex = useRef(0);

	useGsap(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const reducedMotion = window.matchMedia(
				"(prefers-reduced-motion: reduce)"
			).matches;

			/*
			 * Section entry — header + intro reveal.
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
			 * Scroll-driven step transitions across the sticky stage.
			 */
			const layers = gsap.utils.toArray(`[data-layer]`, root);
			const tints = gsap.utils.toArray(`[data-tint]`, root);
			const progressFill = root.querySelector(`[data-progress-fill]`);
			const progressCurrent = root.querySelector(
				`[data-progress-current]`
			);
			const outro = root.querySelector(`[data-outro]`);
			let stepTweens = [];

			const showStep = (index) => {
				stepTweens.forEach((tween) => tween.kill());
				stepTweens = [];

				layers.forEach((layer, i) => {
					const active = i === index;

					stepTweens.push(
						gsap.to(layer, {
							opacity: active ? 1 : 0,
							y: active ? 0 : 34,
							scale: active ? 1 : 0.985,
							duration: reducedMotion ? 0.01 : 0.65,
							ease: active ? "power3.out" : "power3.in",
							overwrite: true,
							onStart: () => {
								layer.style.pointerEvents = active
									? "auto"
									: "none";
							},
						})
					);
				});

				tints.forEach((tint, i) => {
					stepTweens.push(
						gsap.to(tint, {
							opacity: i === index ? 1 : 0,
							duration: reducedMotion ? 0.01 : 0.9,
							ease: "power2.out",
							overwrite: true,
						})
					);
				});

				if (progressCurrent) {
					progressCurrent.textContent = EXPERTISE[index].num;
				}
			};

			const stageTrigger = ScrollTrigger.create({
				trigger: root.querySelector(`[data-stage-scroll]`),
				start: "top top",
				end: "bottom bottom",
				onUpdate: (self) => {
					const raw = Math.min(
						TOTAL - 1,
						Math.floor(self.progress * TOTAL)
					);
					if (raw !== activeIndex.current) {
						activeIndex.current = raw;
						showStep(raw);
					}
				},
			});

			/*
			 * Progress bar fill, tied to stage progress.
			 */
			gsap.to(progressFill, {
				scaleX: 1,
				ease: "none",
				scrollTrigger: {
					trigger: root.querySelector(`[data-stage-scroll]`),
					start: "top top",
					end: "bottom bottom",
					scrub: true,
				},
			});

			/*
			 * Closing statement.
			 */
			const outroTrigger = gsap.from(outro, {
				y: 56,
				opacity: 0,
				duration: reducedMotion ? 0.01 : 1,
				ease: "expo.out",
				scrollTrigger: {
					trigger: outro,
					start: "top 82%",
					toggleActions: "play none none reverse",
				},
			});

			return () => {
				stepTweens.forEach((tween) => tween.kill());
				stageTrigger.kill();
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
		<section ref={rootRef} className="relative w-full bg-[#050505]">
			{/*
			 * ------------------------------------------------------------------
			 * SECTION ENTRY
			 * ------------------------------------------------------------------
			 */}
			<div className="w-full px-[clamp(24px,7vw,120px)] py-[clamp(96px,12vw,180px)]">
				<div className="mx-auto grid w-full max-w-[72rem] gap-[clamp(36px,5vw,64px)]">
					<SectionTitle title="My Expertise" />

					<div className="grid gap-6">
						<h3
							data-reveal=""
							className="m-0 text-[clamp(1.6rem,1.1rem+2vw,3rem)] font-bold leading-[1.06] tracking-[-0.02em] text-slate-50">
							Expertise Built on Experience. Focused on
							Performance.
						</h3>

						<div
							data-reveal=""
							className="grid gap-5 text-[clamp(0.95rem,0.85rem+0.35vw,1.15rem)] leading-[1.7] text-slate-400">
							<p className="m-0">
								From strategic consulting and business coaching
								to sales, leadership, entrepreneurship, and
								professional training, Casac Benjali brings
								together practical business experience and
								strategic thinking to help people and
								organisations perform at their best.
							</p>
							<p className="m-0">
								With experience across{" "}
								<strong className="font-semibold text-slate-50">
									India and the GCC
								</strong>
								, his work focuses on turning business
								challenges into practical strategies, developing
								high-performing leaders and teams, strengthening
								sales performance, and creating sustainable
								business growth.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/*
			 * ------------------------------------------------------------------
			 * STAGE — sticky storytelling area, one viewport step per expertise
			 * ------------------------------------------------------------------
			 */}
			<div data-stage-scroll="" className="relative h-[700vh]">
				<div className="sticky top-0 h-screen overflow-hidden">
					{/* per-step background tint layers */}
					{EXPERTISE.map((item, i) => (
						<span
							data-tint=""
							aria-hidden="true"
							key={`tint-${item.num}`}
							className="pointer-events-none absolute inset-0 transition-opacity duration-500"
							style={{
								background: `radial-gradient(circle at 50% 42%, ${item.tint} 0%, transparent 62%)`,
								opacity: i === 0 ? 1 : 0,
							}}
						/>
					))}

					<div className="relative z-1 mx-auto grid h-full w-full max-w-[80rem] content-center px-[clamp(24px,7vw,120px)]">
						{EXPERTISE.map((item, i) => (
							<div
								data-layer=""
								key={item.num}
								className="absolute inset-[clamp(24px,7vw,120px)] grid grid-cols-1 items-center gap-[clamp(28px,4vw,64px)] transition-opacity duration-500 lg:grid-cols-[auto_minmax(0,1fr)_auto]"
								style={{
									opacity: i === 0 ? 1 : 0,
									pointerEvents: i === 0 ? "auto" : "none",
								}}>
								{/* left — large animated number */}
								<p
									aria-hidden="true"
									className="m-0 hidden bg-gradient-to-b from-white/85 to-white/20 bg-clip-text text-[clamp(6rem,14vw,15rem)] font-extrabold leading-none tracking-[-0.06em] text-transparent select-none lg:block">
									{item.num}
								</p>

								{/* center — title + description */}
								<div className="grid gap-5">
									<p className="m-0 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 lg:hidden">
										{item.num} — {item.title}
									</p>
									<h4 className="m-0 text-[clamp(1.7rem,1.2rem+2.2vw,3.4rem)] font-bold leading-[1.04] tracking-[-0.03em] text-slate-50">
										{item.tagline}
									</h4>
									<p className="m-0 max-w-56ch text-[clamp(0.95rem,0.85rem+0.3vw,1.1rem)] leading-[1.7] text-slate-400">
										{item.description}
									</p>
								</div>

								{/* right — core focus keywords */}
								<ul className="flex flex-wrap gap-2 lg:grid lg:max-w-52 lg:gap-2.5">
									{item.focus.map((keyword) => (
										<li
											key={keyword}
											className="rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-[0.7rem] font-semibold tracking-wide text-slate-300">
											{keyword}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>

					{/* progress indicator 01 / 06 */}
					<div className="absolute bottom-[clamp(24px,5vw,56px)] left-[clamp(24px,7vw,120px)] right-[clamp(24px,7vw,120px)] z-2 grid gap-3">
						<div className="flex items-baseline justify-between text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
							<span>
								<span data-progress-current="">
									{EXPERTISE[0].num}
								</span>
								<span aria-hidden="true"> / </span>
								<span>{EXPERTISE[TOTAL - 1].num}</span>
							</span>
							<span className="hidden sm:inline">
								Scroll to explore
							</span>
						</div>
						<div className="h-px w-full overflow-hidden bg-white/15">
							<div
								data-progress-fill=""
								className="h-full w-full origin-left scale-x-0 bg-white"
							/>
						</div>
					</div>
				</div>
			</div>

			{/*
			 * ------------------------------------------------------------------
			 * CLOSING STATEMENT + LINKS
			 * ------------------------------------------------------------------
			 */}
			<div className="w-full px-[clamp(24px,7vw,120px)] py-[clamp(96px,12vw,180px)]">
				<div
					data-outro=""
					className="mx-auto grid w-full max-w-[72rem] gap-[clamp(28px,4vw,48px)]">
					<div className="grid gap-5">
						<p className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
							Expertise That Connects Strategy With Execution
						</p>
						<h4 className="m-0 text-[clamp(1.4rem,1rem+1.8vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.02em] text-slate-50">
							<span className="text-slate-400">
								Better Thinking
							</span>
							<span
								aria-hidden="true"
								className="mx-3 text-slate-600">
								→
							</span>
							<span className="text-slate-400">
								Better Decisions
							</span>
							<span
								aria-hidden="true"
								className="mx-3 text-slate-600">
								→
							</span>
							<span className="text-slate-400">
								Better Performance
							</span>
							<span
								aria-hidden="true"
								className="mx-3 text-slate-600">
								→
							</span>
							<span>Better Business Growth</span>
						</h4>
					</div>

					<div className="flex flex-wrap items-center gap-x-8 gap-y-4">
						<a
							href="/programmes"
							className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-50 transition-colors duration-300 hover:text-white">
							<span className="border-b border-white/25 pb-1 transition-colors duration-300 group-hover:border-white/70">
								Explore Services
							</span>
							<span
								aria-hidden="true"
								className="inline-block transition-transform duration-300 group-hover:translate-x-1">
								→
							</span>
						</a>
						<a
							href="/contact"
							className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-50 transition-colors duration-300 hover:text-white">
							<span className="border-b border-white/25 pb-1 transition-colors duration-300 group-hover:border-white/70">
								Work With Me
							</span>
							<span
								aria-hidden="true"
								className="inline-block transition-transform duration-300 group-hover:translate-x-1">
								→
							</span>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}

export default MyExpertise;