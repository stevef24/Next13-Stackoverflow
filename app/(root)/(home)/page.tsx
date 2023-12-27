import QuestionCard from "@/components/Cards/QuestionCard";
import Filters from "@/components/shared/Filters";
import LocalSearchBar from "@/components/shared/LocalSearchBar";
import NoResult from "@/components/shared/NoResult";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getQuestions } from "@/lib/actions/question.action";
import Link from "next/link";

export default async function Home() {
	const results = await getQuestions({});

	return (
		<>
			<div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="h1-bold text-dark100_light900">All Questions </h1>
				<Link href="/ask-questions" className="flex justify-end max-sm:w-full">
					<Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
						Ask a question
					</Button>
				</Link>
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
					filters={HomePageFilters}
					otherClasses="min-h-[56px] sm:min-w-[170px]"
					containerClasses="hidden max-md:flex"
				/>
				<div className="mt-10 flex w-full flex-col gap-6">
					{results!.questions.length > 0 ? (
						results?.questions.map((question) => (
							<QuestionCard
								key={question._id}
								_id={question._id}
								title={question.title}
								tags={question.tags}
								upVotes={question.upVotes}
								author={question.author}
								views={question.views}
								answers={question.answers}
								createdAt={question.createdAt}
							/>
						))
					) : (
						<NoResult
							title={`Be the first to break the silence! 🚀 Ask a Question and kickstart the
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
