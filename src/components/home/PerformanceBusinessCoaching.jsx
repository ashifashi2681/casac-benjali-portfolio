"use client";

import { useRef } from "react";
import SectionTitle from "../ui/SectionTitle";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { useGsap } from "@/hooks/useGsap";

const TRANSFORMATION = [
	"Potential",
	"Clarity",
	"Strategy",
	"Execution",
	"Performance",
	"Growth",
];

const PILLARS = [
	{
		num: "01",
		title: "Entrepreneurship",
		description:
			"Develop the entrepreneurial mindset, capabilities, and decision-making skills required to navigate challenges, identify opportunities, and build a stronger business foundation.",
	},
	{
		num: "02",
		title: "Business Strategy",
		description:
			"Gain greater clarity around your business direction, priorities, opportunities, and growth strategy to make more informed strategic decisions.",
	},
	{
		num: "03",
		title: "Leadership",
		description:
			"Strengthen your ability to lead people, influence performance, make better decisions, and build teams that contribute to business growth.",
	},
	{
		num: "04",
		title: "Personal Development",
		description:
			"Improve personal effectiveness, mindset, confidence, discipline, and performance to become more capable of handling the demands of entrepreneurship.",
	},
	{
		num: "05",
		title: "Sales Performance",
		description:
			"Develop stronger sales thinking, customer engagement, conversion, and performance capabilities to create more consistent business results.",
	},
	{
		num: "06",
		title: "Marketing & Branding",
		description:
			"Build a stronger understanding of marketing and brand positioning to create greater visibility, customer connection, and business opportunities.",
	},
	{
		num: "07",
		title: "Wealth & Financial Growth",
		description:
			"Develop a broader perspective on wealth creation, financial growth, and the business decisions that influence long-term financial performance.",
	},
	{
		num: "08",
		title: "Operational Efficiency",
		description:
			"Identify opportunities to improve processes, productivity, execution, and operational effectiveness so the business can perform more efficiently.",
	},
	{
		num: "09",
		title: "Business Growth & Scale",
		description:
			"Create the strategic clarity and performance mindset required to strengthen the business, identify growth opportunities, and move towards sustainable scale.",
	},
];

const APPROACH = [
	{
		title: "Think Better",
		description:
			"Develop clearer thinking, stronger self-awareness, and a strategic mindset.",
	},
	{
		title: "Decide Better",
		description:
			"Make more confident and informed business and leadership decisions.",
	},
	{
		title: "Execute Better",
		description:
			"Turn strategy into focused action, consistent execution, and measurable progress.",
	},
	{
		title: "Perform Better",
		description:
			"Improve personal, team, and business performance through continuous development.",
	},
	{
		title: "Grow Better",
		description:
			"Build the capabilities required for sustainable business growth and long-term success.",
	},
];

const PROGRAMMES = [
	{
		name: "Chanakya",
		description:
			"A structured development programme focused on strengthening entrepreneurial thinking, business capabilities, leadership, and performance.",
	},
	{
		name: "10X",
		description:
			"A performance-focused programme designed around ambitious thinking, growth, execution, and achieving higher levels of business performance.",
	},
	{
		name: "Self Mastery",
		description:
			"A personal development journey focused on mindset, self-awareness, personal effectiveness, and the capabilities required for higher performance.",
	},
	{
		name: "Wealth Mastery",
		description:
			"A programme focused on developing a stronger approach to wealth creation, financial growth, and long-term business success.",
	},
];

const AUDIENCE = [
	{
		who: "Entrepreneurs",
		why: "looking to build and grow stronger businesses.",
	},
	{
		who: "Business Owners",
		why: "facing growth, performance, leadership, or operational challenges.",
	},
	{
		who: "Business Professionals",
		why: "seeking stronger strategic thinking and personal performance.",
	},
	{
		who: "Emerging Leaders",
		why: "preparing to take greater responsibility and create organisational impact.",
	},
	{
		who: "High-Performance Individuals",
		why: "who want to move from potential to consistent execution and measurable results.",
	},
];

const REASONS = [
	{
		title: "Practical Business Experience",
		description:
			"Coaching is informed by real-world experience across entrepreneurship, sales, consulting, leadership, and business development.",
	},
	{
		title: "Strategic Thinking",
		description:
			"Develop the ability to look beyond immediate challenges and make decisions with greater clarity and long-term perspective.",
	},
	{
		title: "Performance Focus",
		description:
			"The coaching approach is centred on meaningful improvement, practical execution, and business performance.",
	},
	{
		title: "Personalised Development",
		description:
			"The focus can be adapted to the individual's business situation, goals, capabilities, challenges, and growth requirements.",
	},
	{
		title: "Business & Personal Growth",
		description:
			"Sustainable business growth begins with developing the person behind the business.",
	},
];

