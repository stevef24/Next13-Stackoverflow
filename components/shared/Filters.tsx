import { type AnswerFilter } from "@/constants/filters";
import React from "react";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import HomeFilters from "../home/HomeFilters";

type FiltersProps = {
	filters: AnswerFilter[];
	otherClasses?: string;
	containerClasses?: string;
};

const Filters = ({
	filters,
	containerClasses,
	otherClasses,
}: FiltersProps): React.JSX.Element => {
	return (
		<>
			<HomeFilters filters={filters} />
			<div className={`relative ${containerClasses} w-full`}>
				<Select>
					<SelectTrigger
						className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
					>
						<div className="line-clamp-1 flex-1 text-left">
							<SelectValue placeholder="Select a filter" />
						</div>
					</SelectTrigger>
					<SelectContent className="text-dark400_light500">
						<SelectGroup>
							<SelectLabel>Filter By</SelectLabel>
							{filters.map((item: AnswerFilter) => {
								return (
									<SelectItem key={item.name} value={item.value}>
										{item.name}
									</SelectItem>
								);
							})}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</>
	);
};

export default Filters;
