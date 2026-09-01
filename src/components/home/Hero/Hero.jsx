"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useGsap } from "@/hooks/useGsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { gsap, ScrollTrigger } from "@/animations/gsap";

import styles from "./Hero.module.css";

const DEFAULTS = {
	frameCount: 100,
	framePath: "/images/hero-sequence/frame_",
	frameExtension: ".webp",
	framePadding: 4,

	desktopScrollDistance: 450,
	mobileScrollDistance: 300,

	scrub: 0.8,

	captionFadeDuration: 0.08,
	captionY: 45,
};

const DEFAULT_CAPTIONS = [
	{
		eyebrow: "01 / VISION",
		title: "Turn Ambition Into Impact.",
		description:
			"Build a clear vision, create meaningful momentum, and move forward with purpose.",
	},
	{
		eyebrow: "02 / STRATEGY",
		title: "Strategy Creates Momentum.",
		description:
			"Transform ideas into focused strategies that create measurable business growth.",
	},
	{
		eyebrow: "03 / RESULTS",
		title: "Create Work That Matters.",
		description:
			"Lead with confidence, make better decisions, and create lasting results.",
	},
];

const padNumber = (number, padding) => {
	return String(number).padStart(padding, "0");
};

const createFrameUrl = (
	framePath,
	frameExtension,
	framePadding,
	frameIndex
) => {
	return `${framePath}${padNumber(
		frameIndex + 1,
		framePadding
	)}${frameExtension}`;
};

