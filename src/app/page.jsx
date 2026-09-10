import AboutCasacBenjali from "@/components/home/AboutCasacBenjali";
import Hero from "@/components/home/Hero/Hero";
import ImpactAtAGlance from "@/components/home/ImpactAtAGlance";
import MyExpertise from "@/components/home/MyExpertise";
import PerformanceBusinessCoaching from "@/components/home/PerformanceBusinessCoaching";
import SalesLeadershipCoaching from "@/components/home/SalesLeadershipCoaching";
import SerialEntrepreneur from "@/components/home/SerialEntrepreneur";
import StrategicConsulting from "@/components/home/StrategicConsulting";
import TrustedByBusinesses from "@/components/home/TrustedByBusinesses";
import WhyWorkWithCasacBenjali from "./../components/home/WhyWorkWithCasacBenjali";
import FeaturedProgrammesBooks from "@/components/home/FeaturedProgrammesBooks";
import UnlockYourNextLevel from "@/components/home/UnlockYourNextLevel";

export default function Home() {
	return (
		<div className="bg-amber-800">
			{/* <Hero /> */}
			<ImpactAtAGlance />
			<AboutCasacBenjali />
			<MyExpertise />
			<PerformanceBusinessCoaching />
			<StrategicConsulting />
			<SalesLeadershipCoaching />
			<SerialEntrepreneur />
			<TrustedByBusinesses />
			<WhyWorkWithCasacBenjali />
			<FeaturedProgrammesBooks />
			<UnlockYourNextLevel />
		</div>
	);
}
