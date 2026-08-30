"use client";

import { gsap } from "./gsap";

/**
 * Generic stagger animation.
 *
 * @param {HTMLElement[]|NodeList|string} targets
 * @param {Object} options
 * @returns {gsap.core.Tween|null}
 */
export function stagger(targets, options = {}) {
	if (typeof window === "undefined" || !targets) {
		return null;
	}

	const {
		duration = 0.8,
		delay = 0,
		stagger: staggerAmount = 0.1,
		ease = "power3.out",
		from = {
			opacity: 0,
			y: 40,
		},
		to = {
			opacity: 1,
			y: 0,
		},
		scrollTrigger,
		...rest
	} = options;

	const elements =
		typeof targets === "string"
			? document.querySelectorAll(targets)
			: targets;

	if (!elements?.length) return null;

	return gsap.fromTo(
		elements,
		{
			...from,
		},
		{
			...to,
			duration,
			delay,
			stagger: staggerAmount,
			ease,
			scrollTrigger,
			...rest,
		}
	);
}

/**
 * Fade elements in sequentially.
 *
 * @param {HTMLElement[]|NodeList|string} targets
 * @param {Object} options
 * @returns {gsap.core.Tween|null}
 */
export function staggerFadeIn(targets, options = {}) {
	return stagger(targets, {
		...options,
		from: {
			opacity: 0,
			y: options.y ?? 30,
			...options.from,
		},
		to: {
			opacity: 1,
			y: 0,
			...options.to,
		},
	});
}

/**
 * Slide elements upward sequentially.
 *
 * @param {HTMLElement[]|NodeList|string} targets
 * @param {Object} options
 * @returns {gsap.core.Tween|null}
 */
export function staggerUp(targets, options = {}) {
	return stagger(targets, {
		...options,
		from: {
			opacity: 0,
			y: options.y ?? 60,
			...options.from,
		},
		to: {
			opacity: 1,
			y: 0,
			...options.to,
		},
	});
}

/**
 * Slide elements from the left sequentially.
 *
 * @param {HTMLElement[]|NodeList|string} targets
 * @param {Object} options
 * @returns {gsap.core.Tween|null}
 */
export function staggerLeft(targets, options = {}) {
	return stagger(targets, {
		...options,
		from: {
			opacity: 0,
			x: options.x ?? -60,
			...options.from,
		},
		to: {
			opacity: 1,
			x: 0,
			...options.to,
		},
	});
}

/**
 * Scale elements into view sequentially.
 *
 * @param {HTMLElement[]|NodeList|string} targets
 * @param {Object} options
 * @returns {gsap.core.Tween|null}
 */
export function staggerScale(targets, options = {}) {
	return stagger(targets, {
		...options,
		from: {
			opacity: 0,
			scale: options.scale ?? 0.85,
			...options.from,
		},
		to: {
			opacity: 1,
			scale: 1,
			...options.to,
		},
	});
}
