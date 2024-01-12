import QuestionCard, { QuestionProps } from "@/components/Cards/QuestionCard";
import LocalSearchBar from "@/components/shared/LocalSearchBar";
import NoResult from "@/components/shared/NoResult";
import { getQuestionsByTagId } from "@/lib/actions/tags.action";
import { capitalizeFirstLetter } from "@/lib/utils";
import { URLProps } from "@/types";

const Page = async ({ params, searchParams }: URLProps) => {
	const results = await getQuestionsByTagId({
		tagId: params.id,
		page: 1,
		searchQuery: searchParams.q,
	});

	return (
		<>
			<div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="h1-bold text-dark100_light900">
					{capitalizeFirstLetter(results.tagTitle)}
				</h1>
			</div>
			<div className="mt-11 w-full">
				<LocalSearchBar
					route={`/tags/${params.id}`}
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search for questions by tag name"
					otherClasses="flex-1"
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
							title="no questions find"
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
};

export default Page;
