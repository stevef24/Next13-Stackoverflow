import QuestionCard, { QuestionProps } from "@/components/Cards/QuestionCard";
import Filters from "@/components/shared/Filters";
import LocalSearchBar from "@/components/shared/LocalSearchBar";
import NoResult from "@/components/shared/NoResult";
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
	});
	return (
		<>
			<div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="h1-bold text-dark100_light900">Saved Questions </h1>
			</div>
			<div className="mt-11 flex  justify-betweeen gap-5 flex-col sm:items-center">
				<LocalSearchBar
					route="/"
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search for questions"
					otherClasses="flex-1"
				/>
				<Filters
					filters={QuestionFilters}
					otherClasses="min-h-[56px] sm:min-w-[170px]"
					containerClasses="hidden max-md:flex"
				/>
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
			</div>
		</>
	);
}
