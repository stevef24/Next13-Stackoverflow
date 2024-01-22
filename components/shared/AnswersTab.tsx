import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "../Cards/AnswerCard";
import Pagination from "../ui/PaginationSearch";

interface Props extends SearchParamsProps {
	userId: string;
	clerkId: string | null;
}
const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
	const userAnswer = await getUserAnswers({ userId });

	return (
		<>
			{userAnswer.answers.map((answer) => {
				return (
					<AnswerCard
						key={answer.id}
						_id={answer.id}
						question={answer.question}
						author={answer.author}
						upvotes={answer.upvotes}
						createdAt={answer.createdAt}
						clerkId={clerkId}
					/>
				);
			})}

			<Pagination
				pageNumber={searchParams?.page ? +searchParams.page : 1}
				isNextPage={userAnswer?.isNextPage || false}
			/>
		</>
	);
};

export default AnswersTab;
