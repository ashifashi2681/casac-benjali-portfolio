"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/animations/gsap";
import styles from "./Header.module.css";
import Link from "next/link";

const navItems = [
	{ label: "Home", href: "/" },
	{ label: "About", href: "/about" },
	{ label: "Programmes", href: "/programmes" },
	{ label: "Ventures", href: "/ventures" },
	{ label: "Clients & Books", href: "/clients-books" },
	{ label: "Work With Me", href: "/contact" },
];

function Header() {
	const railRef = useRef(null);
	const indicatorRef = useRef(null);
	const itemRefs = useRef([]);
	const reduceMotionRef = useRef(false);
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		const updateMotion = () => {
			reduceMotionRef.current = reduceMotion.matches;
		};

		updateMotion();
		reduceMotion.addEventListener("change", updateMotion);

		return () => {
			reduceMotion.removeEventListener("change", updateMotion);
		};
	}, []);

	useEffect(() => {
		const rail = railRef.current;
		const indicator = indicatorRef.current;
		const activeItem = itemRefs.current[activeIndex];

		if (!rail || !indicator || !activeItem) return;

		const moveIndicator = () => {
			const railRect = rail.getBoundingClientRect();
			const itemRect = activeItem.getBoundingClientRect();
			const x = itemRect.left - railRect.left - 18;
			const width = itemRect.width + 36;
			const height = activeItem.classList.contains(styles.itemActive) ? 100 : 84;

			if (reduceMotionRef.current) {
				gsap.set(indicator, {
					x,
					width,
					height,
					yPercent: -50,
					scale: 1,
				});
				return;
			}

			gsap.to(indicator, {
				x,
				width,
				height,
				yPercent: -50,
				scale: 1,
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

	const handleRailPointerMove = (event) => {
		const rail = railRef.current;
		if (!rail) return;

		const rect = rail.getBoundingClientRect();
		rail.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
		rail.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
	};

	const handleItemClick = (event, index) => {
		setActiveIndex(index);

		if (!navItems[index].href.startsWith("#")) return;

		const section = document.querySelector(navItems[index].href);
		if (!section) {
			event.preventDefault();
		}
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
						aria-hidden="true"
					/>

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
							key={item.href}
							onClick={(event) => handleItemClick(event, index)}>
							{activeIndex !== index ? (
								<span
									className={styles.icon}
									aria-hidden="true">
									{item.label}
								</span>
							) : (
								<span className={styles.label}>
									{item.label}
								</span>
							)}
						</Link>
					))}
				</div>
			</nav>
		</header>
	);
}

export default Header;