function PerformanceBusinessCoaching() {
	const rootRef = useRef(null);

	useGsap(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const reducedMotion = window.matchMedia(
				"(prefers-reduced-motion: reduce)"
			).matches;

			/*
			 * Generic reveals — intro, approach, programmes, audience, reasons, outro.
			 */
			gsap.from(`[data-reveal]`, {
				y: 48,
				opacity: 0,
				duration: reducedMotion ? 0.01 : 1,
				ease: "expo.out",
				stagger: 0.1,
				scrollTrigger: {
					trigger: root,
					start: "top 78%",
					toggleActions: "play none none reverse",
				},
			});

			gsap.utils.toArray(`[data-group]`, root).forEach((group) => {
				const items = gsap.utils.toArray(`[data-item]`, group);
				if (!items.length) return;

				gsap.from(items, {
					y: 40,
					opacity: 0,
					duration: reducedMotion ? 0.01 : 0.85,
					ease: "power3.out",
					stagger: 0.08,
					scrollTrigger: {
						trigger: group,
						start: "top 82%",
						toggleActions: "play none none reverse",
					},
				});
			});

			/*
			 * Transformation words — each activates sequentially on scroll.
			 */
			const words = gsap.utils.toArray(`[data-word]`, root);

			words.forEach((word, i) => {
				gsap.fromTo(
					word,
					{ opacity: 0.18, scale: 0.96 },
					{
						opacity: 1,
						scale: 1,
						color: "#f8fafc",
						duration: reducedMotion ? 0.01 : 0.6,
						ease: "power2.out",
						scrollTrigger: {
							trigger: `[data-transformation]`,
							start: `top ${72 - i * 6}%`,
							end: `top ${52 - i * 6}%`,
							toggleActions: "play reverse play reverse",
						},
					}
				);
			});

			/*
			 * Pillar highlighting — each pillar brightens while in view.
			 */
			gsap.utils.toArray(`[data-pillar]`, root).forEach((pillar) => {
				gsap.fromTo(
					pillar,
					{ opacity: 0.35, x: -14 },
					{
						opacity: 1,
						x: 0,
						duration: reducedMotion ? 0.01 : 0.7,
						ease: "power3.out",
						scrollTrigger: {
							trigger: pillar,
							start: "top 76%",
							end: "bottom 34%",
							toggleActions: "play reverse play reverse",
						},
					}
				);
			});

			/*
			 * Closing statement.
			 */
			const outro = root.querySelector(`[data-outro]`);
			const outroTrigger = gsap.from(outro, {
				y: 56,
				opacity: 0,
				scale: 0.98,
				duration: reducedMotion ? 0.01 : 1,
				ease: "expo.out",
				scrollTrigger: {
					trigger: outro,
					start: "top 82%",
					toggleActions: "play none none reverse",
				},
			});

			return () => {
				outroTrigger?.scrollTrigger?.kill();
				outroTrigger?.kill();
				ScrollTrigger.getAll().forEach((trigger) => {
					if (root.contains(trigger.trigger)) trigger.kill();
				});
			};
		},
		{
			scope: rootRef,
		}
	);

	return (
		<section ref={rootRef} className="relative w-full bg-[#050505]">
			{/* ambient glow */}
			<span
				aria-hidden="true"
				className="pointer-events-none absolute left-1/2 top-0 z-0 h-[min(760px,80vw)] w-[min(760px,80vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_65%)]"
			/>

			{/* HERO */}
			<div className="relative z-1 w-full px-[clamp(24px,7vw,120px)] pt-[clamp(96px,12vw,180px)]">
				<div className="mx-auto grid w-full max-w-[72rem] gap-[clamp(32px,4vw,56px)]">
					<SectionTitle title="Performance Business Coaching" />

					<div className="grid gap-7">
						<h3
							data-reveal=""
							className="m-0 max-w-22ch text-[clamp(1.7rem,1.2rem+2.2vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-slate-50">
							Transforming Entrepreneurs From{" "}
							<span className="text-slate-500">Potential</span> to{" "}
							<span className="bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
								Performance
							</span>
						</h3>

						<p
							data-reveal=""
							className="m-0 max-w-56ch text-sm font-bold uppercase tracking-[0.1em] leading-relaxed text-slate-300">
							Build the clarity, confidence, strategy, and
							execution needed to take your business to the next
							level.
						</p>

						<div
							data-reveal=""
							className="grid max-w-62ch gap-5 text-[clamp(0.95rem,0.85rem+0.35vw,1.15rem)] leading-[1.7] text-slate-400">
							<p className="m-0">
								Casac Benjali&apos;s{" "}
								<strong className="font-semibold text-slate-50">
									Performance Business Coaching
								</strong>{" "}
								is designed for entrepreneurs, business owners,
								and professionals who want to move beyond
								challenges, improve their performance, and
								achieve sustainable business growth.
							</p>
							<p className="m-0">
								With extensive experience in{" "}
								<strong className="font-semibold text-slate-50">
									business consulting, entrepreneurship,
									leadership, sales, and performance coaching
								</strong>
								, Casac Benjali combines practical business
								experience with structured coaching to help
								individuals think strategically, make better
								decisions, and turn their goals into meaningful
								action.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* TRANSFORMATION SEQUENCE */}
			<div
				data-transformation=""
				className="relative z-1 mt-[clamp(72px,9vw,140px)] px-[clamp(24px,7vw,120px)]">
				<div className="mx-auto grid w-full max-w-[72rem] gap-8">
					<p
						data-reveal=""
						className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
						From Where You Are to Where You Want to Be
					</p>

					<div className="flex flex-wrap items-baseline gap-x-[clamp(16px,3vw,40px)] gap-y-3">
						{TRANSFORMATION.map((word, i) => (
							<span
								key={word}
								className="inline-flex items-baseline gap-[clamp(16px,3vw,40px)]">
								<span
									data-word=""
									className="text-[clamp(1.6rem,1rem+2.6vw,4rem)] font-extrabold leading-none tracking-[-0.04em] text-slate-500">
									{word}
								</span>
								{i < TRANSFORMATION.length - 1 ? (
									<span
										aria-hidden="true"
										className="text-[clamp(1rem,0.7rem+1.4vw,2rem)] font-bold text-slate-700">
										→
									</span>
								) : null}
							</span>
						))}
					</div>

					<p
						data-reveal=""
						className="m-0 max-w-64ch leading-[1.7] text-slate-400">
						Every entrepreneur reaches a point where working harder
						is no longer enough. Business growth requires the right{" "}
						<strong className="font-semibold text-slate-50">
							mindset, strategy, leadership, systems, execution,
							and performance
						</strong>
						. Performance Business Coaching helps bridge the gap
						between your current position and your desired level of
						personal and business success.
					</p>
				</div>
			</div>

			{/* PILLARS */}
			<div className="relative z-1 mt-[clamp(88px,11vw,160px)] px-[clamp(24px,7vw,120px)]">
				<div className="mx-auto grid w-full max-w-[72rem] gap-[clamp(36px,4vw,56px)]">
					<div data-reveal="" className="grid gap-4">
						<p className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
							What Performance Business Coaching Focuses On
						</p>
						<h4 className="m-0 text-[clamp(1.4rem,1rem+1.6vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-slate-50">
							Nine Pillars. One Objective — Performance.
						</h4>
					</div>

					<ul className="grid">
						{PILLARS.map((pillar) => (
							<li
								data-pillar=""
								key={pillar.num}
								className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-[clamp(18px,3vw,48px)] border-t border-white/8 py-[clamp(22px,3vw,36px)] last:border-b">
								<span
									aria-hidden="true"
									className="text-[clamp(1.4rem,1rem+2vw,3rem)] font-extrabold leading-none tracking-[-0.04em] text-white/15 tabular-nums">
									{pillar.num}
								</span>
								<div className="grid gap-3">
									<h5 className="m-0 text-[clamp(1.15rem,0.95rem+0.9vw,1.8rem)] font-bold leading-tight tracking-[-0.01em] text-slate-50">
										{pillar.title}
									</h5>
									<p className="m-0 max-w-62ch leading-[1.65] text-slate-400">
										{pillar.description}
									</p>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* APPROACH */}
			<div className="relative z-1 mt-[clamp(88px,11vw,160px)] px-[clamp(24px,7vw,120px)]">
				<div
					data-group=""
					className="mx-auto grid w-full max-w-[72rem] gap-[clamp(28px,4vw,48px)]">
					<div data-reveal="" className="grid gap-4">
						<p className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
							A Structured Approach to Business Performance
						</p>
						<h4 className="m-0 max-w-40ch text-[clamp(1.4rem,1rem+1.6vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-slate-50">
							Connecting personal development with business
							performance.
						</h4>
					</div>

					<ul className="grid gap-[clamp(14px,1.6vw,20px)] sm:grid-cols-2 lg:grid-cols-5">
						{APPROACH.map((step) => (
							<li
								data-item=""
								key={step.title}
								className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-md transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06]">
								<h5 className="m-0 text-base font-bold tracking-[-0.01em] text-slate-50">
									{step.title}
								</h5>
								<p className="m-0 text-sm leading-[1.6] text-slate-400">
									{step.description}
								</p>
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* PROGRAMMES */}
			<div className="relative z-1 mt-[clamp(88px,11vw,160px)] px-[clamp(24px,7vw,120px)]">
				<div
					data-group=""
					className="mx-auto grid w-full max-w-[72rem] gap-[clamp(28px,4vw,48px)]">
					<div data-reveal="" className="grid gap-4">
						<p className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
							Coaching Programmes
						</p>
						<h4 className="m-0 text-[clamp(1.4rem,1rem+1.6vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-slate-50">
							Structured Paths to Higher Performance
						</h4>
					</div>

					<ul className="grid gap-[clamp(14px,1.6vw,20px)] sm:grid-cols-2">
						{PROGRAMMES.map((programme, i) => (
							<li
								data-item=""
								key={programme.name}
								className="group relative grid content-between gap-[clamp(40px,6vw,96px)] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-[clamp(26px,3.4vw,44px)] backdrop-blur-md transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.06]">
								<span
									aria-hidden="true"
									className="absolute -right-4 -top-6 select-none text-[clamp(5rem,4rem+6vw,9rem)] font-extrabold leading-none tracking-[-0.06em] text-white/[0.05] transition-colors duration-500 group-hover:text-white/[0.1]">
									{String(i + 1).padStart(2, "0")}
								</span>

								<h5 className="m-0 text-[clamp(1.6rem,1.2rem+1.6vw,2.6rem)] font-extrabold leading-none tracking-[-0.03em] text-slate-50">
									{programme.name}
								</h5>

								<p className="m-0 max-w-48ch text-sm leading-[1.65] text-slate-400 transition-colors duration-500 group-hover:text-slate-300">
									{programme.description}
								</p>
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* AUDIENCE */}
			<div className="relative z-1 mt-[clamp(88px,11vw,160px)] px-[clamp(24px,7vw,120px)]">
				<div
					data-group=""
					className="mx-auto grid w-full max-w-[72rem] gap-[clamp(24px,3vw,40px)]">
					<h4
						data-reveal=""
						className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
						Who Is This Coaching For?
					</h4>

					<ul className="grid gap-6">
						{AUDIENCE.map((entry) => (
							<li
								data-item=""
								key={entry.who}
								className="max-w-64ch border-l-2 border-white/15 pl-6 text-[clamp(1rem,0.9rem+0.4vw,1.25rem)] leading-[1.6] text-slate-400">
								<strong className="font-semibold text-slate-50">
									{entry.who}
								</strong>{" "}
								{entry.why}
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* WHY */}
			<div className="relative z-1 mt-[clamp(88px,11vw,160px)] px-[clamp(24px,7vw,120px)]">
				<div
					data-group=""
					className="mx-auto grid w-full max-w-[72rem] gap-[clamp(28px,4vw,48px)]">
					<h4
						data-reveal=""
						className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
						Why Performance Business Coaching?
					</h4>

					<ul className="grid gap-[clamp(14px,1.6vw,20px)] sm:grid-cols-2 lg:grid-cols-3">
						{REASONS.map((reason) => (
							<li
								data-item=""
								key={reason.title}
								className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-md transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06]">
								<h5 className="m-0 text-base font-bold tracking-[-0.01em] text-slate-50">
									{reason.title}
								</h5>
								<p className="m-0 text-sm leading-[1.6] text-slate-400">
									{reason.description}
								</p>
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* CLOSING + CTA */}
			<div className="relative z-1 w-full px-[clamp(24px,7vw,120px)] py-[clamp(96px,12vw,180px)]">
				<div
					data-outro=""
					className="mx-auto grid w-full max-w-[72rem] gap-[clamp(28px,4vw,48px)]">
					<div className="grid gap-5">
						<h4 className="m-0 text-[clamp(2rem,1.3rem+3.4vw,4.8rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-slate-50">
							Better Thinking.
							<br />
							Better Decisions.
							<br />
							<span className="bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
								Better Performance.
							</span>
						</h4>

						<h5 className="m-0 text-[clamp(1.1rem,0.9rem+1vw,1.8rem)] font-bold leading-tight tracking-[-0.01em] text-slate-400">
							Your Next Level Starts With the Right Direction.
						</h5>

						<p className="m-0 max-w-64ch leading-[1.7] text-slate-400">
							Whether you are building a new business, navigating
							a growth challenge, strengthening your leadership,
							improving performance, or preparing your
							organisation for the next stage, Performance
							Business Coaching provides a structured path towards
							greater clarity, capability, and execution.
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-x-8 gap-y-4">
						{[
							{
								label: "Enquire About Performance Business Coaching",
								href: "/contact",
							},
							{
								label: "Explore Coaching Programmes",
								href: "/programmes",
							},
							{ label: "Book a Consultation", href: "/contact" },
						].map((link) => (
							<a
								key={link.label}
								href={link.href}
								className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-50 transition-colors duration-300 hover:text-white">
								<span className="border-b border-white/25 pb-1 transition-colors duration-300 group-hover:border-white/70">
									{link.label}
								</span>
								<span
									aria-hidden="true"
									className="inline-block transition-transform duration-300 group-hover:translate-x-1">
									→
								</span>
							</a>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default PerformanceBusinessCoaching;
