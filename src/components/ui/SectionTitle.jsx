"use client";

import { useId, useRef } from "react";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { useGsap } from "@/hooks/useGsap";


const ALIGN_CLASSES = {
	start: "justify-items-start text-left",
	center: "justify-items-center text-center mx-auto",
	end: "justify-items-end text-right ml-auto",
};

const GLYPH_CLASS =
	"inline-block origin-[50%_58%] backface-hidden [will-change:transform,opacity,filter] motion-reduce:[transform:none]! motion-reduce:[filter:none]!";

const TITLE_GLYPH_CLASS = `${GLYPH_CLASS} [text-shadow:0_1px_0_rgb(255,255,255,0.2),0_20px_60px_rgb(0,0,0,0.3)]`;

const SUBTITLE_GLYPH_CLASS = `${GLYPH_CLASS} [text-shadow:0_10px_28px_rgb(0,0,0,0.18)]`;


const TITLE_CLASS =
	"mb-6.25 overflow-visible text-balance font-extrabold leading-[0.92] tracking-normal text-slate-50";

const TITLE_SIZE_CLASSES = {
	h1: "text-xxxxxl",
	h2: "text-xxxxl",
	h3: "text-xxxl",
	h4: "text-xxl",
	h5: "text-xl",
	h6: "text-lg",
};

function renderGlyphs(text, className) {
	return Array.from(text).map((character, index) => (
		<span
			className={`${GLYPH_CLASS} ${className}`}
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
	const headingLevel = typeof Heading === "string" ? Heading : "h2";
	const titleSizeClass = TITLE_SIZE_CLASSES[headingLevel] ?? TITLE_SIZE_CLASSES.h2;
	const usesDustAnimation = headingLevel === "h2";

	useGsap(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
			const glyphs = gsap.utils.toArray(`[data-glyph]`, root);
			const hasGlyphs = glyphs.length > 0;

			let dustTrigger;
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

			let slideTrigger;

			/* Subtitle glyphs (+ H2 title) — glyph dust. */
			if (hasGlyphs) {
				resetToDust();

				dustTrigger = ScrollTrigger.create({
					trigger: root,
					start,
					end,
					onEnter: dustToTitle,
					onEnterBack: dustToTitle,
					onLeave: titleToDust,
					onLeaveBack: titleToDust,
				});
			}

			/* Non-H2 titles — smooth slide-up reveal. */
			const slideTitle = root.querySelector(`[data-slide-title]`);

			if (slideTitle) {
				slideTrigger = gsap.fromTo(
					slideTitle,
					{ y: 99, opacity: 0 },
					{
						y: 0,
						opacity: 1,
						duration: reducedMotion.matches ? 0.01 : 0.9,
						ease: "expo.out",
						scrollTrigger: {
							trigger: root,
							start,
							end,
							toggleActions: "play none none reverse",
						},
					}
				);
			}

			return () => {
				dustTrigger?.kill();
				gsap.killTweensOf(glyphs);
				slideTrigger?.scrollTrigger?.kill();
				slideTrigger?.kill();
			};
		},
		{
			scope: rootRef,
			dependencies: [mainTitle, subtitle, start, end, headingLevel],
		}
	);

	if (!mainTitle && !subtitle) return null;

	return (
		<header
			ref={rootRef}
			className={`${ALIGN_CLASSES[align] ?? ALIGN_CLASSES.start} grid w-full max-w-6xl overflow-visible gap-2 text-[#f5f7fa] sm:gap-[0.65rem] ${className}`.trim()}
			aria-labelledby={mainTitle ? headingId : undefined}
		>
			{subtitle ? (
				<p
					aria-label={subtitle}
					className="max-w-3xl overflow-visible text-balance text-[clamp(0.78rem,0.72rem+0.28vw,0.98rem)] font-bold leading-[1.2] tracking-widest text-[#8892a0] uppercase sm:tracking-[0.14em]"
				>
					{renderGlyphs(subtitle, SUBTITLE_GLYPH_CLASS)}
				</p>
			) : null}

			{mainTitle && usesDustAnimation ? (
				<Heading id={headingId} aria-label={mainTitle} className={`${TITLE_CLASS} ${titleSizeClass}`}>
					{renderGlyphs(mainTitle, TITLE_GLYPH_CLASS)}
				</Heading>
			) : null}

			{mainTitle && !usesDustAnimation ? (
				<Heading id={headingId} data-slide-title="" className={`${TITLE_CLASS} ${titleSizeClass}`}>
					{mainTitle}
				</Heading>
			) : null}
		</header>
	);
}

export default SectionTitle;
