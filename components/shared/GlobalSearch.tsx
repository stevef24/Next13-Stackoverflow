"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeUrlQueryParams } from "@/lib/utils";
import GlobalSearchResults from "./GlobalSearchResults";

const GlobalSearch = () => {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();

	const query = searchParams.get("global");

	const [search, setSearch] = useState(query || "");
	const [isOpen, setIsOpen] = useState(true);

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (search) {
				const newUrl = formUrlQuery({
					params: searchParams.toString(),
					key: "global",
					value: search,
				});
				router.push(newUrl, { scroll: false });
			} else {
				if (query) {
					const newUrl = removeUrlQueryParams({
						params: searchParams.toString(),
						keysToRemove: ["global", "type"],
					});
					router.push(newUrl, { scroll: false });
				}
			}
		}, 500);
		return () => clearTimeout(delayDebounceFn);
	}, [search, router, pathName, searchParams, query]);
	return (
		<div className="relative w-full max-w-[600px] max-lg:hidden">
			<div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
				<Image
					src="/assets/icons/search.svg"
					alt="search"
					width={24}
					height={24}
				/>
				<Input
					value={search}
					type="text"
					placeholder="search globally"
					className="paragraph-regular no-focus placeholder  shadow-none outline-none background-light800_darkgradient border-none text-dark400_light700"
					onChange={(e) => {
						setSearch(e.target.value);
						if (!isOpen) setIsOpen(true);
						if (e.target.value === "" && isOpen) setIsOpen(false);
					}}
				/>
			</div>
			{isOpen && <GlobalSearchResults />}
		</div>
	);
};

export default GlobalSearch;
