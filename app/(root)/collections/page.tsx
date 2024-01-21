import QuestionCard, { QuestionProps } from "@/components/Cards/QuestionCard";
import Filters from "@/components/shared/Filters";
import LocalSearchBar from "@/components/shared/LocalSearchBar";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/ui/PaginationSearch";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";

export default async function Home({ searchParams }: SearchParamsProps) {
	const { userId: clerkId } = auth();

	if (!clerkId) {
		return null;
	}
	const results = await getSavedQuestions({
		clerkId,
		searchQuery: searchParams?.q,
		filter: searchParams?.filter?.toLowerCase(),
		page: searchParams.page ? +searchParams.page : 1,
	});
	return (
		<>
			<div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="h1-bold text-dark100_light900">Saved Questions </h1>
			</div>
			<div className="mt-11  justify-between gap-5 max-w-sm:flex-col  md:flex sm:items-center ">
				<LocalSearchBar
					route="/"
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search for questions"
					otherClasses="flex-1"
				/>
				<Filters
					filters={QuestionFilters}
					otherClasses="mt-2 md:mt-0 min-h-[56px] sm:min-w-[170px]"
					containerClasses=" max-md:flex"
				/>
			</div>
			<div className="mt-10 flex w-full flex-col gap-6">
				{results!.questions.length > 0 ? (
					results?.questions.map((question: QuestionProps) => (
						<QuestionCard
							key={question._id}
							_id={question._id}
							title={question.title}
							tags={question.tags}
							upvotes={question.upvotes}
							author={question.author}
							views={question.views}
							answers={question.answers}
							createdAt={question.createdAt}
						/>
					))
				) : (
					<NoResult
						title="no saved questions to show"
						description={`Be the first to break the silence! 🚀 Ask a Question and kickstart the
				discussion. our query could be the next big thing others learn from. Get
				involved! 💡`}
						link="/ask-questions"
						buttonTitle="Ask a question"
					/>
				)}
			</div>
			<div className="mt-10">
				<Pagination
					pageNumber={searchParams?.page ? +searchParams.page : 1}
					isNextPage={results?.isNext || false}
				/>
			</div>
		</>
	);
}
