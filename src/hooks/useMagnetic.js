"use client";

import { useRef } from "react";
import { useGsap } from "./useGsap";
import { magnetic } from "@/animations/magnetic";

/**
 * Magnetic cursor interaction hook.
 *
 * @param {Object} options
 * @returns {Object} ref
 */
export function useMagnetic(options = {}) {
	const {
		strength = 0.25,
		duration = 0.4,
		ease = "power3.out",
		disabled = false,
		dependencies = [],
	} = options;

	const ref = useRef(null);

	useGsap(
		() => {
			if (disabled || !ref.current) return;

			magnetic(ref.current, {
				strength,
				duration,
				ease,
			});
		},
		{
			scope: ref,
			dependencies: [disabled, strength, duration, ease, ...dependencies],
		}
	);

	return ref;
}
