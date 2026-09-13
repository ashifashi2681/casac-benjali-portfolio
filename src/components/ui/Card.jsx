"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/gsap";
import styles from "./Card.module.css";

function Card({ children, cardClass = "" }) {
	const cardRef = useRef(null);
	const glowRef = useRef(null);
	const reduceMotionRef = useRef(false);

	useEffect(() => {
		const card = cardRef.current;
		const glow = glowRef.current;
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const handleChange = () => {
			reduceMotionRef.current = media.matches;
		};

		handleChange();
		media.addEventListener("change", handleChange);

		return () => {
			media.removeEventListener("change", handleChange);
			gsap.killTweensOf([card, glow]);
		};
	}, []);

	const setPointerVars = (event) => {
		const card = cardRef.current;
		if (!card) return null;

		const rect = card.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		card.style.setProperty("--pointer-x", `${x}px`);
		card.style.setProperty("--pointer-y", `${y}px`);

		return {
			normalizedX: (x / rect.width - 0.5) * 2,
			normalizedY: (y / rect.height - 0.5) * 2,
		};
	};

	const handleMouseMove = (event) => {
		const card = cardRef.current;
		const glow = glowRef.current;
		const pointer = setPointerVars(event);

		if (!pointer || reduceMotionRef.current) return;

		if (card) {
			gsap.to(card, {
				y: -6,
				scale: 1.012,
				rotationX: pointer.normalizedY * -4,
				rotationY: pointer.normalizedX * 5,
				transformPerspective: 900,
				duration: 0.5,
				ease: "power3.out",
				overwrite: "auto",
			});
		}

		if (glow) {
			gsap.to(glow, {
				x: pointer.normalizedX * 18,
				y: pointer.normalizedY * 14,
				opacity: 1,
				duration: 0.35,
				ease: "power2.out",
				overwrite: "auto",
			});
		}
	};

	const handleMouseLeave = (event) => {
		const card = cardRef.current;
		const glow = glowRef.current;

		if (card) {
			if (reduceMotionRef.current) {
				gsap.set(card, { y: 0, scale: 1, rotationX: 0, rotationY: 0 });
			} else {
				gsap.to(card, {
					y: 0,
					scale: 1,
					rotationX: 0,
					rotationY: 0,
					transformPerspective: 900,
					duration: 0.7,
					ease: "elastic.out(1, 0.5)",
					overwrite: "auto",
				});
			}
		}

		if (glow && !reduceMotionRef.current) {
			gsap.to(glow, {
				x: 0,
				y: 0,
				opacity: 0,
				duration: 0.35,
				ease: "power2.out",
				overwrite: "auto",
			});
		}
	};

	return (
		<div
			ref={cardRef}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			className={`${cardClass} ${styles.card} p-[clamp(24px,3vw,38px)] max-sm:px-5 max-sm:py-6`}>
			<span ref={glowRef} className={styles.pointerGlow} aria-hidden="true" />
			{children}
		</div>
	);
}

export default Card;
