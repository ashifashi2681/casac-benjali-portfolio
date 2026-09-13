"use client";

import { useRef } from "react";
import SectionTitle from "../ui/SectionTitle";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { useGsap } from "@/hooks/useGsap";

const SERVICES = [
	{
		num: "01",
		title: "Sales Coaching",
		tagline: "Turning Sales Potential Into Performance",
		description:
			"Develop stronger sales capabilities, customer engagement, negotiation, conversion, and high-performance selling skills to support consistent sales growth.",
		focus: [
			"Sales Performance",
			"Sales Strategy",
			"Customer Engagement",
			"Negotiation",
		],
		tint: "bg-[radial-gradient(circle_at_top_right,rgba(217,154,50,0.14)_0%,transparent_62%)]",
	},
	{
		num: "02",
		title: "Leadership Coaching",
		tagline: "Developing Leaders Who Create Impact",
		description:
			"Build stronger leadership capabilities, improve decision-making, develop high-performing teams, and create a culture of accountability and organisational growth.",
		focus: [
			"Leadership Mindset",
			"Team Building",
			"People Management",
			"Strategic Leadership",
		],
		tint: "bg-[radial-gradient(circle_at_top_left,rgba(0,163,255,0.14)_0%,transparent_62%)]",
	},
];

const LINKS = [
	{ label: "Explore Coaching", href: "/programmes" },
	{ label: "Work With Me", href: "/contact" },
];

