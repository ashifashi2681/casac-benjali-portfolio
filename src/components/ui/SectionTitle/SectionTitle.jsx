"use client";

import { useId, useRef } from "react";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { useGsap } from "@/hooks/useGsap";
import styles from "./SectionTitle.module.css";

function renderGlyphs(text, className) {
	return Array.from(text).map((character, index) => (
		<span
			className={`${styles.glyph} ${className}`}
			data-glyph=""
			aria-hidden="true"
			key={`${character}-${index}`}
		>
			{character === " " ? "\u00a0" : character}
		</span>
	));
}

function SectionTitle({
	title,
	subtitle,
	children,
	align = "start",
	as: Heading = "h2",
	className = "",
	start = "top 82%",
	end = "bottom 18%",
}) {
	const rootRef = useRef(null);
	const headingId = useId();
	const mainTitle = title ?? (typeof children === "string" ? children : "");

	useGsap(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const glyphs = gsap.utils.toArray(`[data-glyph]`, root);
			if (!glyphs.length) return;

			const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
			const randomOffset = () => ({
				x: gsap.utils.random(-120, 120),
				y: gsap.utils.random(-90, 90),
				rotation: gsap.utils.random(-32, 32),
				scale: gsap.utils.random(0.72, 1.18),
				filter: "blur(10px)",
				opacity: 0,
			});

			const resetToDust = () => {
				gsap.set(glyphs, {
					x: () => randomOffset().x,
					y: () => randomOffset().y,
					rotation: () => randomOffset().rotation,
					scale: () => randomOffset().scale,
					filter: "blur(10px)",
					opacity: 0,
				});
			};

			const dustToTitle = () => {
				if (reducedMotion.matches) {
					gsap.to(glyphs, { opacity: 1, duration: 0.25, stagger: 0.01 });
					return;
				}

				resetToDust();

				gsap.to(glyphs, {
					x: 0,
					y: 0,
					rotation: 0,
					scale: 1,
					filter: "blur(0px)",
					opacity: 1,
					duration: 1.05,
					ease: "expo.out",
					stagger: {
						each: 0.018,
						from: "random",
					},
					overwrite: true,
				});
			};

			const titleToDust = () => {
				if (reducedMotion.matches) {
					gsap.to(glyphs, { opacity: 0, duration: 0.2, stagger: 0.005 });
					return;
				}

				gsap.to(glyphs, {
					x: () => gsap.utils.random(-150, 150),
					y: () => gsap.utils.random(-110, 110),
					rotation: () => gsap.utils.random(-44, 44),
					scale: () => gsap.utils.random(0.64, 1.24),
					filter: "blur(12px)",
					opacity: 0,
					duration: 0.78,
					ease: "power3.inOut",
					stagger: {
						each: 0.012,
						from: "random",
					},
					overwrite: true,
				});
			};

			resetToDust();

			const trigger = ScrollTrigger.create({
				trigger: root,
				start,
				end,
				onEnter: dustToTitle,
				onEnterBack: dustToTitle,
				onLeave: titleToDust,
				onLeaveBack: titleToDust,
			});

			return () => {
				trigger.kill();
				gsap.killTweensOf(glyphs);
			};
		},
		{
			scope: rootRef,
			dependencies: [mainTitle, subtitle, start, end],
		}
	);

	if (!mainTitle && !subtitle) return null;

	return (
		<header
			ref={rootRef}
			className={`${styles.sectionTitle} ${styles[align] ?? styles.start} ${className}`.trim()}
			aria-labelledby={mainTitle ? headingId : undefined}
		>
			{subtitle ? (
				<p className={styles.subtitle} aria-label={subtitle}>
					{renderGlyphs(subtitle, styles.subtitleGlyph)}
				</p>
			) : null}

			{mainTitle ? (
				<Heading className={styles.title} id={headingId} aria-label={mainTitle}>
					{renderGlyphs(mainTitle, styles.titleGlyph)}
				</Heading>
			) : null}
		</header>
	);
}

export default SectionTitle;
