import { AnswerFilters } from "@/constants/filters";
import Filters from "./Filters";
import { getAllAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import Pagination from "../ui/PaginationSearch";

interface Props {
	questionId: string;
	userId: string;
	totalAnswers: number;
	page?: number;
	filter?: string;
}

const AllAnswers = async ({
	questionId,
	userId,
	totalAnswers,
	page,
	filter,
}: Props) => {
	const result = await getAllAnswers({
		questionId,
		sortBy: filter,
		page: page ? +page : 1,
	});

	return (
		<div className="my-4">
			<div className="flex items-center justify-between ">
				<h3 className="primary-text-gradient">
					{totalAnswers} {totalAnswers > 1 ? "answers" : "answer"}
				</h3>

				<Filters filters={AnswerFilters} />
			</div>
			<div>
				{result.answers.map((answer) => (
					<div key={answer._id} className="light-border border-b py-10">
						<div className="flex items-center justify-between">
							<div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2 ">
								<Link
									href={`/profile/${answer.author.clerkId}`}
									className="flex flex-1 items-start gap-1 sm:item-center"
								>
									<Image
										src={answer.author.picture}
										width={18}
										height={18}
										alt={"profile"}
										className="rounded-full object-cover max-sm:mt-0.5"
									/>
									<div className="flex flex-col sm:flex-row sm:items-center">
										<p className="body-semibold text-dark300_light700">
											{answer.author.name}
										</p>
										<p className="small-regular text-light400_light500 mt-0.5 line-clamp-1">
											<span className="max-sm:hidden ml-1"> - </span>
											answered {getTimestamp(answer.createdAt)}
										</p>
									</div>
								</Link>
							</div>
							<div className="flex justify-end">
								<Votes
									type="Answer"
									itemId={JSON.stringify(answer._id)}
									userId={JSON.stringify(userId)}
									upVotes={answer.upvotes.length}
									hasupVoted={answer.upvotes.includes(userId)}
									downVotes={answer.downvotes.length}
									hasdownVoted={answer.downvotes.includes(userId)}
								/>
							</div>
						</div>
						<ParseHTML data={answer.content} />
					</div>
				))}
			</div>
			<div className="mt-10 w-full">
				<Pagination
					pageNumber={page ? +page : 1}
					isNextPage={result?.isNextPage || false}
				/>
			</div>
		</div>
	);
};

export default AllAnswers;
