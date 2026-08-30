"use client";

import { gsap } from "./gsap";

/**
 * Create a magnetic cursor interaction.
 *
 * @param {HTMLElement|string} target
 * @param {Object} options
 * @returns {Function|null} cleanup function
 */
export function magnetic(target, options = {}) {
	if (typeof window === "undefined" || !target) return null;

	const element =
		typeof target === "string" ? document.querySelector(target) : target;

	if (!element) return null;

	const {
		strength = 0.25,
		duration = 0.4,
		ease = "power3.out",
		maxDistance = 120,
		scale = 1,
	} = options;

	let xTo;
	let yTo;

	const quickSetX = gsap.quickTo(element, "x", {
		duration,
		ease,
	});

	const quickSetY = gsap.quickTo(element, "y", {
		duration,
		ease,
	});

	const handleMouseMove = (event) => {
		const rect = element.getBoundingClientRect();

		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		const deltaX = event.clientX - centerX;
		const deltaY = event.clientY - centerY;

		const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

		if (distance > maxDistance) {
			quickSetX(0);
			quickSetY(0);
			return;
		}

		quickSetX(deltaX * strength);
		quickSetY(deltaY * strength);
	};

	const handleMouseEnter = () => {
		gsap.to(element, {
			scale,
			duration,
			ease,
			overwrite: true,
		});
	};

	const handleMouseLeave = () => {
		quickSetX(0);
		quickSetY(0);

		gsap.to(element, {
			x: 0,
			y: 0,
			scale: 1,
			duration,
			ease,
			overwrite: true,
		});
	};

	element.addEventListener("mouseenter", handleMouseEnter);
	element.addEventListener("mousemove", handleMouseMove);
	element.addEventListener("mouseleave", handleMouseLeave);

	return () => {
		element.removeEventListener("mouseenter", handleMouseEnter);

		element.removeEventListener("mousemove", handleMouseMove);

		element.removeEventListener("mouseleave", handleMouseLeave);

		gsap.killTweensOf(element);

		gsap.set(element, {
			x: 0,
			y: 0,
			scale: 1,
		});
	};
}

/**
 * Create magnetic interaction for multiple elements.
 *
 * @param {HTMLElement[]|NodeList|string} targets
 * @param {Object} options
 * @returns {Function|null} cleanup function
 */
export function magneticGroup(targets, options = {}) {
	if (typeof window === "undefined" || !targets) return null;

	const elements =
		typeof targets === "string"
			? document.querySelectorAll(targets)
			: targets;

	if (!elements?.length) return null;

	const cleanups = Array.from(elements)
		.map((element) => magnetic(element, options))
		.filter(Boolean);

	return () => {
		cleanups.forEach((cleanup) => cleanup());
	};
}
