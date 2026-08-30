import Coaching from "@/components/Contact/Coaching";
import Consulting from "@/components/Contact/Consulting";
import Conversation from "@/components/Contact/Conversation";
import Enquiry from "@/components/Contact/Enquiry";
import Help from "@/components/Contact/Help";
import Sales from "@/components/Contact/Sales";
import Training from "@/components/Contact/Training";
import React from "react";

function Contact() {
	return (
		<div className="bg-pink-800">
			<Conversation />
			<Help />
			<Consulting />
      <Coaching />
      <Sales />
      <Training />
      <Enquiry />
		</div>
	);
}

export default Contact;
