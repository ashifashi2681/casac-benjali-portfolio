import React from "react";
import SectionTitle from "../ui/SectionTitle/SectionTitle";
import GlassButton from "../ui/GlassButton/GlassButton";

function Hero() {
	return (
		<div className="mt-40">
			<SectionTitle title="hero" />

            
            <GlassButton>WORK WITH ME</GlassButton>

            <GlassButton>EXPLORE</GlassButton>
		</div>
	);
}

export default Hero;
