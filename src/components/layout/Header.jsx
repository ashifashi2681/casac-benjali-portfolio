"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { gsap } from "@/animations/gsap";
import styles from "./Header.module.css";

const navItems = [
	{ label: "Home", href: "/" },
	{ label: "About", href: "/about" },
	{ label: "Programmes", href: "/programmes" },
	{ label: "Ventures", href: "/ventures" },
	{ label: "Clients & Books", href: "/clients-books" },
	{ label: "Work With Me", href: "/contact" },
];

// Glass bleed around the active item, in px (half the indicator's extra width).
const INDICATOR_BLEED = 18;
const INDICATOR_HEIGHT = 100;

function getActiveIndex(pathname) {
	if (!pathname) return -1;

	const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
	return navItems.findIndex((item) => item.href === normalizedPathname);
}

function Header() {
	const pathname = usePathname();
	const railRef = useRef(null);
	const indicatorRef = useRef(null);
	const itemRefs = useRef([]);
	const reduceMotionRef = useRef(false);
	const glowFrameRef = useRef(0);
	const latestPointerRef = useRef(null);

	// Derived from the current route (not click state) so the liquid pill never
	// desyncs after client-side navigation. -1 hides it on unknown routes.
	const activeIndex = getActiveIndex(pathname);

	useEffect(() => {
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		const updateMotion = () => {
			reduceMotionRef.current = reduceMotion.matches;
		};

		updateMotion();
		reduceMotion.addEventListener("change", updateMotion);

		return () => {
			reduceMotion.removeEventListener("change", updateMotion);

			if (glowFrameRef.current) {
				window.cancelAnimationFrame(glowFrameRef.current);
				glowFrameRef.current = 0;
			}
		};
	}, []);

	useEffect(() => {
		const rail = railRef.current;
		const indicator = indicatorRef.current;
		const activeItem = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;

		if (!rail || !indicator) return;

		if (!activeItem) {
			// No nav item matches the current route — hide the liquid pill.
			gsap.killTweensOf(indicator);
			gsap.set(indicator, { autoAlpha: 0 });
			return;
		}

		const moveIndicator = () => {
			const railRect = rail.getBoundingClientRect();
			const itemRect = activeItem.getBoundingClientRect();
			const x = itemRect.left - railRect.left - rail.clientLeft - INDICATOR_BLEED;
			const width = itemRect.width + INDICATOR_BLEED * 2;

			if (reduceMotionRef.current) {
				gsap.set(indicator, {
					x,
					width,
					height: INDICATOR_HEIGHT,
					yPercent: -50,
					scale: 1,
					autoAlpha: 1,
				});
				return;
			}

			gsap.to(indicator, {
				x,
				width,
				height: INDICATOR_HEIGHT,
				yPercent: -50,
				scale: 1,
				autoAlpha: 1,
				duration: 0.78,
				ease: "elastic.out(1, 0.62)",
				overwrite: true,
			});

			gsap.fromTo(
				activeItem,
				{ scale: 0.92, y: 4 },
				{
					scale: 1,
					y: 0,
					duration: 0.58,
					ease: "back.out(3)",
					overwrite: true,
				}
			);
		};

		moveIndicator();

		const resizeObserver = new ResizeObserver(moveIndicator);
		resizeObserver.observe(rail);
		resizeObserver.observe(activeItem);

		window.addEventListener("resize", moveIndicator);

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener("resize", moveIndicator);
			gsap.killTweensOf([indicator, activeItem]);
		};
	}, [activeIndex]);

	// The rail glow uses rail-relative coordinates, while the glow inside the
	// liquid pill uses pill-relative ones — reusing the rail's coordinates on
	// the (translated, much smaller) pill is what misaligned it before.
	const applyPointerGlow = (clientX, clientY) => {
		const rail = railRef.current;
		const indicator = indicatorRef.current;
		if (!rail || !indicator) return;

		const railRect = rail.getBoundingClientRect();
		rail.style.setProperty("--glow-x", `${clientX - railRect.left}px`);
		rail.style.setProperty("--glow-y", `${clientY - railRect.top}px`);

		const indicatorRect = indicator.getBoundingClientRect();
		indicator.style.setProperty(
			"--pointer-x",
			`${clientX - indicatorRect.left}px`
		);
		indicator.style.setProperty(
			"--pointer-y",
			`${clientY - indicatorRect.top}px`
		);
	};

	const handleRailPointerMove = (event) => {
		latestPointerRef.current = { x: event.clientX, y: event.clientY };

		if (glowFrameRef.current) return;

		glowFrameRef.current = window.requestAnimationFrame(() => {
			glowFrameRef.current = 0;

			const pointer = latestPointerRef.current;
			if (pointer) {
				applyPointerGlow(pointer.x, pointer.y);
			}
		});
	};

	return (
		<header className={styles.header}>
			<nav className={styles.nav} aria-label="Primary navigation">
				<div
					ref={railRef}
					className={styles.rail}
					onPointerMove={handleRailPointerMove}>
					<span
						ref={indicatorRef}
						className={styles.indicator}
						aria-hidden="true">
						<span className={styles.indicatorGlow} />
					</span>

					{navItems.map((item, index) => (
						<Link
							ref={(element) => {
								itemRefs.current[index] = element;
							}}
							className={`${styles.item} ${
								activeIndex === index ? styles.itemActive : ""
							}`.trim()}
							href={item.href}
							aria-current={
								activeIndex === index ? "page" : undefined
							}
							key={item.href}>
							<span
								className={
									activeIndex === index ? styles.label : styles.icon
								}>
								{item.label}
							</span>
						</Link>
					))}
				</div>
			</nav>
		</header>
	);
}

export default Header;
