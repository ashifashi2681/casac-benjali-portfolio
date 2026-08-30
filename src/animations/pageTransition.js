"use client";

import { gsap } from "./gsap";

/**
 * Default page transition configuration.
 */
const DEFAULTS = {
	duration: 0.8,
	ease: "power4.inOut",
	direction: "up",
};

/**
 * Get transition transform values.
 *
 * @param {string} direction
 * @returns {Object}
 */
function getDirection(direction) {
	switch (direction) {
		case "down":
			return {
				enterFrom: "translateY(-100%)",
				leaveTo: "translateY(100%)",
			};

		case "left":
			return {
				enterFrom: "translateX(100%)",
				leaveTo: "translateX(-100%)",
			};

		case "right":
			return {
				enterFrom: "translateX(-100%)",
				leaveTo: "translateX(100%)",
			};

		case "up":
		default:
			return {
				enterFrom: "translateY(100%)",
				leaveTo: "translateY(-100%)",
			};
	}
}

/**
 * Create a page transition overlay.
 *
 * @param {HTMLElement|string} overlay
 * @param {Object} options
 * @returns {Object|null}
 */
export function createPageTransition(overlay, options = {}) {
	if (typeof window === "undefined" || !overlay) {
		return null;
	}

	const element =
		typeof overlay === "string" ? document.querySelector(overlay) : overlay;

	if (!element) return null;

	const {
		duration = DEFAULTS.duration,
		ease = DEFAULTS.ease,
		direction = DEFAULTS.direction,
		color,
		onComplete,
	} = options;

	const { enterFrom, leaveTo } = getDirection(direction);

	if (color) {
		gsap.set(element, {
			backgroundColor: color,
		});
	}

	gsap.set(element, {
		transform: enterFrom,
		pointerEvents: "none",
	});

	/**
	 * Enter transition.
	 */
	const enter = () => {
		return gsap.to(element, {
			transform: "translate(0, 0)",
			duration,
			ease,
			pointerEvents: "auto",
		});
	};

	/**
	 * Leave transition.
	 */
	const leave = () => {
		return gsap.to(element, {
			transform: leaveTo,
			duration,
			ease,
			onComplete,
		});
	};

	/**
	 * Reset overlay to its initial position.
	 */
	const reset = () => {
		gsap.set(element, {
			transform: enterFrom,
			pointerEvents: "none",
		});
	};

	return {
		enter,
		leave,
		reset,
	};
}

/**
 * Animate a page element out.
 *
 * @param {HTMLElement|string} target
 * @param {Object} options
 * @returns {gsap.core.Tween|null}
 */
export function pageExit(target, options = {}) {
	if (typeof window === "undefined" || !target) {
		return null;
	}

	const element =
		typeof target === "string" ? document.querySelector(target) : target;

	if (!element) return null;

	const {
		duration = 0.7,
		ease = "power3.inOut",
		y = -30,
		opacity = 0,
		scale = 0.98,
	} = options;

	return gsap.to(element, {
		y,
		opacity,
		scale,
		duration,
		ease,
	});
}

/**
 * Animate a page element in.
 *
 * @param {HTMLElement|string} target
 * @param {Object} options
 * @returns {gsap.core.Tween|null}
 */
export function pageEnter(target, options = {}) {
	if (typeof window === "undefined" || !target) {
		return null;
	}

	const element =
		typeof target === "string" ? document.querySelector(target) : target;

	if (!element) return null;

	const {
		duration = 0.8,
		ease = "power3.out",
		y = 30,
		opacity = 0,
		scale = 0.98,
		delay = 0,
	} = options;

	return gsap.fromTo(
		element,
		{
			y,
			opacity,
			scale,
		},
		{
			y: 0,
			opacity: 1,
			scale: 1,
			duration,
			delay,
			ease,
		}
	);
}

/**
 * Create a full-screen overlay element programmatically.
 *
 * @param {Object} options
 * @returns {HTMLElement|null}
 */
export function createTransitionOverlay(options = {}) {
	if (typeof window === "undefined") return null;

	const {
		className = "page-transition-overlay",
		background = "#111",
		zIndex = 9999,
	} = options;

	let overlay = document.querySelector(`.${className}`);

	if (overlay) return overlay;

	overlay = document.createElement("div");

	overlay.className = className;

	Object.assign(overlay.style, {
		position: "fixed",
		inset: "0",
		width: "100%",
		height: "100%",
		background,
		zIndex: String(zIndex),
		pointerEvents: "none",
		transform: "translateY(100%)",
	});

	document.body.appendChild(overlay);

	return overlay;
}
