"use client";
import { AnswerFilter } from "@/constants/filters";
import { Button } from "../ui/button";
import { useState } from "react";
import React from "react";

type HomeFiltersProps = {
	filters: AnswerFilter[];
};
const HomeFilters = ({ filters }: HomeFiltersProps): JSX.Element => {
	const [isActive, setIsActive] = useState("newest");

	return (
		<div className="md:flex mt-5 justify-center gap-3 hidden flex-wrap">
			{filters.map((item: AnswerFilter) => {
				return (
					<Button
						className={`${
							isActive === item.value
								? "bg-primary-100 text-primary-500 font-bold"
								: "background-light800_dark300 text-dark400_light500"
						}  rounded-lg border-none px-6 py-3`}
						key={item.name}
						onClick={() => setIsActive(item.value)}
					>
						{item.name}
					</Button>
				);
			})}
		</div>
	);
};

export default HomeFilters;
