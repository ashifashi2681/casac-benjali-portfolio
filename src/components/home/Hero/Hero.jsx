"use client";

import { useEffect, useRef, useState } from "react";

import { useGsap } from "@/hooks/useGsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { gsap, ScrollTrigger } from "@/animations/gsap";

import styles from "./Hero.module.css";

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

const DEFAULTS = {
	/*
	 * Scroll distance relative to viewport height.
	 *
	 * 400vh means the user scrolls through roughly 4 viewport heights
	 * while the hero remains pinned.
	 */
	desktopScrollDistance: 1300,

	/*
	 * Slightly shorter on mobile.
	 */
	mobileScrollDistance: 300,

	/*
	 * Numeric scrub creates a little smoothing between the scrollbar
	 * and the animation playhead.
	 */
	scrub: 5,

	/*
	 * Caption transition duration measured in timeline proportions.
	 */
	captionFadeDuration: 0.08,

	/*
	 * Amount of vertical movement used for caption entrance.
	 */
	captionY: 45,

	/*
	 * Limit scroll-driven seeking. Video decoding is usually the expensive
	 * part of this hero, so avoid asking the browser to decode a new frame for
	 * every tiny scroll delta.
	 */
	videoSeekFps: 24,
};

export default function Hero({
	videoSrc = "/videos/hero.mp4",
	poster = "/images/hero-poster.png",
	captions = DEFAULT_CAPTIONS,

	desktopScrollDistance = DEFAULTS.desktopScrollDistance,

	mobileScrollDistance = DEFAULTS.mobileScrollDistance,

	scrub = DEFAULTS.scrub,

	className = "",
}) {
	const heroRef = useRef(null);
	const stageRef = useRef(null);
	const videoRef = useRef(null);

	const captionRefs = useRef([]);

	const [videoReady, setVideoReady] = useState(false);

	const prefersReducedMotion = useMediaQuery(
		"(prefers-reduced-motion: reduce)"
	);

	/*
	 * --------------------------------------------------------------------------
	 * CAPTION REFS
	 * --------------------------------------------------------------------------
	 */

	const setCaptionRef = (element, index) => {
		captionRefs.current[index] = element;
	};

	const markVideoReady = () => {
		const video = videoRef.current;

		if (!video) {
			return false;
		}

		if (Number.isFinite(video.duration) && video.duration > 0) {
			setVideoReady(true);

			return true;
		}

		return false;
	};

	useEffect(() => {
		const video = videoRef.current;

		if (!video) {
			return;
		}

		if (markVideoReady()) {
			return;
		}

		const handleReady = () => {
			markVideoReady();
		};

		video.addEventListener("loadedmetadata", handleReady);
		video.addEventListener("loadeddata", handleReady);
		video.addEventListener("canplay", handleReady);

		if (video.readyState === 0) {
			video.load();
		}

		return () => {
			video.removeEventListener("loadedmetadata", handleReady);
			video.removeEventListener("loadeddata", handleReady);
			video.removeEventListener("canplay", handleReady);
		};
	}, [videoSrc]);

	/*
	 * --------------------------------------------------------------------------
	 * GSAP MASTER TIMELINE
	 * --------------------------------------------------------------------------
	 *
	 * The entire hero sequence lives inside one GSAP context.
	 *
	 * ScrollTrigger controls the timeline.
	 *
	 * Timeline:
	 *
	 * 0% ------------------------------------------ 100%
	 * │                                             │
	 * Video 0s                                  Video 12s
	 * │                                             │
	 * Caption 1 → Caption 2 → Caption 3
	 *
	 * useGsap() handles context/revert lifecycle.
	 */

	useGsap(
		() => {
			const hero = heroRef.current;
			const stage = stageRef.current;
			const video = videoRef.current;

			if (!hero || !stage || !video) {
				return;
			}

			/*
			 * We need video metadata before duration/currentTime can
			 * be reliably used.
			 */
			if (!videoReady || !video.duration) {
				return;
			}

			/*
			 * ----------------------------------------------------------------------
			 * REDUCED MOTION
			 * ----------------------------------------------------------------------
			 *
			 * Don't create a large pinned scroll animation for users who have
			 * explicitly requested reduced motion.
			 */

			if (prefersReducedMotion) {
				gsap.set(stage, {
					clearProps: "all",
				});

				gsap.set(video, {
					currentTime: 0,
				});

				captionRefs.current.forEach((caption, index) => {
					if (!caption) return;

					gsap.set(caption, {
						autoAlpha: index === 0 ? 1 : 0,
						y: 0,
					});
				});

				return;
			}

			/*
			 * ----------------------------------------------------------------------
			 * VIDEO
			 * ----------------------------------------------------------------------
			 */

			const duration = video.duration;
			const frameDuration = 1 / DEFAULTS.videoSeekFps;
			let seekFrame = 0;
			let pendingTime = 0;
			let lastSeekTime = -1;

			const seekVideo = (progress) => {
				pendingTime = Math.min(
					Math.max(duration * progress, 0),
					Math.max(duration - 0.001, 0)
				);

				if (seekFrame) {
					return;
				}

				seekFrame = requestAnimationFrame(() => {
					seekFrame = 0;

					const snappedTime =
						Math.min(
							Math.round(pendingTime / frameDuration) *
								frameDuration,
							Math.max(duration - 0.001, 0)
						);

					if (
						lastSeekTime >= 0 &&
						Math.abs(snappedTime - lastSeekTime) <
							frameDuration * 0.5
					) {
						return;
					}

					lastSeekTime = snappedTime;
					video.currentTime = snappedTime;
				});
			};

			/*
			 * Make sure the video starts at the first frame.
			 */
			gsap.set(video, {
				currentTime: 0,
			});

			/*
			 * Some browsers require the video to be paused before manually
			 * controlling currentTime.
			 */
			// video.pause();

			/*
			 * ----------------------------------------------------------------------
			 * INITIAL CAPTION STATE
			 * ----------------------------------------------------------------------
			 */

			captionRefs.current.forEach((caption, index) => {
				if (!caption) return;

				gsap.set(caption, {
					autoAlpha: index === 0 ? 1 : 0,
					y: index === 0 ? 0 : DEFAULTS.captionY,
				});
			});

			/*
			 * ----------------------------------------------------------------------
			 * MASTER TIMELINE
			 * ----------------------------------------------------------------------
			 */

			const timeline = gsap.timeline({
				defaults: {
					ease: "none",
				},

				scrollTrigger: {
					trigger: hero,

					/*
					 * Keep the hero stage fixed while the timeline progresses.
					 */
					pin: stage,

					/*
					 * Start when hero reaches viewport top.
					 */
					start: "top top",

					/*
					 * Dynamically calculate scroll distance.
					 */
					end: () => {
						const distance =
							window.innerWidth <= 768
								? mobileScrollDistance
								: desktopScrollDistance;

						return `+=${window.innerHeight * (distance / 100)}`;
					},

					/*
					 * Smooth scroll-driven playback.
					 */
					scrub,

					/*
					 * Helps reduce visible pinning delay on fast scrolling.
					 */
					anticipatePin: 1,

					/*
					 * Important for responsive layouts.
					 */
					invalidateOnRefresh: true,

					/*
					 * Refresh after fonts/images/layout changes.
					 */
					onRefresh: () => {
						/*
						 * Keep video position synchronized after refresh.
						 */
						if (!Number.isFinite(video.currentTime)) {
							video.currentTime = 0;
						}
					},

					onUpdate: (self) => {
						seekVideo(self.progress);
					},
				},
			});

			/*
			 * ----------------------------------------------------------------------
			 * TIMELINE LENGTH
			 * ----------------------------------------------------------------------
			 *
			 * Keep the timeline normalized to 0..1. Video seeking happens in
			 * ScrollTrigger's onUpdate callback so it can be throttled.
			 */

			timeline.to({}, { duration: 1 }, 0);

			/*
			 * ----------------------------------------------------------------------
			 * CAPTION TIMELINE
			 * ----------------------------------------------------------------------
			 *
			 * Divide the sequence into equal sections based on the number
			 * of captions.
			 */

			const captionCount = captions.length;

			if (captionCount > 0) {
				const sectionDuration = 1 / captionCount;

				captions.forEach((_, index) => {
					const caption = captionRefs.current[index];

					if (!caption) return;

					const start = index * sectionDuration;

					const end = (index + 1) * sectionDuration;

					/*
					 * Caption 1 starts visible.
					 */
					if (index === 0) {
						gsap.set(caption, {
							autoAlpha: 1,
							y: 0,
						});
					}

					/*
					 * Every caption except the first enters.
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
					 * Fade the current caption out near the end
					 * of its section.
					 *
					 * The last caption remains visible until the hero
					 * sequence finishes.
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
			 * ----------------------------------------------------------------------
			 * FINAL VIDEO FRAME
			 * ----------------------------------------------------------------------
			 *
			 * Ensure the video is exactly at the final frame when the timeline
			 * reaches the end.
			 */

			timeline.call(
				() => {
					video.currentTime = Math.max(0, duration - 0.001);
				},
				null,
				1
			);

			/*
			 * ----------------------------------------------------------------------
			 * REFRESH
			 * ----------------------------------------------------------------------
			 *
			 * ScrollTrigger calculates its positions automatically, but an
			 * explicit refresh after setup is useful for dynamic content.
			 */

			requestAnimationFrame(() => {
				ScrollTrigger.refresh();
			});

			return () => {
				if (seekFrame) {
					cancelAnimationFrame(seekFrame);
				}
			};
		},
		{
			scope: heroRef,

			dependencies: [
				videoReady,
				prefersReducedMotion,
				videoSrc,
				desktopScrollDistance,
				mobileScrollDistance,
				scrub,
				captions.length,
			],

			revertOnUpdate: true,
		}
	);

	/*
	 * --------------------------------------------------------------------------
	 * VIDEO METADATA
	 * --------------------------------------------------------------------------
	 */

	const handleLoadedMetadata = () => {
		markVideoReady();
	};

	/*
	 * --------------------------------------------------------------------------
	 * VIDEO ERROR
	 * --------------------------------------------------------------------------
	 */

	const handleVideoError = () => {
		setVideoReady(false);
	};

	/*
	 * --------------------------------------------------------------------------
	 * MOBILE / REDUCED MOTION
	 * --------------------------------------------------------------------------
	 *
	 * We still render the video element so the poster can act as the visual
	 * fallback. The timeline itself decides whether to animate it.
	 */

	const classes = [styles.hero, !videoReady ? styles.loading : "", className]
		.filter(Boolean)
		.join(" ");

	return (
		<section ref={heroRef} className={classes} aria-label="Hero">
			<div ref={stageRef} className={styles.stage}>
				<div className={styles.media}>
					<video
						ref={videoRef}
						className={styles.video}
						src={videoSrc}
						poster={poster}
						muted
						playsInline
						preload="auto"
						disablePictureInPicture
						controls={false}
						aria-hidden="true"
						onLoadedMetadata={handleLoadedMetadata}
						onError={handleVideoError}
					/>

					<div className={styles.videoOverlay} aria-hidden="true" />

					<div className={styles.vignette} aria-hidden="true" />
				</div>

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

				<div className={styles.scrollIndicator} aria-hidden="true">
					<span className={styles.scrollLine} />

					<span className={styles.scrollText}>Scroll to explore</span>
				</div>

				<div className={styles.heroCounter} aria-hidden="true">
					<span>01</span>
					<span className={styles.counterDivider}>/</span>
					<span>03</span>
				</div>
			</div>
		</section>
	);
}
