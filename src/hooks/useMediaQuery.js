"use client";

import { useSyncExternalStore } from "react";

/**
 * Reactive media-query hook.
 *
 * @param {string} query
 * @returns {boolean}
 */
export function useMediaQuery(query) {
	const getServerSnapshot = () => false;

	const subscribe = (onStoreChange) => {
		if (!query || typeof window === "undefined") {
			return () => {};
		}

		const mediaQuery = window.matchMedia(query);

		mediaQuery.addEventListener("change", onStoreChange);

		return () => {
			mediaQuery.removeEventListener("change", onStoreChange);
		};
	};

	const getSnapshot = () => {
		if (!query || typeof window === "undefined") {
			return false;
		}

		return window.matchMedia(query).matches;
	};

	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
