import AboutUs from '@/components/About/AboutUs'
import BusinessCoach from '@/components/About/BusinessCoach';
import Consultant from '@/components/About/Consultant';
import Experience from '@/components/About/Experience';
import Journey from '@/components/About/Journey';
import LeadershipCoach from '@/components/About/LeadershipCoach';
import Philosophy from '@/components/About/Philosophy';
import SalesCoach from '@/components/About/SalesCoach';
import SalesStrategy from '@/components/About/SalesStrategy';
import Trainer from '@/components/About/Trainer';
import React from 'react'

function About() {
  return (
		<div className="bg-red-800">
			<AboutUs />
      <Journey />
      <SalesStrategy />
      <Experience />
      <Consultant />
      <BusinessCoach />
      <SalesCoach />
      <LeadershipCoach />
      <Trainer />
      <Philosophy />
		</div>
  );
}

export default About