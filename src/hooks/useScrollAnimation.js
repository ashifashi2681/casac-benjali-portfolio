"use client";

import { useRef } from "react";
import { useGsap } from "./useGsap";
import { reveal, revealStagger, clipReveal } from "@/animations/reveal";

/**
 * Scroll-triggered animation hook.
 *
 * Supports:
 * - single element reveal
 * - staggered reveal
 * - clip-path reveal
 *
 * @param {Object} options
 * @returns {Object} ref
 */
export function useScrollAnimation(options = {}) {
	const {
		type = "reveal",
		duration = 0.8,
		delay = 0,
		stagger = 0.1,
		y = 50,
		x = 0,
		opacity = 0,
		ease = "power3.out",
		start = "top 85%",
		once = true,
		disabled = false,
		dependencies = [],
	} = options;

	const ref = useRef(null);

	useGsap(
		() => {
			if (disabled || !ref.current) return;

			const element = ref.current;

			switch (type) {
				case "stagger":
					revealStagger(element.children, {
						duration,
						delay,
						stagger,
						y,
						x,
						opacity,
						ease,
						start,
						once,
					});
					break;

				case "clip":
					clipReveal(element, {
						duration,
						delay,
						ease,
						start,
						once,
					});
					break;

				case "reveal":
				default:
					reveal(element, {
						duration,
						delay,
						y,
						x,
						opacity,
						ease,
						start,
						once,
					});
					break;
			}
		},
		{
			scope: ref,
			dependencies: [disabled, type, ...dependencies],
		}
	);

	return ref;
}
