"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formUrlQuery, removeUrlQueryParams } from "@/lib/utils";

type LocalSearchBarProps = {
	route: string;
	iconPosition: "left" | "right";
	imgSrc: string;
	placeholder: string;
	otherClasses?: string;
};

const LocalSearchBar = ({
	route,
	iconPosition,
	imgSrc,
	placeholder,
	otherClasses,
}: LocalSearchBarProps) => {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();

	const query = searchParams.get("q");

	const [search, setSearch] = useState(query || "");

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (search) {
				const newUrl = formUrlQuery({
					params: searchParams.toString(),
					key: "q",
					value: search,
				});
				router.push(newUrl, { scroll: false });
			} else {
				if (pathName === route) {
					const newUrl = removeUrlQueryParams({
						params: searchParams.toString(),
						keysToRemove: ["q"],
					});
					router.push(newUrl, { scroll: false });
				}
			}
		}, 500);
		return () => clearTimeout(delayDebounceFn);
	}, [search, route, pathName, searchParams, query, router]);

	return (
		<div className={`relative w-full flex ${otherClasses}`}>
			<div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center  gap-4 rounded-xl px-4">
				{iconPosition === "left" && (
					<Image
						src={imgSrc}
						alt="search icon"
						width={24}
						height={24}
						className="cursor-pointer"
					/>
				)}
				<Input
					type="text"
					placeholder={placeholder}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="paragraph-regular no-focus placeholder  shadow-none outline-none text-dark400_light700 bg-transparent text-dark100_light900 border-none"
				/>
				{iconPosition === "right" && (
					<Image
						src={imgSrc}
						alt="search icon"
						width={24}
						height={24}
						className="cursor-pointer"
					/>
				)}
			</div>
		</div>
	);
};

export default LocalSearchBar;
