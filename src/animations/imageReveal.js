"use client";

import { gsap, ScrollTrigger } from "./gsap";

/**
 * Reveal an image using clip-path with an optional zoom effect.
 *
 * @param {HTMLElement|string} target
 * @param {Object} options
 * @returns {gsap.core.Timeline|null}
 */
export function imageReveal(target, options = {}) {
	if (typeof window === "undefined" || !target) return null;

	const element =
		typeof target === "string" ? document.querySelector(target) : target;

	if (!element) return null;

	const {
		duration = 1.2,
		delay = 0,
		ease = "power4.out",
		start = "top 85%",
		from = "inset(0 100% 0 0)",
		to = "inset(0 0% 0 0)",
		scaleFrom = 1.15,
		scaleTo = 1,
		once = true,
		scrollTrigger = true,
		onStart,
		onComplete,
	} = options;

	const image =
		element.tagName === "IMG" ? element : element.querySelector("img");

	const targetElement = image || element;

	const timeline = gsap.timeline({
		delay,
		scrollTrigger: scrollTrigger
			? {
					trigger: element,
					start,
					toggleActions: once
						? "play none none none"
						: "play reverse play reverse",
			  }
			: undefined,
		onStart,
		onComplete,
	});

	gsap.set(element, {
		clipPath: from,
		overflow: "hidden",
	});

	gsap.set(targetElement, {
		scale: scaleFrom,
		transformOrigin: "center center",
	});

	timeline
		.to(element, {
			clipPath: to,
			duration,
			ease,
		})
		.to(
			targetElement,
			{
				scale: scaleTo,
				duration,
				ease,
			},
			0
		);

	return timeline;
}

/**
 * Reveal multiple images with a stagger.
 *
 * @param {HTMLElement[]|NodeList|string} targets
 * @param {Object} options
 * @returns {gsap.core.Timeline|null}
 */
export function imageRevealStagger(targets, options = {}) {
	if (typeof window === "undefined" || !targets) return null;

	const elements =
		typeof targets === "string"
			? document.querySelectorAll(targets)
			: targets;

	if (!elements?.length) return null;

	const {
		duration = 1,
		delay = 0,
		stagger = 0.12,
		ease = "power4.out",
		start = "top 85%",
		once = true,
		from = "inset(0 100% 0 0)",
		to = "inset(0 0% 0 0)",
		scaleFrom = 1.1,
		scaleTo = 1,
	} = options;

	const timeline = gsap.timeline({
		delay,
		scrollTrigger: {
			trigger: elements[0],
			start,
			toggleActions: once
				? "play none none none"
				: "play reverse play reverse",
		},
	});

	elements.forEach((element, index) => {
		const image =
			element.tagName === "IMG" ? element : element.querySelector("img");

		const targetElement = image || element;

		gsap.set(element, {
			clipPath: from,
			overflow: "hidden",
		});

		gsap.set(targetElement, {
			scale: scaleFrom,
			transformOrigin: "center center",
		});

		timeline
			.to(
				element,
				{
					clipPath: to,
					duration,
					ease,
				},
				index * stagger
			)
			.to(
				targetElement,
				{
					scale: scaleTo,
					duration,
					ease,
				},
				index * stagger
			);
	});

	return timeline;
}

/**
 * Simple directional image reveal.
 *
 * @param {HTMLElement|string} target
 * @param {Object} options
 * @returns {gsap.core.Timeline|null}
 */
export function imageSlideReveal(target, options = {}) {
	if (typeof window === "undefined" || !target) return null;

	const element =
		typeof target === "string" ? document.querySelector(target) : target;

	if (!element) return null;

	const {
		direction = "left",
		duration = 1,
		ease = "power4.out",
		start = "top 85%",
		once = true,
	} = options;

	const clips = {
		left: {
			from: "inset(0 100% 0 0)",
			to: "inset(0 0% 0 0)",
		},
		right: {
			from: "inset(0 0 0 100%)",
			to: "inset(0 0% 0 0)",
		},
		top: {
			from: "inset(0 0 100% 0)",
			to: "inset(0 0 0% 0)",
		},
		bottom: {
			from: "inset(100% 0 0 0)",
			to: "inset(0% 0 0 0)",
		},
	};

	const clip = clips[direction] || clips.left;

	gsap.set(element, {
		clipPath: clip.from,
		overflow: "hidden",
	});

	return gsap.to(element, {
		clipPath: clip.to,
		duration,
		ease,
		scrollTrigger: {
			trigger: element,
			start,
			toggleActions: once
				? "play none none none"
				: "play reverse play reverse",
		},
	});
}

/**
 * Remove ScrollTriggers created by this module.
 *
 * @returns {void}
 */
export function refreshImageReveal() {
	if (typeof window === "undefined") return;

	ScrollTrigger.refresh();
}
