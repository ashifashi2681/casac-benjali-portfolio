"use client";

import { useRef } from "react";
import SectionTitle from "../ui/SectionTitle/SectionTitle";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { useGsap } from "@/hooks/useGsap";

const GLANCE_ITEMS = [
	{ strong: "15+ years", rest: "of strategic consulting experience" },
	{ strong: "2,500+", rest: "consulting projects" },
	{ strong: "500,000+", rest: "people coached and trained" },
	{ strong: "India & GCC", rest: "experience across markets" },
];

const EXPERTISE = [
	"Business Strategy",
	"Entrepreneurship",
	"Leadership",
	"Sales",
	"Marketing",
	"Branding",
	"Personal Development",
	"Operational Efficiency",
];

function AboutCasacBenjali() {
	const rootRef = useRef(null);

	useGsap(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

			/*
			 * Narrative + image reveal.
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
			 * Glance cards + expertise chips — staggered rise.
			 */
			const items = gsap.utils.toArray(`[data-item]`, root);
			if (items.length) {
				gsap.from(items, {
					y: 40,
					opacity: 0,
					duration: reducedMotion ? 0.01 : 0.8,
					ease: "power3.out",
					stagger: 0.07,
					scrollTrigger: {
						trigger: `[data-item-group]`,
						start: "top 82%",
						toggleActions: "play none none reverse",
					},
				});
			}

			/*
			 * Closing banner.
			 */
			const banner = root.querySelector(`[data-banner]`);
			let bannerTrigger;
			if (banner) {
				bannerTrigger = gsap.from(banner, {
					y: 40,
					opacity: 0,
					scale: 0.98,
					duration: reducedMotion ? 0.01 : 0.9,
					ease: "power3.out",
					scrollTrigger: {
						trigger: banner,
						start: "top 85%",
						toggleActions: "play none none reverse",
					},
				});
			}

			return () => {
				bannerTrigger?.scrollTrigger?.kill();
				bannerTrigger?.kill();
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
			className="relative w-full overflow-hidden bg-[#050505] px-[clamp(24px,7vw,120px)] py-[clamp(96px,12vw,180px)]"
		>
			{/* ambient glow */}
			<span
				aria-hidden="true"
				className="pointer-events-none absolute left-1/2 top-1/4 z-0 h-[min(880px,90vw)] w-[min(880px,90vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_40%,transparent_70%)]"
			/>

			<div className="relative z-1 mx-auto grid w-full max-w-[72rem] gap-[clamp(48px,6vw,80px)]">
				<SectionTitle title="About Casac Benjali" />

				<div className="grid items-start gap-[clamp(40px,5vw,64px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
					{/* NARRATIVE */}
					<div className="grid gap-6">
						<h3
							data-reveal=""
							className="m-0 text-[clamp(1.5rem,1.1rem+1.8vw,2.6rem)] font-bold leading-[1.08] tracking-[-0.02em] text-slate-50"
						>
							From Sales to Strategy, Coaching &amp; Entrepreneurship
						</h3>

						<div data-reveal="" className="grid gap-5 text-[clamp(0.95rem,0.85rem+0.35vw,1.15rem)] leading-[1.7] text-slate-400">
							<p className="m-0">
								<strong className="font-semibold text-slate-50">Casac Benjali</strong> is a Strategic Consultant,
								Performance Business Coach, Sales Coach, Leadership Coach, Serial Entrepreneur, and Author with
								extensive experience helping entrepreneurs, business leaders, sales professionals, and
								organisations improve performance and achieve sustainable growth.
							</p>
							<p className="m-0">
								His professional journey began in <strong className="font-semibold text-slate-50">sales</strong>,
								where he developed practical experience in customer engagement, sales performance, and business
								development. He later expanded his expertise into{" "}
								<strong className="font-semibold text-slate-50">corporate and leadership coaching</strong>,
								strategic consulting, entrepreneurship, and business transformation.
							</p>

							<p className="m-0">
								His consulting journey began in{" "}
								<strong className="font-semibold text-slate-50">Dubai in 2011</strong>, leading to extensive
								experience working with businesses and professionals across{" "}
								<strong className="font-semibold text-slate-50">India and the GCC</strong>. Since then, he has
								worked across strategic consulting, business growth, leadership development, sales enhancement,
								operational efficiency, and performance improvement.
							</p>
							<p className="m-0">
								Today, Casac Benjali works with{" "}
								<strong className="font-semibold text-slate-50">
									entrepreneurs, business owners, corporate leaders, sales teams, and organisations
								</strong>{" "}
								through a combination of practical business experience, strategic thinking, structured coaching,
								and customised training.
							</p>
							<p className="m-0">
								His approach goes beyond theory — connecting{" "}
								<strong className="font-semibold text-slate-50">
									strategy with execution, leadership with performance, and business goals with measurable growth
								</strong>
								.
							</p>
						</div>

						<div data-reveal="">
							<a
								href="/about"
								className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-50 transition-colors duration-300 hover:text-white"
							>
								<span className="border-b border-white/25 pb-1 transition-colors duration-300 group-hover:border-white/70">
									Explore My Journey
								</span>
								<span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
									→
								</span>
							</a>
						</div>
					</div>

					{/* PORTRAIT (placeholder — image to be added later) */}
					<div data-reveal="" className="relative">
						<div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-md">
							{/* TODO: portrait image goes here */}
						</div>
					</div>
				</div>

				{/* EXPERIENCE AT A GLANCE */}
				<div data-item-group="" className="grid gap-8">
					<h3 data-reveal="" className="m-0 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
						Experience at a Glance
					</h3>

					<ul className="grid gap-[clamp(16px,2vw,24px)] sm:grid-cols-2 lg:grid-cols-4">
						{GLANCE_ITEMS.map((item) => (
							<li
								data-item=""
								key={item.strong}
								className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-md transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06]"
							>
								<p className="m-0 text-[clamp(1.8rem,1.3rem+1.6vw,2.6rem)] font-extrabold leading-none tracking-[-0.04em] text-white tabular-nums">
									{item.strong}
								</p>
								<p className="mt-3 mb-0 text-sm leading-snug text-slate-400">{item.rest}</p>
							</li>
						))}
					</ul>

					<ul className="flex flex-wrap gap-2">
						{EXPERTISE.map((topic) => (
							<li
								data-item=""
								key={topic}
								className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold tracking-wide text-slate-300 transition-colors duration-300 hover:border-white/25 hover:text-white"
							>
								{topic}
							</li>
						))}
					</ul>
				</div>

				{/* CLOSING BANNER */}
				<div
					data-banner=""
					className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-[clamp(28px,4vw,56px)] backdrop-blur-md"
				>
					<h3 className="m-0 max-w-24ch text-[clamp(1.4rem,1rem+1.6vw,2.4rem)] font-bold leading-[1.12] tracking-[-0.02em] text-slate-50">
						Building Better Leaders. Scaling Businesses. Creating Peak Performance.
					</h3>
					<p className="m-0 max-w-64ch leading-[1.7] text-slate-400">
						Casac Benjali&apos;s work is focused on one objective: helping people and businesses move from{" "}
						<strong className="font-semibold text-slate-50">potential to performance</strong> through better
						thinking, stronger leadership, practical strategy, and disciplined execution.
					</p>
				</div>
			</div>
		</section>
	);
}

export default AboutCasacBenjali;

