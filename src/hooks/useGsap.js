"use client";

import { useGSAP } from "@/animations/gsap";

export function useGsap(callback, options = {}) {
	return useGSAP(callback, {
		scope: options.scope,
		dependencies: options.dependencies ?? [],
		revertOnUpdate: options.revertOnUpdate ?? true,
	});
}
