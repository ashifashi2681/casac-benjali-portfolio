import Author from "@/components/ClientsBooks/Author";
import Books from "@/components/ClientsBooks/Books";
import Clients from "@/components/ClientsBooks/Clients";
import Experience from "@/components/ClientsBooks/Experience";
import Impact from "@/components/ClientsBooks/Impact";
import Industries from "@/components/ClientsBooks/Industries";
import PeopleCoached from "@/components/ClientsBooks/PeopleCoached";
import Projects from "@/components/ClientsBooks/Projects";
import Trusted from "@/components/ClientsBooks/Trusted";
import React from "react";

function ClientsBooks() {
	return (
		<div className="bg-purple-800">
			<Trusted />
      <Clients />
      <Industries />
      <Impact />
      <Projects />
      <PeopleCoached />
      <Experience />
      <Author />
      <Books />
		</div>
	);
}

export default ClientsBooks;
