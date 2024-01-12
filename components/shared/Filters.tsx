"use client";
import { type AnswerFilter } from "@/constants/filters";
import React, { useState } from "react";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

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
	const router = useRouter();
	const searchParams = useSearchParams();

	const query = searchParams.get("filter");
	const [paramFilter, setParamFilter] = useState(query || "");

	const handleUpdateParams = (value: string) => {
		if (paramFilter === value) {
			setParamFilter("");
			const newUrl = formUrlQuery({
				params: searchParams.toString(),
				key: "filter",
				value: null,
			});
			router.push(newUrl, { scroll: false });
		} else {
			setParamFilter(value);
			const newUrl = formUrlQuery({
				params: searchParams.toString(),
				key: "filter",
				value: value.toLowerCase(),
			});
			router.push(newUrl, { scroll: false });
		}
	};

	return (
		<>
			<div className={`relative ${containerClasses}`}>
				<Select
					onValueChange={handleUpdateParams}
					// defaultValue={paramFilter || undefined}
				>
					<SelectTrigger
						className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
					>
						<div className="line-clamp-1 flex-1 text-left">
							<SelectValue placeholder="Select a Filter" />
						</div>
					</SelectTrigger>
					<SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
						<SelectGroup>
							{filters.map((item) => (
								<SelectItem
									key={item.value}
									value={item.value}
									className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
								>
									{item.name}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</>
	);
};

export default Filters;
