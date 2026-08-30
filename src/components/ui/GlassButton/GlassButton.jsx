"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/gsap";
import styles from "./GlassButton.module.css";

function GlassButton({
	children,
	className = "",
	type = "button",
	disabled = false,
	onMouseMove,
	onMouseLeave,
	onMouseDown,
	onClick,
	...props
}) {
	const buttonRef = useRef(null);
	const glowRef = useRef(null);
	const rippleRef = useRef(null);
	const reduceMotionRef = useRef(false);

	useEffect(() => {
		const button = buttonRef.current;
		const glow = glowRef.current;
		const ripple = rippleRef.current;
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const handleChange = () => {
			reduceMotionRef.current = media.matches;
		};

		handleChange();
		media.addEventListener("change", handleChange);

		return () => {
			media.removeEventListener("change", handleChange);
			gsap.killTweensOf([button, glow, ripple]);
		};
	}, []);

	const setPointerVars = (event) => {
		const button = buttonRef.current;
		if (!button) return null;

		const rect = button.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		const normalizedX = (x / rect.width - 0.5) * 2;
		const normalizedY = (y / rect.height - 0.5) * 2;

		button.style.setProperty("--pointer-x", `${x}px`);
		button.style.setProperty("--pointer-y", `${y}px`);
		return { normalizedX, normalizedY };
	};

	const handleMouseMove = (event) => {
		const button = buttonRef.current;
		const glow = glowRef.current;
		const pointer = setPointerVars(event);

		if (button && pointer && !disabled && !reduceMotionRef.current) {
			gsap.to(button, {
				x: pointer.normalizedX * 16,
				y: pointer.normalizedY * 10,
				scale: 1.035,
				rotationX: pointer.normalizedY * -6,
				rotationY: pointer.normalizedX * 8,
				transformPerspective: 720,
				duration: 0.45,
				ease: "power3.out",
				overwrite: "auto",
			});
		}

		if (glow && pointer && !disabled && !reduceMotionRef.current) {
			gsap.to(glow, {
				x: pointer.normalizedX * 22,
				y: pointer.normalizedY * 16,
				opacity: 1,
				duration: 0.35,
				ease: "power2.out",
				overwrite: "auto",
			});
		}

		onMouseMove?.(event);
	};

	const handleMouseLeave = (event) => {
		const button = buttonRef.current;
		const glow = glowRef.current;

		if (button) {
			if (reduceMotionRef.current) {
				gsap.set(button, { x: 0, y: 0, scale: 1, rotationX: 0, rotationY: 0 });
			} else {
				gsap.to(button, {
					x: 0,
					y: 0,
					scale: 1,
					rotationX: 0,
					rotationY: 0,
					transformPerspective: 720,
					duration: 0.65,
					ease: "elastic.out(1, 0.55)",
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

		onMouseLeave?.(event);
	};

	const handleMouseDown = (event) => {
		const button = buttonRef.current;
		const ripple = rippleRef.current;

		setPointerVars(event);

		if (button && !disabled && !reduceMotionRef.current) {
			gsap.to(button, {
				scale: 0.965,
				duration: 0.12,
				ease: "power2.out",
				overwrite: "auto",
			});

			gsap.to(button, {
				scale: 1.035,
				duration: 0.55,
				delay: 0.12,
				ease: "elastic.out(1, 0.45)",
				overwrite: "auto",
			});
		}

		if (ripple && !disabled && !reduceMotionRef.current) {
			gsap.fromTo(
				ripple,
				{ opacity: 0.95, scale: 0.08, rotate: 0 },
				{
					opacity: 0,
					scale: 1.65,
					rotate: 35,
					duration: 0.8,
					ease: "power3.out",
					overwrite: true,
				}
			);
		}

		onMouseDown?.(event);
	};

	const handleClick = (event) => {
		if (disabled) return;
		onClick?.(event);
	};

	return (
		<button
			ref={buttonRef}
			className={`${styles.button} ${className}`.trim()}
			type={type}
			disabled={disabled}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			onMouseDown={handleMouseDown}
			onClick={handleClick}
			{...props}
		>
			<span ref={glowRef} className={styles.pointerGlow} aria-hidden="true" />
			<span ref={rippleRef} className={styles.ripple} aria-hidden="true" />
			<span className={styles.liquid} aria-hidden="true" />
			<span className={styles.edge} aria-hidden="true" />
			<span className={styles.label}>{children}</span>
		</button>
	);
}

export default GlassButton;
