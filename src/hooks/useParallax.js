"use client";

import { useRef } from "react";
import { useGsap } from "./useGsap";
import { parallax } from "@/animations/parallax";

/**
 * Parallax animation hook.
 *
 * @param {Object} options
 * @returns {Object} ref
 */
export function useParallax(options = {}) {
	const {
		speed = 0.2,
		direction = "y",
		start = "top bottom",
		end = "bottom top",
		scrub = true,
		disabled = false,
		dependencies = [],
	} = options;

	const ref = useRef(null);

	useGsap(
		() => {
			if (disabled || !ref.current) return;

			parallax(ref.current, {
				speed,
				direction,
				start,
				end,
				scrub,
			});
		},
		{
			scope: ref,
			dependencies: [
				disabled,
				speed,
				direction,
				start,
				end,
				scrub,
				...dependencies,
			],
		}
	);

	return ref;
}
