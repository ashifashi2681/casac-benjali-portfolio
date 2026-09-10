"use client";

import { useRef } from "react";
import SectionTitle from "../ui/SectionTitle/SectionTitle";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { useGsap } from "@/hooks/useGsap";
import styles from "./ImpactAtAGlance.module.css";

const STATS = [
	{
		value: 2500,
		suffix: "+",
		label: "Consulting Projects",
		description:
			"Strategic consulting and business transformation projects delivered across diverse industries.",
	},
	{
		value: 500000,
		suffix: "+",
		label: "People Coached & Trained",
		description:
			"Entrepreneurs, business leaders, sales professionals, and teams supported through coaching and professional development.",
	},
	{
		value: 15,
		suffix: "+ Years",
		label: "Strategic Consulting Experience",
		description:
			"Extensive experience helping businesses improve strategy, performance, leadership, sales, and operational efficiency.",
	},
	{
		value: null,
		display: "India & GCC",
		label: "Global Experience",
		description:
			"Consulting, coaching, and training experience spanning businesses and professionals across India and GCC markets.",
	},
	{
		value: null,
		display: "Multiple",
		label: "Business Experience",
		description:
			"Experience across business, education, sales, leadership, travel, consulting, and other professional sectors.",
	},
];

function formatValue(value) {
	if (value >= 1000000) return `${(value / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
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

			const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
								el.textContent = formatValue(Math.round(state.value));
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
		<section ref={rootRef} className={styles.section} aria-labelledby="impact-heading">
			<span data-glow="" className={styles.glow} aria-hidden="true" />

			<div className={styles.inner}>
				<SectionTitle title="Impact at a Glance" />

				<div data-reveal="" className={styles.narrative}>
					<h3 id="impact-heading" className={styles.heading}>
						Experience That Drives Business Growth
					</h3>
					<p className={styles.lede}>
						Nearly two decades of experience in{" "}
						<strong>business consulting, performance coaching, leadership development, sales coaching, and entrepreneurship</strong>
						, helping individuals, entrepreneurs, and organisations achieve stronger performance and sustainable
						growth across <strong>India and the GCC</strong>.
					</p>
				</div>

				<ul ref={statsRef} className={styles.grid}>
					{STATS.map((stat) => (
						<li data-card="" className={styles.card} key={stat.label}>
							<p className={styles.value}>
								{stat.value != null ? (
									<span data-count={stat.value}>{formatValue(stat.value)}</span>
								) : (
									<span>{stat.display}</span>
								)}
								{stat.suffix ? <span className={styles.suffix}>{stat.suffix}</span> : null}
							</p>

							<h4 className={styles.label}>{stat.label}</h4>

							<p className={styles.description}>{stat.description}</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

export default ImpactAtAGlance;
