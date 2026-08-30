"use client";

import { gsap, ScrollTrigger } from "./gsap";


export function reveal(target, options = {}) {
	if (!target) return null;

	const {
		duration = 1,
		delay = 0,
		ease = "power3.out",
		y = 60,
		x = 0,
		opacity = 0,
		start = "top 85%",
		once = true,
		scrub = false,
		...rest
	} = options;

	return gsap.fromTo(
		target,
		{
			opacity,
			x,
			y,
		},
		{
			opacity: 1,
			x: 0,
			y: 0,
			duration,
			delay,
			ease,
			scrollTrigger: {
				trigger: target,
				start,
				toggleActions: once
					? "play none none none"
					: "play reverse play reverse",
				scrub,
			},
			...rest,
		}
	);
}


export function revealStagger(targets, options = {}) {
	if (!targets) return null;

	const {
		duration = 0.8,
		delay = 0,
		stagger = 0.12,
		ease = "power3.out",
		y = 50,
		x = 0,
		opacity = 0,
		start = "top 85%",
		once = true,
		...rest
	} = options;

	return gsap.fromTo(
		targets,
		{
			opacity,
			x,
			y,
		},
		{
			opacity: 1,
			x: 0,
			y: 0,
			duration,
			delay,
			stagger,
			ease,
			scrollTrigger: {
				trigger: targets,
				start,
				toggleActions: once
					? "play none none none"
					: "play reverse play reverse",
			},
			...rest,
		}
	);
}


export function clipReveal(target, options = {}) {
	if (!target) return null;

	const {
		duration = 1.2,
		delay = 0,
		ease = "power4.out",
		start = "top 85%",
		from = "inset(0 100% 0 0)",
		to = "inset(0 0% 0 0)",
		once = true,
		...rest
	} = options;

	return gsap.fromTo(
		target,
		{
			clipPath: from,
		},
		{
			clipPath: to,
			duration,
			delay,
			ease,
			scrollTrigger: {
				trigger: target,
				start,
				toggleActions: once
					? "play none none none"
					: "play reverse play reverse",
			},
			...rest,
		}
	);
}

/**
 * Refresh all ScrollTrigger instances.
 *
 *  after dynamic content/images have loaded.
 */
export function refreshScrollTriggers() {
	if (typeof window === "undefined") return;

	ScrollTrigger.refresh();
}


export function killScrollTriggers() {
	if (typeof window === "undefined") return;

	ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}
