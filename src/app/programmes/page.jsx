import BharatClub from "@/components/Programmes/BharatClub";
import BusinessCoach from "@/components/Programmes/BusinessCoach";
import Consulting from "@/components/Programmes/Consulting";
import CorporateTraining from "@/components/Programmes/CorporateTraining";
import EntrepreneurCoach from "@/components/Programmes/EntrepreneurCoach";
import FindProgramme from "@/components/Programmes/FindProgramme";
import LeadershipCoach from "@/components/Programmes/LeadershipCoach";
import LeadX from "@/components/Programmes/LeadX";
import MalayaliClub from "@/components/Programmes/MalayaliClub";
import MillionDollarSalesman from "@/components/Programmes/MillionDollarSalesman";
import MondayClub from "@/components/Programmes/MondayClub";
import Performance from "@/components/Programmes/Performance";
import SalesCoach from "@/components/Programmes/SalesCoach";
import ScaleUpSecret from "@/components/Programmes/ScaleUpSecret";
import React from "react";

function Programmes() {
	return (
		<div className="bg-green-800">
			<Performance />
      <Consulting />
      <BusinessCoach />
      <SalesCoach />
      <LeadershipCoach />
      <EntrepreneurCoach />
      <MillionDollarSalesman />
      <LeadX />
      <MondayClub />
      <MalayaliClub />
      <BharatClub />
      <ScaleUpSecret />
      <CorporateTraining />
      <FindProgramme />
		</div>
	);
}

export default Programmes;
