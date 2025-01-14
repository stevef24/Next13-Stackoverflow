import Filters from "@/components/shared/Filters";
import LocalSearchBar from "@/components/shared/LocalSearchBar";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/ui/PaginationSearch";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tags.action";
import { capitalizeFirstLetter } from "@/lib/utils";
import { SearchParamsProps } from "@/types";
import Link from "next/link";

const Page = async ({ searchParams }: SearchParamsProps) => {
	const result = await getAllTags({
		searchQuery: searchParams.q,
		filter: searchParams.filter?.toLowerCase(),
		page: searchParams.page ? +searchParams.page : 1,
	});

	return (
		<>
			<h1 className="h1-bold text-dark100_light900">All Tags</h1>

			<div className="mt-11  justify-between gap-5 max-w-sm:flex-col  md:flex sm:items-center ">
				<LocalSearchBar
					route="/tags"
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search for questions"
					otherClasses="flex-1"
				/>
				<Filters
					filters={TagFilters}
					otherClasses="mt-2 md:mt-0 min-h-[56px] sm:min-w-[170px]"
					containerClasses=" max-md:flex"
				/>
			</div>

			<section className="mt-12 flex flex-wrap gap-4">
				{result.tags.length > 0 ? (
					result.tags.map((tag) => (
						<Link
							href={`/tags/${tag._id}`}
							key={tag._id}
							className="shadow-light100_darknone"
						>
							<div className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
								<div className="background-light800_dark400 w-fit rounded-lg  px-5 py-1.5 ">
									<p className="paragraph-semibold text-dark300_light900">
										{capitalizeFirstLetter(tag.name)}
									</p>
								</div>

								<p className="small-medium text-dark400_light500 mt-3.5">
									<span className="body-semibold primary-text-gradient mr-2.5">
										{tag.questions.length}+
									</span>{" "}
									Questions
								</p>
							</div>
						</Link>
					))
				) : (
					<NoResult
						title="No Tags Found"
						link="/ask-question"
						buttonTitle="Ask a question"
					/>
				)}
			</section>
			<div className="mt-10">
				<Pagination
					pageNumber={searchParams?.page ? +searchParams.page : 1}
					isNextPage={result?.isNextPage || false}
				/>
			</div>
		</>
	);
};

export default Page;
