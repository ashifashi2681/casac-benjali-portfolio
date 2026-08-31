"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useGsap } from "@/hooks/useGsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { gsap, ScrollTrigger } from "@/animations/gsap";

import styles from "./Hero.module.css";

const DEFAULTS = {
	frameCount: 293,

	framePath: "/images/hero-sequence/ezgif-frame-",

	frameExtension: ".jpg",

	framePadding: 3,

	desktopScrollDistance: 450,

	mobileScrollDistance: 300,

	scrub: 0.8,

	captionFadeDuration: 0.08,

	captionY: 45,

	maxConcurrentRequests: 8,
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

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| FIND NEAREST LOADED FRAME
|--------------------------------------------------------------------------
|
| If the exact requested frame isn't loaded yet, use the nearest
| available frame temporarily.
|
*/

const getNearestLoadedFrame = (targetIndex, loadedFrames, frameTotal) => {
	if (loadedFrames.has(targetIndex)) {
		return targetIndex;
	}

	for (let offset = 1; offset < frameTotal; offset += 1) {
		const previousIndex = targetIndex - offset;

		const nextIndex = targetIndex + offset;

		if (previousIndex >= 0 && loadedFrames.has(previousIndex)) {
			return previousIndex;
		}

		if (nextIndex < frameTotal && loadedFrames.has(nextIndex)) {
			return nextIndex;
		}
	}

	return -1;
};

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function Hero({
	frameCount = DEFAULTS.frameCount,

	framePath = DEFAULTS.framePath,

	frameExtension = DEFAULTS.frameExtension,

	framePadding = DEFAULTS.framePadding,

	captions = DEFAULT_CAPTIONS,

	desktopScrollDistance = DEFAULTS.desktopScrollDistance,

	mobileScrollDistance = DEFAULTS.mobileScrollDistance,

	scrub = DEFAULTS.scrub,

	poster = "/images/hero-poster.jpg",

	className = "",
}) {
	/*
	|--------------------------------------------------------------------------
	| DOM REFS
	|--------------------------------------------------------------------------
	*/

	const heroRef = useRef(null);

	const stageRef = useRef(null);

	const canvasRef = useRef(null);

	const contextRef = useRef(null);

	/*
	|--------------------------------------------------------------------------
	| CAPTION REFS
	|--------------------------------------------------------------------------
	*/

	const captionRefs = useRef([]);

	/*
	|--------------------------------------------------------------------------
	| IMAGE SEQUENCE STATE
	|--------------------------------------------------------------------------
	*/

	const imagesRef = useRef([]);

	const loadedFramesRef = useRef(new Set());

	/*
	|--------------------------------------------------------------------------
	| FRAME STATE
	|--------------------------------------------------------------------------
	|
	| requestedFrameRef
	|
	| The frame GSAP currently wants.
	|
	| renderedFrameRef
	|
	| The frame actually drawn to canvas.
	|
	| These MUST be separate because the requested frame may not
	| have finished loading yet.
	|
	*/

	const requestedFrameRef = useRef(0);

	const renderedFrameRef = useRef(-1);

	/*
	|--------------------------------------------------------------------------
	| CANVAS DIMENSIONS
	|--------------------------------------------------------------------------
	*/

	const dimensionsRef = useRef({
		width: 0,

		height: 0,

		dpr: 1,
	});

	/*
	|--------------------------------------------------------------------------
	| RAF
	|--------------------------------------------------------------------------
	*/

	const renderRafRef = useRef(null);

	/*
	|--------------------------------------------------------------------------
	| REACT STATE
	|--------------------------------------------------------------------------
	*/

	const [loadedCount, setLoadedCount] = useState(0);

	const [sequenceReady, setSequenceReady] = useState(false);

	const [sequenceError, setSequenceError] = useState(false);

	const prefersReducedMotion = useMediaQuery(
		"(prefers-reduced-motion: reduce)"
	);

	/*
	|--------------------------------------------------------------------------
	| CAPTION REF
	|--------------------------------------------------------------------------
	*/

	const setCaptionRef = useCallback((element, index) => {
		captionRefs.current[index] = element;
	}, []);

	/*
	|--------------------------------------------------------------------------
	| RENDER FRAME
	|--------------------------------------------------------------------------
	*/

	const renderFrame = useCallback((frameIndex) => {
		const canvas = canvasRef.current;

		const context = contextRef.current;

		const images = imagesRef.current;

		if (!canvas || !context || !images.length) {
			return;
		}

		/*
		 * Clamp requested frame.
		 */

		const targetIndex = Math.max(
			0,

			Math.min(
				Math.round(frameIndex),

				images.length - 1
			)
		);

		/*
		 * IMPORTANT:
		 *
		 * Always remember the actual requested
		 * frame, even if it isn't loaded.
		 */

		requestedFrameRef.current = targetIndex;

		/*
		 * Find the nearest available frame.
		 */

		const safeIndex = getNearestLoadedFrame(
			targetIndex,

			loadedFramesRef.current,

			images.length
		);

		if (safeIndex < 0) {
			return;
		}

		const image = images[safeIndex];

		if (!image || !image.complete || image.naturalWidth === 0) {
			return;
		}

		const { width, height } = dimensionsRef.current;

		if (!width || !height) {
			return;
		}

		/*
		 * Cover calculation.
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
		 * Draw image.
		 */

		context.drawImage(
			image,

			x,

			y,

			drawWidth,

			drawHeight
		);

		/*
		 * IMPORTANT:
		 *
		 * Store what was actually rendered,
		 * not what was requested.
		 */

		renderedFrameRef.current = safeIndex;
	}, []);

	/*
	|--------------------------------------------------------------------------
	| SCHEDULE FRAME RENDER
	|--------------------------------------------------------------------------
	|
	| requestAnimationFrame prevents multiple canvas draws during the same
	| browser frame.
	|
	*/

	const scheduleFrameRender = useCallback(() => {
		if (renderRafRef.current !== null) {
			return;
		}

		renderRafRef.current = requestAnimationFrame(() => {
			renderRafRef.current = null;

			renderFrame(requestedFrameRef.current);
		});
	}, [renderFrame]);

	/*
	|--------------------------------------------------------------------------
	| RESIZE CANVAS
	|--------------------------------------------------------------------------
	*/

	const resizeCanvas = useCallback(() => {
		const canvas = canvasRef.current;

		if (!canvas) {
			return;
		}

		const rect = canvas.getBoundingClientRect();

		const dpr = Math.min(
			window.devicePixelRatio || 1,

			2
		);

		const width = Math.max(
			1,

			Math.round(rect.width)
		);

		const height = Math.max(
			1,

			Math.round(rect.height)
		);

		const dimensions = dimensionsRef.current;

		/*
		 * If only the canvas CSS dimensions remain
		 * unchanged, don't recreate the backing canvas.
		 */

		if (
			dimensions.width === width &&
			dimensions.height === height &&
			dimensions.dpr === dpr &&
			contextRef.current
		) {
			scheduleFrameRender();

			return;
		}

		/*
		 * Set actual canvas resolution.
		 */

		canvas.width = Math.round(width * dpr);

		canvas.height = Math.round(height * dpr);

		dimensionsRef.current = {
			width,

			height,

			dpr,
		};

		const context = canvas.getContext("2d", {
			alpha: false,

			desynchronized: true,
		});

		if (!context) {
			return;
		}

		contextRef.current = context;

		/*
		 * Work in CSS pixel coordinates.
		 */

		context.setTransform(dpr, 0, 0, dpr, 0, 0);

		/*
		 * Render the current requested frame.
		 */

		scheduleFrameRender();
	}, [scheduleFrameRender]);

	/*
	|--------------------------------------------------------------------------
	| PRELOAD IMAGE SEQUENCE
	|--------------------------------------------------------------------------
	*/

	useEffect(() => {
		let cancelled = false;

		/*
		 * Reset sequence state.
		 */

		const images = Array.from({
			length: frameCount,
		});

		imagesRef.current = images;

		loadedFramesRef.current = new Set();

		requestedFrameRef.current = 0;

		renderedFrameRef.current = -1;

		let completed = 0;

		let nextIndex = 0;

		let activeRequests = 0;

		let firstFrameReady = false;

		let progressFrame = null;

		const maxConcurrentRequests = DEFAULTS.maxConcurrentRequests;

		/*
		 * --------------------------------------------------------------
		 * PROGRESS
		 * --------------------------------------------------------------
		 */

		const flushProgress = () => {
			progressFrame = null;

			if (cancelled) {
				return;
			}

			setLoadedCount(completed);
		};

		const requestProgressUpdate = () => {
			if (progressFrame !== null) {
				return;
			}

			progressFrame = requestAnimationFrame(flushProgress);
		};

		/*
		 * --------------------------------------------------------------
		 * FRAME LOADED
		 * --------------------------------------------------------------
		 */

		const handleFrameLoaded = (index) => {
			if (cancelled) {
				return;
			}

			loadedFramesRef.current.add(index);

			completed += 1;

			activeRequests -= 1;

			/*
			 * ----------------------------------------------------------
			 * FIRST FRAME
			 * ----------------------------------------------------------
			 *
			 * As soon as frame 001 is ready,
			 * the hero can become visible.
			 */

			if (!firstFrameReady && index === 0) {
				firstFrameReady = true;

				requestedFrameRef.current = 0;

				setSequenceReady(true);

				requestAnimationFrame(() => {
					if (cancelled) {
						return;
					}

					resizeCanvas();

					renderFrame(0);
				});
			}

			/*
			 * ----------------------------------------------------------
			 * IMPORTANT
			 * ----------------------------------------------------------
			 *
			 * If the frame that just finished loading is the frame
			 * currently requested by GSAP, render it immediately.
			 */

			const requestedFrame = requestedFrameRef.current;

			if (index === requestedFrame) {
				scheduleFrameRender();
			}

			requestProgressUpdate();

			/*
			 * Continue loading.
			 */

			loadNextFrame();
		};

		/*
		 * --------------------------------------------------------------
		 * FRAME ERROR
		 * --------------------------------------------------------------
		 */

		const handleFrameError = () => {
			if (cancelled) {
				return;
			}

			completed += 1;

			activeRequests -= 1;

			setSequenceError(true);

			requestProgressUpdate();

			loadNextFrame();
		};

		/*
		 * --------------------------------------------------------------
		 * LOAD FRAME
		 * --------------------------------------------------------------
		 */

		const loadFrame = (index) => {
			const image = new Image();

			/*
			 * Decode asynchronously.
			 */

			image.decoding = "async";

			/*
			 * Do NOT use lazy loading.
			 *
			 * This is an animation sequence, not a normal image.
			 */

			if ("fetchPriority" in image) {
				image.fetchPriority = index < 12 ? "high" : "auto";
			}

			images[index] = image;

			image.onload = () => {
				handleFrameLoaded(index);
			};

			image.onerror = () => {
				handleFrameError();
			};

			image.src = createFrameUrl(
				framePath,

				frameExtension,

				framePadding,

				index
			);
		};

		/*
		 * --------------------------------------------------------------
		 * CONCURRENT LOADER
		 * --------------------------------------------------------------
		 */

		function loadNextFrame() {
			while (
				activeRequests < maxConcurrentRequests &&
				nextIndex < frameCount &&
				!cancelled
			) {
				const frameIndex = nextIndex;

				nextIndex += 1;

				activeRequests += 1;

				loadFrame(frameIndex);
			}
		}

		/*
		 * Start loading.
		 */

		setLoadedCount(0);

		setSequenceReady(false);

		setSequenceError(false);

		loadNextFrame();

		/*
		 * --------------------------------------------------------------
		 * CLEANUP
		 * --------------------------------------------------------------
		 */

		return () => {
			cancelled = true;

			if (progressFrame !== null) {
				cancelAnimationFrame(progressFrame);
			}

			images.forEach((image) => {
				if (!image) {
					return;
				}

				image.onload = null;

				image.onerror = null;

				/*
				 * Abort the browser request where possible.
				 */

				image.src = "";
			});

			imagesRef.current = [];

			loadedFramesRef.current = new Set();
		};
	}, [
		frameCount,

		framePath,

		frameExtension,

		framePadding,

		renderFrame,

		resizeCanvas,

		scheduleFrameRender,
	]);

	/*
	|--------------------------------------------------------------------------
	| RESIZE OBSERVER
	|--------------------------------------------------------------------------
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

		window.addEventListener("resize", resizeCanvas, {
			passive: true,
		});

		return () => {
			observer.disconnect();

			window.removeEventListener("resize", resizeCanvas);
		};
	}, [sequenceReady, resizeCanvas]);

	/*
	|--------------------------------------------------------------------------
	| INITIAL FRAME
	|--------------------------------------------------------------------------
	*/

	useEffect(() => {
		if (!sequenceReady) {
			return;
		}

		requestAnimationFrame(() => {
			resizeCanvas();

			renderFrame(requestedFrameRef.current);
		});
	}, [sequenceReady, resizeCanvas, renderFrame]);

	/*
	|--------------------------------------------------------------------------
	| GSAP SCROLL TIMELINE
	|--------------------------------------------------------------------------
	*/

	useGsap(
		() => {
			const hero = heroRef.current;

			const stage = stageRef.current;

			if (!hero || !stage || !sequenceReady) {
				return;
			}

			/*
			 * ----------------------------------------------------------
			 * REDUCED MOTION
			 * ----------------------------------------------------------
			 */

			if (prefersReducedMotion) {
				requestedFrameRef.current = 0;

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
			 * ----------------------------------------------------------
			 * INITIAL CAPTION STATE
			 * ----------------------------------------------------------
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
			 * ----------------------------------------------------------
			 * GSAP PLAYHEAD
			 * ----------------------------------------------------------
			 */

			const playhead = {
				frame: 0,
			};

			/*
			 * ----------------------------------------------------------
			 * MASTER TIMELINE
			 * ----------------------------------------------------------
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

					/*
					 * Higher scrub = smoother but more delayed.
					 *
					 * 0.6 - 0.9 is generally good for image sequences.
					 */

					scrub,

					anticipatePin: 1,

					invalidateOnRefresh: true,

					fastScrollEnd: false,

					preventOverlaps: true,
				},
			});

			/*
			 * ----------------------------------------------------------
			 * FRAME ANIMATION
			 * ----------------------------------------------------------
			 */

			timeline.to(
				playhead,
				{
					frame: frameCount - 1,

					duration: 1,

					ease: "none",

					onUpdate: () => {
						const frame = Math.round(playhead.frame);

						/*
						 * GSAP requested frame.
						 */

						requestedFrameRef.current = frame;

						/*
						 * Render it on next browser frame.
						 */

						scheduleFrameRender();
					},
				},

				0
			);

			/*
			 * ----------------------------------------------------------
			 * CAPTION TIMELINE
			 * ----------------------------------------------------------
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
					 * ------------------------------------------------
					 * ENTER
					 * ------------------------------------------------
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
					 * ------------------------------------------------
					 * EXIT
					 * ------------------------------------------------
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
			 * ----------------------------------------------------------
			 * SCROLLTRIGGER REFRESH
			 * ----------------------------------------------------------
			 */

			requestAnimationFrame(() => {
				ScrollTrigger.refresh();
			});

			/*
			 * ----------------------------------------------------------
			 * CLEANUP
			 * ----------------------------------------------------------
			 */

			return () => {
				if (renderRafRef.current !== null) {
					cancelAnimationFrame(renderRafRef.current);

					renderRafRef.current = null;
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
	|--------------------------------------------------------------------------
	| LOADING PROGRESS
	|--------------------------------------------------------------------------
	*/

	const progress =
		frameCount > 0
			? Math.min(
					100,

					Math.round((loadedCount / frameCount) * 100)
			  )
			: 0;

	/*
	|--------------------------------------------------------------------------
	| HERO CLASS
	|--------------------------------------------------------------------------
	*/

	const heroClasses = [
		styles.hero,

		!sequenceReady ? styles.loading : styles.ready,

		sequenceError ? styles.hasError : "",

		className,
	]
		.filter(Boolean)
		.join(" ");

	/*
	|--------------------------------------------------------------------------
	| RENDER
	|--------------------------------------------------------------------------
	*/

	return (
		<section ref={heroRef} className={heroClasses} aria-label="Hero">
			<div ref={stageRef} className={styles.stage}>
				{/*
				 * --------------------------------------------------------------
				 * POSTER
				 * --------------------------------------------------------------
				 */}

				<div
					className={styles.poster}
					style={{
						backgroundImage: `url("${poster}")`,
					}}
					aria-hidden="true"
				/>

				{/*
				 * --------------------------------------------------------------
				 * CANVAS
				 * --------------------------------------------------------------
				 */}

				<canvas
					ref={canvasRef}
					className={styles.canvas}
					aria-hidden="true"
				/>

				{/*
				 * --------------------------------------------------------------
				 * VIDEO OVERLAY
				 * --------------------------------------------------------------
				 */}

				<div className={styles.videoOverlay} aria-hidden="true" />

				{/*
				 * --------------------------------------------------------------
				 * VIGNETTE
				 * --------------------------------------------------------------
				 */}

				<div className={styles.vignette} aria-hidden="true" />

				{/*
				 * --------------------------------------------------------------
				 * CAPTIONS
				 * --------------------------------------------------------------
				 */}

				<div className={styles.content}>
					<div className={styles.captionViewport}>
						{captions.map(
							(
								{ eyebrow, title, description },

								index
							) => (
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
				 * --------------------------------------------------------------
				 * SCROLL INDICATOR
				 * --------------------------------------------------------------
				 */}

				<div className={styles.scrollIndicator} aria-hidden="true">
					<span className={styles.scrollLine} />

					<span className={styles.scrollText}>Scroll to explore</span>
				</div>

				{/*
				 * --------------------------------------------------------------
				 * COUNTER
				 * --------------------------------------------------------------
				 */}

				<div className={styles.heroCounter} aria-hidden="true">
					<span>01</span>

					<span className={styles.counterDivider}>/</span>

					<span>{String(captions.length).padStart(2, "0")}</span>
				</div>

				{/*
				 * --------------------------------------------------------------
				 * LOADER
				 * --------------------------------------------------------------
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
