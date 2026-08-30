"use client";

import { gsap } from "./gsap";


export function fadeIn(target, options = {}) {
	if (!target) return null;

	const {
		duration = 0.8,
		delay = 0,
		ease = "power2.out",
		y = 0,
		x = 0,
		opacity = 1,
		...rest
	} = options;

	return gsap.fromTo(
		target,
		{
			opacity: 0,
			x,
			y,
		},
		{
			opacity,
			x: 0,
			y: 0,
			duration,
			delay,
			ease,
			...rest,
		}
	);
}


export function fadeOut(target, options = {}) {
	if (!target) return null;

	const {
		duration = 0.5,
		delay = 0,
		ease = "power2.out",
		opacity = 0,
		...rest
	} = options;

	return gsap.to(target, {
		opacity,
		duration,
		delay,
		ease,
		...rest,
	});
}


export function fadeInStagger(targets, options = {}) {
	if (!targets) return null;

	const {
		duration = 0.7,
		delay = 0,
		stagger = 0.1,
		ease = "power2.out",
		y = 30,
		x = 0,
		opacity = 1,
		...rest
	} = options;

	return gsap.fromTo(
		targets,
		{
			opacity: 0,
			x,
			y,
		},
		{
			opacity,
			x: 0,
			y: 0,
			duration,
			delay,
			stagger,
			ease,
			...rest,
		}
	);
}
