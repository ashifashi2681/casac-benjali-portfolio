"use client";

import { gsap } from "./gsap";

/**
 * Create a scroll-based parallax animation.
 *
 * @param {HTMLElement|string} target
 * @param {Object} options
 * @returns {gsap.core.Tween|null}
 */
export function parallax(target, options = {}) {
	if (typeof window === "undefined" || !target) {
		return null;
	}

	const element =
		typeof target === "string" ? document.querySelector(target) : target;

	if (!element) return null;

	const {
		speed = 0.2,
		direction = "y",
		start = "top bottom",
		end = "bottom top",
		scrub = true,
		ease = "none",
		x = 0,
		y = 0,
		scale = 1,
	} = options;

	const movement = speed * 100;

	const properties =
		direction === "x"
			? {
					x: x + movement,
			  }
			: {
					y: y + movement,
			  };

	return gsap.fromTo(
		element,
		{
			x,
			y,
			scale,
		},
		{
			...properties,
			ease,
			scrollTrigger: {
				trigger: element,
				start,
				end,
				scrub,
			},
		}
	);
}

/**
 * Create a vertical parallax animation.
 *
 * @param {HTMLElement|string} target
 * @param {Object} options
 * @returns {gsap.core.Tween|null}
 */
export function verticalParallax(target, options = {}) {
	return parallax(target, {
		...options,
		direction: "y",
	});
}

/**
 * Create a horizontal parallax animation.
 *
 * @param {HTMLElement|string} target
 * @param {Object} options
 * @returns {gsap.core.Tween|null}
 */
export function horizontalParallax(target, options = {}) {
	return parallax(target, {
		...options,
		direction: "x",
	});
}

/**
 * Create parallax for multiple elements.
 *
 * @param {HTMLElement[]|NodeList|string} targets
 * @param {Object} options
 * @returns {gsap.core.Tween[]}
 */
export function parallaxGroup(targets, options = {}) {
	if (typeof window === "undefined" || !targets) {
		return [];
	}

	const elements =
		typeof targets === "string"
			? document.querySelectorAll(targets)
			: targets;

	if (!elements?.length) return [];

	return Array.from(elements)
		.map((element, index) => {
			const customSpeed =
				typeof options.speed === "function"
					? options.speed(index, element)
					: options.speed;

			return parallax(element, {
				...options,
				speed: customSpeed,
			});
		})
		.filter(Boolean);
}
