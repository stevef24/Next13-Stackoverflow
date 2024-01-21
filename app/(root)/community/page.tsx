import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import Link from "next/link";
import LocalSearchBar from "@/components/shared/LocalSearchBar";
import UserCard from "@/components/Cards/UserCard";
import Filters from "@/components/shared/Filters";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/ui/PaginationSearch";

const Page = async ({ searchParams }: SearchParamsProps) => {
	const result = await getAllUsers({
		searchQuery: searchParams.q,
		filter: searchParams.filter?.toLowerCase(),
		page: searchParams.page ? +searchParams.page : 1,
	});

	return (
		<>
			<h1 className="h1-bold text-dark100_light900">All Users</h1>
			<div className="mt-11  justify-between gap-5 max-w-sm:flex-col  md:flex sm:items-center ">
				<LocalSearchBar
					route="/"
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search for questions"
					otherClasses="flex-1"
				/>
				<Filters
					filters={UserFilters}
					otherClasses="mt-2 md:mt-0 min-h-[56px] sm:min-w-[170px]"
					containerClasses=" max-md:flex"
				/>
			</div>
			<div className="mt-12 flex flex-wrap gap-4">
				{result.users.length > 0 ? (
					result.users.map((user) => <UserCard key={user._id} user={user} />)
				) : (
					<div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
						<p>No users yet</p>
						<Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
							Join to be the first!
						</Link>
					</div>
				)}
			</div>
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