export default function Hero({
	frameCount = DEFAULTS.frameCount,

	framePath = DEFAULTS.framePath,

	frameExtension = DEFAULTS.frameExtension,

	framePadding = DEFAULTS.framePadding,

	captions = DEFAULT_CAPTIONS,

	desktopScrollDistance = DEFAULTS.desktopScrollDistance,

	mobileScrollDistance = DEFAULTS.mobileScrollDistance,

	scrub = DEFAULTS.scrub,

	poster = "/images/hero-poster.webp",

	className = "",
}) {
	const heroRef = useRef(null);
	const stageRef = useRef(null);
	const canvasRef = useRef(null);

	const captionRefs = useRef([]);

	const imagesRef = useRef([]);
	const dimensionsRef = useRef({
		width: 0,
		height: 0,
	});

	const frameRef = useRef(0);

	const renderFrameRef = useRef(null);

	const rafRef = useRef(null);

	const [loadedCount, setLoadedCount] = useState(0);

	const [sequenceReady, setSequenceReady] = useState(false);

	const [sequenceError, setSequenceError] = useState(false);

	const prefersReducedMotion = useMediaQuery(
		"(prefers-reduced-motion: reduce)"
	);

	/*
	 * --------------------------------------------------------------------------
	 * CAPTION REFS
	 * --------------------------------------------------------------------------
	 */

	const setCaptionRef = useCallback((element, index) => {
		captionRefs.current[index] = element;
	}, []);

	/*
	 * --------------------------------------------------------------------------
	 * CANVAS RENDERER
	 * --------------------------------------------------------------------------
	 */

	const renderFrame = useCallback((frameIndex) => {
		const canvas = canvasRef.current;

		const images = imagesRef.current;

		if (!canvas || !images.length) {
			return;
		}

		const context = canvas.getContext("2d", {
			alpha: false,
			desynchronized: true,
		});

		if (!context) {
			return;
		}

		const safeIndex = Math.max(
			0,
			Math.min(Math.round(frameIndex), images.length - 1)
		);

		const image = images[safeIndex];

		if (!image || !image.complete || image.naturalWidth === 0) {
			return;
		}

		frameRef.current = safeIndex;

		const { width, height } = dimensionsRef.current;

		if (!width || !height) {
			return;
		}

		/*
		 * Canvas uses cover behavior.
		 *
		 * This prevents distortion and fills the
		 * complete viewport.
		 */

		const scale = Math.max(
			width / image.naturalWidth,
			height / image.naturalHeight
		);

		const drawWidth = image.naturalWidth * scale;

		const drawHeight = image.naturalHeight * scale;

		const x = (width - drawWidth) / 2;

		const y = (height - drawHeight) / 2;

		/*
		 * Draw the frame.
		 */

		context.drawImage(image, x, y, drawWidth, drawHeight);
	}, []);

	renderFrameRef.current = renderFrame;

	/*
	 * --------------------------------------------------------------------------
	 * CANVAS RESIZE
	 * --------------------------------------------------------------------------
	 */

	const resizeCanvas = useCallback(() => {
		const canvas = canvasRef.current;

		if (!canvas) {
			return;
		}

		const rect = canvas.getBoundingClientRect();

		/*
		 * Limit DPR to 2.
		 *
		 * A 3x/4x DPR canvas can become extremely expensive,
		 * especially with 4K image sequences.
		 */

		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		const width = Math.max(1, Math.round(rect.width));

		const height = Math.max(1, Math.round(rect.height));

		canvas.width = Math.round(width * dpr);

		canvas.height = Math.round(height * dpr);

		dimensionsRef.current = {
			width,
			height,
		};

		const context = canvas.getContext("2d", {
			alpha: false,
			desynchronized: true,
		});

		if (!context) {
			return;
		}

		context.setTransform(dpr, 0, 0, dpr, 0, 0);

		/*
		 * Render current frame after resizing.
		 */

		renderFrame(frameRef.current);
	}, [renderFrame]);

	/*
	 * --------------------------------------------------------------------------
	 * PRELOAD IMAGE SEQUENCE
	 * --------------------------------------------------------------------------
	 */

	useEffect(() => {
		let cancelled = false;

		const images = [];
		let completed = 0;

		setLoadedCount(0);
		setSequenceReady(false);
		setSequenceError(false);

		const updateProgress = () => {
			completed += 1;

			if (cancelled) {
				return;
			}

			setLoadedCount(completed);

			/*
			 * Start only after every frame is loaded.
			 *
			 * This provides deterministic scrolling.
			 */

			if (completed === frameCount) {
				setSequenceReady(true);
			}
		};

		for (let index = 0; index < frameCount; index += 1) {
			const image = new Image();

			image.decoding = "async";

			image.loading = "eager";

			image.src = createFrameUrl(
				framePath,
				frameExtension,
				framePadding,
				index
			);

			image.onload = updateProgress;

			image.onerror = () => {
				if (cancelled) {
					return;
				}

				setSequenceError(true);

				/*
				 * Still count failed frames so one missing
				 * frame doesn't leave the loader stuck forever.
				 */

				updateProgress();
			};

			images.push(image);
		}

		imagesRef.current = images;

		return () => {
			cancelled = true;

			images.forEach((image) => {
				image.onload = null;
				image.onerror = null;
			});

			imagesRef.current = [];
		};
	}, [frameCount, framePath, frameExtension, framePadding]);

	/*
	 * --------------------------------------------------------------------------
	 * RESIZE OBSERVER
	 * --------------------------------------------------------------------------
	 */

	useEffect(() => {
		if (!sequenceReady) {
			return;
		}

		resizeCanvas();

		const observer = new ResizeObserver(() => {
			resizeCanvas();
		});

		if (canvasRef.current) {
			observer.observe(canvasRef.current);
		}

		window.addEventListener("resize", resizeCanvas);

		return () => {
			observer.disconnect();

			window.removeEventListener("resize", resizeCanvas);
		};
	}, [sequenceReady, resizeCanvas]);

	/*
	 * --------------------------------------------------------------------------
	 * INITIAL FRAME
	 * --------------------------------------------------------------------------
	 */

	useEffect(() => {
		if (!sequenceReady) {
			return;
		}

		requestAnimationFrame(() => {
			resizeCanvas();

			renderFrame(0);
		});
	}, [sequenceReady, resizeCanvas, renderFrame]);

	/*
	 * --------------------------------------------------------------------------
	 * GSAP SCROLL TIMELINE
	 * --------------------------------------------------------------------------
	 */

	useGsap(
		() => {
			const hero = heroRef.current;

			const stage = stageRef.current;

			if (!hero || !stage || !sequenceReady) {
				return;
			}

			/*
			 * --------------------------------------------------------------
			 * REDUCED MOTION
			 * --------------------------------------------------------------
			 */

			if (prefersReducedMotion) {
				renderFrame(0);

				captionRefs.current.forEach((caption, index) => {
					if (!caption) {
						return;
					}

					gsap.set(caption, {
						autoAlpha: index === 0 ? 1 : 0,

						y: 0,
					});
				});

				return;
			}

			/*
			 * --------------------------------------------------------------
			 * INITIAL CAPTIONS
			 * --------------------------------------------------------------
			 */

			captionRefs.current.forEach((caption, index) => {
				if (!caption) {
					return;
				}

				gsap.set(caption, {
					autoAlpha: index === 0 ? 1 : 0,

					y: index === 0 ? 0 : DEFAULTS.captionY,
				});
			});

			/*
			 * --------------------------------------------------------------
			 * PLAYHEAD
			 * --------------------------------------------------------------
			 *
			 * This is the key difference from video.currentTime.
			 *
			 * GSAP only animates a number.
			 *
			 * Canvas rendering happens separately.
			 */

			const playhead = {
				frame: 0,
			};

			/*
			 * Avoid rendering the same frame repeatedly.
			 */

			let requestedFrame = 0;

			let renderedFrame = -1;

			/*
			 * --------------------------------------------------------------
			 * FRAME RENDER LOOP
			 * --------------------------------------------------------------
			 */

			const renderRequestedFrame = () => {
				rafRef.current = null;

				if (requestedFrame === renderedFrame) {
					return;
				}

				renderedFrame = requestedFrame;

				renderFrame(requestedFrame);
			};

			const requestRender = () => {
				if (rafRef.current !== null) {
					return;
				}

				rafRef.current = requestAnimationFrame(renderRequestedFrame);
			};

			/*
			 * --------------------------------------------------------------
			 * MASTER TIMELINE
			 * --------------------------------------------------------------
			 */

			const timeline = gsap.timeline({
				defaults: {
					ease: "none",
				},

				scrollTrigger: {
					trigger: hero,

					pin: stage,

					start: "top top",

					end: () => {
						const distance =
							window.innerWidth <= 768
								? mobileScrollDistance
								: desktopScrollDistance;

						return `+=${window.innerHeight * (distance / 100)}`;
					},

					scrub,

					anticipatePin: 1,

					invalidateOnRefresh: true,

					fastScrollEnd: false,

					preventOverlaps: true,
				},
			});

			/*
			 * --------------------------------------------------------------
			 * FRAME ANIMATION
			 * --------------------------------------------------------------
			 */

			timeline.to(
				playhead,
				{
					frame: frameCount - 1,

					duration: 1,

					ease: "none",

					onUpdate: () => {
						requestedFrame = Math.round(playhead.frame);

						requestRender();
					},
				},
				0
			);

			/*
			 * --------------------------------------------------------------
			 * CAPTIONS
			 * --------------------------------------------------------------
			 */

			const captionCount = captions.length;

			if (captionCount > 0) {
				const sectionDuration = 1 / captionCount;

				captions.forEach((_, index) => {
					const caption = captionRefs.current[index];

					if (!caption) {
						return;
					}

					const start = index * sectionDuration;

					const end = (index + 1) * sectionDuration;

					/*
					 * First caption is already visible.
					 */

					if (index > 0) {
						timeline.fromTo(
							caption,
							{
								autoAlpha: 0,
								y: DEFAULTS.captionY,
							},
							{
								autoAlpha: 1,
								y: 0,

								duration: DEFAULTS.captionFadeDuration,

								ease: "power3.out",
							},
							start
						);
					}

					/*
					 * Fade caption out before next caption.
					 */

					if (index < captionCount - 1) {
						timeline.to(
							caption,
							{
								autoAlpha: 0,

								y: -DEFAULTS.captionY,

								duration: DEFAULTS.captionFadeDuration,

								ease: "power3.in",
							},
							end - DEFAULTS.captionFadeDuration
						);
					}
				});
			}

			/*
			 * --------------------------------------------------------------
			 * REFRESH
			 * --------------------------------------------------------------
			 */

			requestAnimationFrame(() => {
				ScrollTrigger.refresh();
			});

			/*
			 * --------------------------------------------------------------
			 * CLEANUP
			 * --------------------------------------------------------------
			 */

			return () => {
				if (rafRef.current !== null) {
					cancelAnimationFrame(rafRef.current);

					rafRef.current = null;
				}
			};
		},
		{
			scope: heroRef,

			dependencies: [
				sequenceReady,
				prefersReducedMotion,
				frameCount,
				captions.length,
				desktopScrollDistance,
				mobileScrollDistance,
				scrub,
			],

			revertOnUpdate: true,
		}
	);

	/*
	 * --------------------------------------------------------------------------
	 * LOADING PROGRESS
	 * --------------------------------------------------------------------------
	 */

	const progress =
		frameCount > 0
			? Math.min(100, Math.round((loadedCount / frameCount) * 100))
			: 0;

	/*
	 * --------------------------------------------------------------------------
	 * CLASSES
	 * --------------------------------------------------------------------------
	 */

	const heroClasses = [
		styles.hero,

		!sequenceReady ? styles.loading : styles.ready,

		sequenceError ? styles.hasError : "",

		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<section ref={heroRef} className={heroClasses} aria-label="Hero">
			<div ref={stageRef} className={styles.stage}>
				{/*
				 * ------------------------------------------------------------------
				 * POSTER FALLBACK
				 * ------------------------------------------------------------------
				 */}

				<div
					className={styles.poster}
					style={{
						backgroundImage: `url("${poster}")`,
					}}
					aria-hidden="true"
				/>

				{/*
				 * ------------------------------------------------------------------
				 * CANVAS
				 * ------------------------------------------------------------------
				 */}

				<canvas
					ref={canvasRef}
					className={styles.canvas}
					aria-hidden="true"
				/>

				{/*
				 * ------------------------------------------------------------------
				 * OVERLAYS
				 * ------------------------------------------------------------------
				 */}

				<div className={styles.videoOverlay} aria-hidden="true" />

				<div className={styles.vignette} aria-hidden="true" />

				{/*
				 * ------------------------------------------------------------------
				 * CAPTION CONTENT
				 * ------------------------------------------------------------------
				 */}

				<div className={styles.content}>
					<div className={styles.captionViewport}>
						{captions.map(
							({ eyebrow, title, description }, index) => (
								<div
									key={`${title}-${index}`}
									ref={(element) =>
										setCaptionRef(element, index)
									}
									className={styles.caption}
									aria-hidden={index !== 0}>
									{eyebrow && (
										<span className={styles.eyebrow}>
											{eyebrow}
										</span>
									)}

									<h1 className={styles.title}>{title}</h1>

									{description && (
										<p className={styles.description}>
											{description}
										</p>
									)}
								</div>
							)
						)}
					</div>
				</div>

				{/*
				 * ------------------------------------------------------------------
				 * SCROLL INDICATOR
				 * ------------------------------------------------------------------
				 */}

				<div className={styles.scrollIndicator} aria-hidden="true">
					<span className={styles.scrollLine} />

					<span className={styles.scrollText}>Scroll to explore</span>
				</div>

				{/*
				 * ------------------------------------------------------------------
				 * COUNTER
				 * ------------------------------------------------------------------
				 */}

				<div className={styles.heroCounter} aria-hidden="true">
					<span>01</span>

					<span className={styles.counterDivider}>/</span>

					<span>{String(captions.length).padStart(2, "0")}</span>
				</div>

				{/*
				 * ------------------------------------------------------------------
				 * LOADER
				 * ------------------------------------------------------------------
				 */}

				<div className={styles.loader} aria-hidden="true">
					<span className={styles.loaderLabel}>
						Loading experience
					</span>

					<span className={styles.loaderProgress}>{progress}%</span>

					<div className={styles.loaderTrack}>
						<span
							className={styles.loaderBar}
							style={{
								transform: `scaleX(${progress / 100})`,
							}}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
