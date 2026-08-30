"use client";

import {  useRef } from "react";

import { useGsap } from "@/hooks/useGsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { gsap } from "@/animations/gsap";

import styles from "./CustomCursor.module.css";

const DEFAULTS = {
	size: 48,
	pointSize: 6,
	followDuration: 0.16,
	pointDuration: 0.70,
	velocityStrength: 0.75,
	maxPointOffset: 14,
	hoverSize: 76,
	magneticStrength: 0.38,
	magneticDuration: 0.48,
};

export default function CustomCursor({
	size = DEFAULTS.size,
	pointSize = DEFAULTS.pointSize,
	followDuration = DEFAULTS.followDuration,
	pointDuration = DEFAULTS.pointDuration,
	velocityStrength = DEFAULTS.velocityStrength,
	maxPointOffset = DEFAULTS.maxPointOffset,
	hoverSize = DEFAULTS.hoverSize,
	magneticStrength = DEFAULTS.magneticStrength,
	magneticDuration = DEFAULTS.magneticDuration,
}) {
	const cursorRef = useRef(null);
	const pointRef = useRef(null);

	const hasFinePointer = useMediaQuery("(pointer: fine)");

	const prefersReducedMotion = useMediaQuery(
		"(prefers-reduced-motion: reduce)"
	);

	useGsap(
		() => {
			const cursor = cursorRef.current;
			const point = pointRef.current;

			if (!cursor || !point || !hasFinePointer) {
				return;
			}

			let isInsideViewport = false;
			let activeTarget = null;

			let previousX = window.innerWidth / 2;
			let previousY = window.innerHeight / 2;


			const baseRadius = size / 2;
			const pointRadius = pointSize / 2;

		
			const maxBasePointOffset = Math.max(0, baseRadius - pointRadius);


			gsap.set(cursor, {
				x: -100,
				y: -100,
				xPercent: -50,
				yPercent: -50,
				autoAlpha: 0,
				width: size,
				height: size,
				scale: 1,
				force3D: true,
			});

			gsap.set(point, {
				x: 0,
				y: 0,
				xPercent: -50,
				yPercent: -50,
				scale: 1,
				force3D: true,
			});

	

			const cursorXTo = gsap.quickTo(cursor, "x", {
				duration: prefersReducedMotion ? 0 : followDuration,
				ease: "power3.out",
			});

			const cursorYTo = gsap.quickTo(cursor, "y", {
				duration: prefersReducedMotion ? 0 : followDuration,
				ease: "power3.out",
			});

			const pointXTo = gsap.quickTo(point, "x", {
				duration: prefersReducedMotion ? 0 : pointDuration,
				ease: "power3.out",
			});

			const pointYTo = gsap.quickTo(point, "y", {
				duration: prefersReducedMotion ? 0 : pointDuration,
				ease: "power3.out",
			});

			const clamp = (value, min, max) => {
				return Math.min(Math.max(value, min), max);
			};

			const clampPointInsideCircle = (x, y) => {
				const distance = Math.sqrt(x * x + y * y);

				if (distance === 0 || distance <= maxBasePointOffset) {
					return {
						x,
						y,
					};
				}

				const ratio = maxBasePointOffset / distance;

				return {
					x: x * ratio,
					y: y * ratio,
				};
			};

			const showCursor = () => {
				if (isInsideViewport) {
					return;
				}

				isInsideViewport = true;

				gsap.to(cursor, {
					autoAlpha: 1,
					duration: prefersReducedMotion ? 0 : 0.2,
					ease: "power2.out",
					overwrite: "auto",
				});
			};

			const hideCursor = () => {
				isInsideViewport = false;
				activeTarget = null;

				gsap.to(cursor, {
					autoAlpha: 0,
					duration: prefersReducedMotion ? 0 : 0.18,
					ease: "power2.out",
					overwrite: "auto",
				});

				pointXTo(0);
				pointYTo(0);

				gsap.to(point, {
					scale: 1,
					duration: prefersReducedMotion ? 0 : 0.25,
					ease: "power3.out",
					overwrite: "auto",
				});
			};

			/*
			 * ----------------------------------------------------------------------
			 * INTERACTIVE TARGET
			 * ----------------------------------------------------------------------
			 *
			 * Supported:
			 *
			 * <a>
			 * <button>
			 * <input>
			 * <textarea>
			 * <select>
			 * [data-cursor]
			 *
			 * Magnetic:
			 *
			 * <button data-cursor="magnetic">
			 */

			const getInteractiveTarget = (target) => {
				if (!(target instanceof Element)) {
					return null;
				}

				return target.closest(
					[
						"a",
						"button",
						"input",
						"textarea",
						"select",
						"[data-cursor]",
					].join(",")
				);
			};
		
			const isMagneticTarget = (target) => {
				return target?.dataset?.cursor === "magnetic";
			};

			const enterInteractive = (target) => {
				if (!target || activeTarget === target) {
					return;
				}

				activeTarget = target;

				gsap.to(cursor, {
					width: hoverSize,
					height: hoverSize,
					duration: prefersReducedMotion ? 0 : magneticDuration,
					ease: "power3.out",
					overwrite: "auto",
				});

				gsap.to(point, {
					scale: 1.35,
					duration: prefersReducedMotion ? 0 : 0.25,
					ease: "power3.out",
					overwrite: "auto",
				});
			};


			const leaveInteractive = () => {
				if (!activeTarget) {
					return;
				}

				activeTarget = null;

				gsap.to(cursor, {
					width: size,
					height: size,
					duration: prefersReducedMotion ? 0 : magneticDuration,
					ease: "power3.out",
					overwrite: "auto",
				});

				pointXTo(0);
				pointYTo(0);

				gsap.to(point, {
					scale: 1,
					duration: prefersReducedMotion ? 0 : 0.25,
					ease: "power3.out",
					overwrite: "auto",
				});
			};


			const syncInteractiveTarget = (target) => {
				const interactiveTarget = getInteractiveTarget(target);

				if (interactiveTarget) {
					enterInteractive(interactiveTarget);
				} else {
					leaveInteractive();
				}

				return interactiveTarget;
			};

			const applyMagneticMovement = (mouseX, mouseY, target) => {
	
				if (!isMagneticTarget(target)) {
					cursorXTo(mouseX);
					cursorYTo(mouseY);

					return;
				}


				const rect = target.getBoundingClientRect();

				const centerX = rect.left + rect.width / 2;

				const centerY = rect.top + rect.height / 2;

				const deltaX = centerX - mouseX;
				const deltaY = centerY - mouseY;

				const magneticX = mouseX + deltaX * magneticStrength;

				const magneticY = mouseY + deltaY * magneticStrength;

				cursorXTo(magneticX);
				cursorYTo(magneticY);
			};


			const handlePointerMove = (event) => {
				const mouseX = event.clientX;
				const mouseY = event.clientY;

				showCursor();

				const velocityX = mouseX - previousX;

				const velocityY = mouseY - previousY;

				previousX = mouseX;
				previousY = mouseY;

			
				const hitTarget = document.elementFromPoint(mouseX, mouseY);

				const interactiveTarget = syncInteractiveTarget(hitTarget);

				applyMagneticMovement(mouseX, mouseY, interactiveTarget);


				let pointX = -velocityX * velocityStrength;

				let pointY = -velocityY * velocityStrength;

				pointX = clamp(pointX, -maxPointOffset, maxPointOffset);

				pointY = clamp(pointY, -maxPointOffset, maxPointOffset);

				/*
				 * Subtle magnetic point movement.
				 */
				if (interactiveTarget) {
					const rect = interactiveTarget.getBoundingClientRect();

					const centerX = rect.left + rect.width / 2;

					const centerY = rect.top + rect.height / 2;

					const directionX = centerX - mouseX;

					const directionY = centerY - mouseY;

					pointX += directionX * 0.08;
					pointY += directionY * 0.08;
				}

				/*
				 * Keep point inside outer circle.
				 */
				const constrained = clampPointInsideCircle(pointX, pointY);

				pointXTo(constrained.x);
				pointYTo(constrained.y);
			};


			const handlePointerEnter = (event) => {
				previousX = event.clientX;
				previousY = event.clientY;

				showCursor();
			};

			const handlePointerLeave = () => {
				hideCursor();
			};


			const handlePointerOut = (event) => {
				const nextTarget = event.relatedTarget;

				if (
					nextTarget instanceof Element &&
					activeTarget?.contains(nextTarget)
				) {
					return;
				}

				syncInteractiveTarget(nextTarget);
			};

			const handlePointerUp = (event) => {
				const target = document.elementFromPoint(
					event.clientX,
					event.clientY
				);

				syncInteractiveTarget(target);
			};
	
			const handleBlur = () => {
				hideCursor();
			};

			const handleVisibilityChange = () => {
				if (document.hidden) {
					hideCursor();
				}
			};

			const handleScroll = () => {
				if (!activeTarget) {
					return;
				}

				leaveInteractive();
			};



			window.addEventListener("pointermove", handlePointerMove, {
				passive: true,
			});

			window.addEventListener("pointerenter", handlePointerEnter, {
				passive: true,
			});

			window.addEventListener("pointerleave", handlePointerLeave, {
				passive: true,
			});

			window.addEventListener("pointerout", handlePointerOut, {
				passive: true,
			});

			window.addEventListener("pointerup", handlePointerUp, {
				passive: true,
			});

			window.addEventListener("pointercancel", handlePointerLeave, {
				passive: true,
			});

			window.addEventListener("blur", handleBlur);

			window.addEventListener("scroll", handleScroll, {
				passive: true,
			});

			document.addEventListener(
				"visibilitychange",
				handleVisibilityChange
			);

			return () => {
				window.removeEventListener("pointermove", handlePointerMove);

				window.removeEventListener("pointerenter", handlePointerEnter);

				window.removeEventListener("pointerleave", handlePointerLeave);

				window.removeEventListener("pointerout", handlePointerOut);

				window.removeEventListener("pointerup", handlePointerUp);

				window.removeEventListener("pointercancel", handlePointerLeave);

				window.removeEventListener("blur", handleBlur);

				window.removeEventListener("scroll", handleScroll);

				document.removeEventListener(
					"visibilitychange",
					handleVisibilityChange
				);

				gsap.killTweensOf(cursor);
				gsap.killTweensOf(point);
			};
		},
		{
			scope: cursorRef,


			dependencies: [
				hasFinePointer,
				prefersReducedMotion,
				size,
				pointSize,
				followDuration,
				pointDuration,
				velocityStrength,
				maxPointOffset,
				hoverSize,
				magneticStrength,
				magneticDuration,
			],

			revertOnUpdate: true,
		}
	);


	if (!hasFinePointer) {
		return null;
	}

	return (
		<div
			ref={cursorRef}
			className={styles.cursor}
			style={{
				"--cursor-size": `${size}px`,
				"--point-size": `${pointSize}px`,
				"--hover-size": `${hoverSize}px`,
			}}
			aria-hidden="true">
			<span ref={pointRef} className={styles.point} />
		</div>
	);
}
