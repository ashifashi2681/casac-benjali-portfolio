import BusinessOpportunities from '@/components/Ventures/BusinessOpportunities';
import Entrepreneur from '@/components/Ventures/Entrepreneur';
import EntrepreneurialJourney from '@/components/Ventures/EntrepreneurialJourney';
import Execution from '@/components/Ventures/Execution';
import IndustryVentures from '@/components/Ventures/IndustryVentures';
import Venture from '@/components/Ventures/Venture';
import React from 'react'

function Ventures() {
  return <div className="bg-yellow-800">
    <Entrepreneur />
    <BusinessOpportunities />
    <EntrepreneurialJourney />
    <Venture />
    <IndustryVentures />
    <Execution />
  </div>;
}

export default Ventures