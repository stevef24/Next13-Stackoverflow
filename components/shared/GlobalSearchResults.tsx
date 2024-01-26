"use client";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalFilters from "./GlobalFilters";
import { globalSearch } from "@/lib/actions/general.action";

const GlobalSearchResults = () => {
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [results, setResults] = useState([
		{ type: "question", id: 1, title: "next.js" },
		{ type: "tag", id: 1, title: "Nextjs" },
		{ type: "user", id: 1, title: "stav" },
	]);

	const global = searchParams.get("global");
	const type = searchParams.get("type");

	useEffect(() => {
		const fetchResults = async () => {
			setResults([]);
			setIsLoading(true);
			try {
				const res = await globalSearch({ query: global, type: type });

				setResults(JSON.parse(res));
			} catch (err) {
				console.log(err);
				throw new Error();
			} finally {
				setIsLoading(false);
			}
		};

		if (global) {
			fetchResults();
		}
	}, [global, type]);

	const renderLink = (type: string, id: string) => {
		switch (type) {
			case "question":
				return `/question/${id}`;
			case "tag":
				return `/tags/${id}`;
			case "user":
				return `/profile/${id}`;
			case "answer":
				return `/question/${id}`;
			default:
				return "/";
		}
	};

	return (
		<div className="absolute top-full z-10 mt-3 w-full bg-light-800 py-5 shadow-sm dark:bg-dark-400 rounded-xl">
			<GlobalFilters />
			<div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50 " />
			<div className="space-y-5">
				<p className="text-dark400_light900 paragraph-semibold px-5">
					Top match
				</p>

				{isLoading ? (
					<div className="flex-center flex-col px-5">
						<ReloadIcon className="my-2 h-10 w-10 text-primary-500 animate-spin" />
						<p className="text-dark200_light800 body-regular">
							Searching the entire database
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{results.length > 0 ? (
							results.map((item: any, index: number) => {
								return (
									<Link
										href={renderLink(item.type, item.id)}
										key={item.type + item.id + index}
										className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50 "
									>
										<Image
											src="/assets/icons/tag.svg"
											alt="tags"
											width={18}
											height={18}
											className="invert-colors mt-1 object-contain"
										/>
										<div className="flex flex-col">
											<p className="body-medium text-dark200_light800 line-clamp-1">
												{item.title}
											</p>
											<p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
												{item.type}
											</p>
										</div>
									</Link>
								);
							})
						) : (
							<div className="flex-center flex-col">
								<p>No results found</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default GlobalSearchResults;
