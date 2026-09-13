"use client";

import { useRef } from "react";
import SectionTitle from "../ui/SectionTitle";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { useGsap } from "@/hooks/useGsap";
import { HOME } from "@/data/home";
import Desc from "../ui/Desc";
import Card from "../ui/Card";

function formatValue(value) {
	if (value >= 1000000)
		return `${(value / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
	if (value >= 1000) return value.toLocaleString("en-US");
	return String(value);
}

function ImpactAtAGlance() {
	const rootRef = useRef(null);
	const statsRef = useRef(null);

	useGsap(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const reducedMotion = window.matchMedia(
				"(prefers-reduced-motion: reduce)"
			).matches;

			/*
			 * Header + narrative reveal.
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
			 * Stat cards — staggered rise.
			 */
			const cards = gsap.utils.toArray(`[data-card]`, statsRef.current);
			if (cards.length) {
				gsap.from(cards, {
					y: 70,
					opacity: 0,
					scale: 0.96,
					duration: reducedMotion ? 0.01 : 1.05,
					ease: "power3.out",
					stagger: 0.1,
					scrollTrigger: {
						trigger: statsRef.current,
						start: "top 80%",
						toggleActions: "play none none reverse",
					},
				});
			}

			/*
			 * Count-up for numeric values.
			 */
			if (!reducedMotion) {
				gsap.utils
					.toArray(`[data-count]`, statsRef.current)
					.forEach((el) => {
						const target = Number(el.dataset.count);
						if (!Number.isFinite(target)) return;

						const state = { value: 0 };

						gsap.to(state, {
							value: target,
							duration: 2,
							ease: "power2.out",
							scrollTrigger: {
								trigger: el,
								start: "top 88%",
								once: true,
							},
							onUpdate: () => {
								el.textContent = formatValue(
									Math.round(state.value)
								);
							},
							onComplete: () => {
								el.textContent = formatValue(target);
							},
						});
					});
			}

			/*
			 * Subtle parallax glow behind the grid.
			 */
			const glow = root.querySelector(`[data-glow]`);
			let glowTrigger;
			if (glow && !reducedMotion) {
				glowTrigger = gsap.to(glow, {
					yPercent: 18,
					ease: "none",
					scrollTrigger: {
						trigger: root,
						start: "top bottom",
						end: "bottom top",
						scrub: true,
					},
				});
			}

			return () => {
				glowTrigger?.scrollTrigger?.kill();
				glowTrigger?.kill();
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
			aria-labelledby="impact-heading"
			className="relative isolate w-full overflow-hidden bg-background py-[clamp(96px,12vw,180px)] px-[clamp(24px,7vw,120px)]">
			<span
				data-glow=""
				aria-hidden="true"
				className="pointer-events-none absolute top-[30%] left-1/2 z-0 h-[min(880px,90vw)] w-[min(880px,90vw)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_40%,transparent_70%)]"
			/>

			<div className="relative z-10 mx-auto grid w-full max-w-6xl gap-[clamp(40px,6vw,72px)]">
				<SectionTitle subtitle={HOME.eybrow} title={HOME.title} />

				<div data-reveal="" className="grid max-w-240 gap-5">
					<SectionTitle as="h5">{HOME.subTitle}</SectionTitle>
					<Desc data-reveal="" data={HOME.desc} />
				</div>
				<ul
					ref={statsRef}
					className="grid list-none grid-cols-1 gap-[clamp(18px,2vw,28px)] sm:grid-cols-2 lg:grid-cols-3">
					{HOME?.STATS.map((stat) => (
						<li data-card="" key={stat.label}>
							<Card cardClass={"relative grid gap-3"}>
								<p className="flex flex-wrap items-baseline gap-1.5 text-xxl font-extrabold leading-none tracking-[-0.04em] tabular-nums text-foreground">
									{stat.value != null ? (
										<span data-count={stat.value}>
											{formatValue(stat.value)}
										</span>
									) : (
										<span>{stat.display}</span>
									)}
									{stat.suffix ? (
										<span className="text-md font-bold tracking-[-0.01em] text-foreground/62">
											{stat.suffix}
										</span>
									) : null}
								</p>

								<h4 className="mt-1 text-sm font-bold leading-[1.3] tracking-[0.12em] text-foreground/90 uppercase">
									{stat.label}
								</h4>

								<p className="text-sm leading-[1.55] text-foreground-secondary">
									{stat.description}
								</p>
							</Card>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

export default ImpactAtAGlance;
