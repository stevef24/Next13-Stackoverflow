"use client";

import { formUrlQuery } from "@/lib/utils";
import { Button } from "./button";
import { useSearchParams, useRouter } from "next/navigation";

interface PaginationProps {
	pageNumber: number;
	isNextPage: boolean;
}

const Pagination = ({ pageNumber, isNextPage }: PaginationProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	function handleNavigation(direction: string): void {
		const nextPageNumber =
			direction === "prev" ? pageNumber - 1 : pageNumber + 1;

		const newUrl = formUrlQuery({
			params: searchParams.toString(),
			key: "page",
			value: nextPageNumber.toString(),
		});

		router.push(newUrl);
	}

	return (
		<div className="flex w-full items-center justify-center gap-2">
			<Button
				disabled={pageNumber === 1}
				onClick={() => handleNavigation("prev")}
				className="light-border-2 btn border flex min-h-[36px] items-center justify-center gap-2
        text-dark200_light900
        "
			>
				<p className="body-medium text-dark200_light800">Prev</p>
			</Button>
			<div className="bg-primary-500 flex items-center justify-center rounded-md  px-3.5 py-2">
				<p className="body-semibold text-light-900">{pageNumber}</p>
			</div>
			<Button
				disabled={!isNextPage}
				onClick={() => handleNavigation("next")}
				className="light-border-2 btn border flex min-h-[36px] items-center justify-center gap-2
        text-dark200_light900
        "
			>
				<p className="body-medium text-dark200_light800">Next</p>
			</Button>
		</div>
	);
};

export default Pagination;
