import Filters from "@/components/shared/Filters";
import LocalSearchBar from "@/components/shared/LocalSearchBar";
import { CountyFilter } from "@/constants/filters";
import JobCard from "@/components/Cards/JobCard";
import { getJobsList } from "@/lib/actions/jobs.action";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/ui/PaginationSearch";

const Page = async ({ searchParams }: SearchParamsProps) => {
	const { results, isNextPage } = await getJobsList({
		query: searchParams.q || "developer",
		page: searchParams.page ? +searchParams.page : 1,
	});

	return (
		<>
			<div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="h1-bold text-dark100_light900">Jobs</h1>
			</div>
			<div className="mt-11  justify-between gap-5 max-w-sm:flex-col  md:flex sm:items-center ">
				<LocalSearchBar
					route="/jobs"
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search for Jobs"
					otherClasses="flex-1"
				/>
				<Filters
					filters={CountyFilter}
					otherClasses="mt-2 md:mt-0 min-h-[56px] sm:min-w-[170px]"
					containerClasses=" max-md:flex"
				/>
			</div>
			<div className="mt-10 flex w-full flex-col gap-6">
				{results.data.length > 0 ? (
					results.data.map((result: any) => (
						<JobCard results={result} key={result.job_id} />
					))
				) : (
					<div className="flex justify-center items-center">
						<h2 className="h2-bold text-dark200_light900 my-4">
							Opps! No Jobs found, try another country
						</h2>
					</div>
				)}
			</div>
			<div className="mt-10">
				<Pagination
					pageNumber={searchParams?.page ? +searchParams.page : 1}
					isNextPage={isNextPage}
				/>
			</div>
		</>
	);
};

export default Page;
