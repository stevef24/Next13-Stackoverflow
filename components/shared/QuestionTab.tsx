import { getUserQuestions } from "@/lib/actions/user.action";
import QuestionCard from "../Cards/QuestionCard";
import { SearchParamsProps } from "@/types";

interface Props extends SearchParamsProps {
	userId: string;
	clerkId: string | null;
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
	const userQuestion = await getUserQuestions({ userId });
	return (
		<>
			{userQuestion.questions.map((question) => (
				<QuestionCard
					key={question._id}
					_id={question._id}
					clerkId={clerkId}
					title={question.title}
					tags={question.tags}
					upvotes={question.upvotes}
					author={question.author}
					views={question.views}
					answers={question.answers}
					createdAt={question.createdAt}
				/>
			))}
		</>
	);
};

export default QuestionTab;