function SalesLeadershipCoaching() {
	const rootRef = useRef(null);

	useGsap(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const reducedMotion = window.matchMedia(
				"(prefers-reduced-motion: reduce)"
			).matches;

			/*
			 * Generic reveals — header + intro.
			 */
			gsap.from(`[data-reveal]`, {
				y: 48,
				opacity: 0,
				duration: reducedMotion ? 0.01 : 1,
				ease: "expo.out",
				stagger: 0.1,
				scrollTrigger: {
					trigger: root,
					start: "top 78%",
					toggleActions: "play none none reverse",
				},
			});

			/*
			 * Service cards — staggered per group.
			 */
			gsap.utils.toArray(`[data-group]`, root).forEach((group) => {
				const items = gsap.utils.toArray(`[data-item]`, group);
				if (!items.length) return;

				gsap.from(items, {
					y: 40,
					opacity: 0,
					duration: reducedMotion ? 0.01 : 0.85,
					ease: "power3.out",
					stagger: 0.08,
					scrollTrigger: {
						trigger: group,
						start: "top 82%",
						toggleActions: "play none none reverse",
					},
				});
			});

			/*
			 * Dual-track convergence — SALES and LEADERSHIP glide
			 * toward a shared centre point, then the centre statement,
			 * short descriptions, and CTAs appear.
			 */
			const stage = root.querySelector(`[data-converge]`);
			const tracksRow = root.querySelector(`[data-tracks]`);
			const salesTrack = root.querySelector(`[data-track-sales]`);
			const leadershipTrack = root.querySelector(
				`[data-track-leadership]`
			);
			const line = root.querySelector(`[data-line]`);
			const statements = gsap.utils.toArray(`[data-statement]`, root);
			const notes = gsap.utils.toArray(`[data-note]`, root);
			const ctas = root.querySelector(`[data-ctas]`);

			const mm = gsap.matchMedia();

			if (stage && tracksRow && salesTrack && leadershipTrack) {
				/* Horizontal distance from each label to the shared centre. */
				const toCentre = (el, dir) => () =>
					dir * Math.max(0, (tracksRow.offsetWidth - el.offsetWidth) / 2);

				/* Desktop — scrubbed convergence timeline. */
				mm.add(
					"(min-width: 768px) and (prefers-reduced-motion: no-preference)",
					() => {
						const tl = gsap.timeline({
							defaults: { ease: "power2.out" },
							scrollTrigger: {
								trigger: stage,
								start: "top 72%",
								end: "center 45%",
								scrub: 0.6,
								invalidateOnRefresh: true,
							},
						});

						tl.fromTo(
							salesTrack,
							{ x: toCentre(salesTrack, 1), opacity: 0.2 },
							{ x: 0, opacity: 1, duration: 0.5 },
							0
						)
							.fromTo(
								leadershipTrack,
								{ x: toCentre(leadershipTrack, -1), opacity: 0.2 },
								{ x: 0, opacity: 1, duration: 0.5 },
								0
							)
							.fromTo(
								line,
								{ scaleY: 0 },
								{ scaleY: 1, duration: 0.3 },
								0.12
							)
							.fromTo(
								statements,
								{ y: 36, opacity: 0 },
								{ y: 0, opacity: 1, stagger: 0.1, duration: 0.3 },
								0.45
							)
							.fromTo(
								notes,
								{ y: 28, opacity: 0 },
								{ y: 0, opacity: 1, stagger: 0.1, duration: 0.25 },
								0.65
							)
							.fromTo(
								ctas,
								{ y: 22, opacity: 0 },
								{ y: 0, opacity: 1, duration: 0.2 },
								0.85
							);
					}
				);

				/* Mobile — stacked reveals, no horizontal movement. */
				mm.add(
					"(max-width: 767px) and (prefers-reduced-motion: no-preference)",
					() => {
						const tweens = [];

						[salesTrack, leadershipTrack, ...statements, ...notes]
							.filter(Boolean)
							.forEach((el) => {
								tweens.push(
									gsap.from(el, {
										y: 36,
										opacity: 0,
										duration: 0.85,
										ease: "power3.out",
										scrollTrigger: {
											trigger: el,
											start: "top 86%",
											toggleActions: "play none none reverse",
										},
									})
								);
							});

						if (line) {
							tweens.push(
								gsap.from(line, {
									scaleY: 0,
									duration: 0.8,
									ease: "power3.out",
									scrollTrigger: {
										trigger: line,
										start: "top 88%",
										toggleActions: "play none none reverse",
									},
								})
							);
						}

						if (ctas) {
							tweens.push(
								gsap.from(ctas, {
									y: 24,
									opacity: 0,
									duration: 0.85,
									ease: "power3.out",
									scrollTrigger: {
										trigger: ctas,
										start: "top 90%",
										toggleActions: "play none none reverse",
									},
								})
							);
						}

						return () => {
							tweens.forEach((tween) => {
								tween.scrollTrigger?.kill();
								tween.kill();
							});
						};
					}
				);
			}

			return () => {
				mm.revert();
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
		<section
			ref={rootRef}
			className="relative w-full overflow-hidden bg-[#050505]">
			{/* ambient glows — gold for sales, blue for leadership */}
			<span
				aria-hidden="true"
				className="pointer-events-none absolute left-[-12%] top-[14%] z-0 h-[min(680px,70vw)] w-[min(680px,70vw)] rounded-full bg-[radial-gradient(circle_at_center,rgba(217,154,50,0.07)_0%,transparent_65%)]"
			/>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute right-[-12%] top-[42%] z-0 h-[min(680px,70vw)] w-[min(680px,70vw)] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,163,255,0.07)_0%,transparent_65%)]"
			/>

			{/* HEADER / INTRO */}
			<div className="relative z-1 w-full px-[clamp(24px,7vw,120px)] pt-[clamp(96px,12vw,180px)]">
				<div className="mx-auto grid w-full max-w-[72rem] gap-[clamp(32px,4vw,56px)]">
					<SectionTitle title="Sales & Leadership Coaching" />

					<div className="grid gap-6">
						<h3
							data-reveal=""
							className="m-0 max-w-22ch text-[clamp(1.7rem,1.2rem+2.2vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-slate-50">
							Developing People.{" "}
							<span className="text-slate-500">
								Strengthening Performance.
							</span>
						</h3>

						<p
							data-reveal=""
							className="m-0 max-w-64ch leading-[1.7] text-slate-400">
							Casac Benjali helps{" "}
							<strong className="font-semibold text-slate-200">
								sales professionals, sales teams, business
								leaders, and managers
							</strong>{" "}
							strengthen their capabilities, improve
							performance, and create lasting organisational
							impact through practical sales and leadership
							coaching.
						</p>
					</div>
				</div>
			</div>

			{/* SERVICE CARDS */}
			<div className="relative z-1 mt-[clamp(64px,8vw,120px)] w-full px-[clamp(24px,7vw,120px)]">
				<div
					data-group=""
					className="mx-auto grid w-full max-w-[72rem] gap-[clamp(20px,2.5vw,32px)] md:grid-cols-2">
					{SERVICES.map((service) => (
						<article
							data-item=""
							key={service.title}
							className="relative grid gap-[clamp(18px,2vw,28px)] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-[clamp(24px,3.5vw,48px)] backdrop-blur-md transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06]">
							<span
								aria-hidden="true"
								className={`pointer-events-none absolute inset-0 z-0 ${service.tint}`}
							/>

							<span className="relative z-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
								{service.num}
							</span>

							<div className="relative z-1 grid gap-3">
								<h4 className="m-0 text-xl font-bold tracking-[-0.01em] text-slate-50">
									{service.title}
								</h4>
								<p className="m-0 text-sm font-semibold text-slate-400">
									{service.tagline}
								</p>
							</div>

							<p className="relative z-1 m-0 max-w-52ch text-sm leading-[1.7] text-slate-400">
								{service.description}
							</p>

							<div className="relative z-1 grid gap-3">
								<p className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
									Focus
								</p>
								<ul className="flex flex-wrap gap-2">
									{service.focus.map((item) => (
										<li
											key={item}
											className="rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-[0.7rem] font-semibold tracking-wide text-slate-300">
											{item}
										</li>
									))}
								</ul>
							</div>
						</article>
					))}
				</div>
			</div>

			{/* DUAL-TRACK CONVERGENCE */}
			<div
				data-converge=""
				className="relative z-1 w-full px-[clamp(24px,7vw,120px)] py-[clamp(96px,12vw,180px)]">
				<div className="mx-auto grid w-full max-w-[72rem] justify-items-center gap-[clamp(40px,6vw,80px)]">
					{/* two separate labels */}
					<div
						data-tracks=""
						className="grid w-full gap-[clamp(24px,4vw,56px)] md:grid-cols-2">
						<div
							data-track-sales=""
							className="grid justify-items-center md:justify-items-start">
							<h4 className="m-0 text-[clamp(2.2rem,1rem+4.6vw,6.5rem)] font-extrabold leading-none tracking-[-0.05em] text-slate-50">
								SALES
							</h4>
						</div>
						<div
							data-track-leadership=""
							className="grid justify-items-center md:justify-items-end">
							<h4 className="m-0 text-[clamp(2.2rem,1rem+4.6vw,6.5rem)] font-extrabold leading-none tracking-[-0.05em] text-slate-50">
								LEADERSHIP
							</h4>
						</div>
					</div>

					{/* shared centre point */}
					<span
						data-line=""
						aria-hidden="true"
						className="hidden h-[clamp(48px,8vw,110px)] w-px origin-top bg-gradient-to-b from-white/30 via-white/15 to-transparent md:block"
					/>

					<div className="grid w-full justify-items-center gap-[clamp(28px,4vw,48px)] text-center">
						{/* centre statement */}
						<h4 className="m-0 max-w-20ch text-balance text-[clamp(1.6rem,1rem+2.4vw,3.2rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-slate-50">
							<span data-statement="" className="inline-block">
								Better People.
							</span>{" "}
							<span
								data-statement=""
								className="inline-block bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
								Better Performance.
							</span>{" "}
							<span data-statement="" className="inline-block">
								Stronger Businesses.
							</span>
						</h4>

						{/* short service descriptions — staggered */}
						<div className="grid w-full max-w-[60rem] gap-[clamp(16px,2vw,24px)] md:grid-cols-2">
							<div
								data-note=""
								className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06]">
								<p className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
									Sales <span aria-hidden="true">→</span>{" "}
									Performance
								</p>
								<p className="m-0 text-sm leading-[1.6] text-slate-400">
									Sales capabilities, customer engagement,
									negotiation, and conversion.
								</p>
							</div>
							<div
								data-note=""
								className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06]">
								<p className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
									Leadership{" "}
									<span aria-hidden="true">→</span> Impact
								</p>
								<p className="m-0 text-sm leading-[1.6] text-slate-400">
									Leadership mindset, team building,
									decision-making, and organisational
									performance.
								</p>
							</div>
						</div>

						{/* CTAs */}
						<div
							data-ctas=""
							className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
							{LINKS.map((link) => (
								<a
									key={link.label}
									href={link.href}
									className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-50 transition-colors duration-300 hover:text-white">
									<span className="border-b border-white/25 pb-1 transition-colors duration-300 group-hover:border-white/70">
										{link.label}
									</span>
									<span
										aria-hidden="true"
										className="inline-block transition-transform duration-300 group-hover:translate-x-1">
										→
									</span>
								</a>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default SalesLeadershipCoaching;
