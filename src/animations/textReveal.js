"use client";

import { gsap, ScrollTrigger } from "./gsap";

export function splitWords(element) {
	if (!element) return [];

	const text = element.textContent?.trim();

	if (!text) return [];

	const words = text.split(/\s+/);

	element.textContent = "";

	const fragments = document.createDocumentFragment();

	const spans = words.map((word, index) => {
		const wrapper = document.createElement("span");

		wrapper.style.display = "inline-block";
		wrapper.style.overflow = "hidden";
		wrapper.style.verticalAlign = "top";

		const span = document.createElement("span");

		span.textContent = word;
		span.style.display = "inline-block";

		wrapper.appendChild(span);
		fragments.appendChild(wrapper);

		if (index < words.length - 1) {
			fragments.appendChild(document.createTextNode(" "));
		}

		return span;
	});

	element.appendChild(fragments);

	return spans;
}

/**
 * Reveal text word-by-word.
 *
 * @param {HTMLElement|string} target
 * @param {Object} options
 * @returns {gsap.core.Tween|null}
 */
export function textReveal(target, options = {}) {
	if (!target) return null;

	const element =
		typeof target === "string" ? document.querySelector(target) : target;

	if (!element) return null;

	const {
		duration = 0.8,
		delay = 0,
		stagger = 0.06,
		ease = "power4.out",
		y = "100%",
		opacity = 0,
		start = "top 85%",
		once = true,
		...rest
	} = options;

	const words = splitWords(element);

	if (!words.length) return null;

	return gsap.fromTo(
		words,
		{
			y,
			opacity,
		},
		{
			y: "0%",
			opacity: 1,
			duration,
			delay,
			stagger,
			ease,
			scrollTrigger: {
				trigger: element,
				start,
				toggleActions: once
					? "play none none none"
					: "play reverse play reverse",
			},
			...rest,
		}
	);
}


export function textFadeReveal(target, options = {}) {
	if (!target) return null;

	const element =
		typeof target === "string" ? document.querySelector(target) : target;

	if (!element) return null;

	const {
		duration = 1,
		delay = 0,
		y = 40,
		opacity = 0,
		ease = "power3.out",
		start = "top 85%",
		once = true,
		...rest
	} = options;

	return gsap.fromTo(
		element,
		{
			opacity,
			y,
		},
		{
			opacity: 1,
			y: 0,
			duration,
			delay,
			ease,
			scrollTrigger: {
				trigger: element,
				start,
				toggleActions: once
					? "play none none none"
					: "play reverse play reverse",
			},
			...rest,
		}
	);
}
