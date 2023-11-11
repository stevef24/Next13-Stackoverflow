import { type Question } from "@/types";
import Link from "next/link";
import RenderTags from "../shared/RenderTags";
import Metric from "../shared/Metric";
import { formatNumber, getTimestamp } from "@/lib/utils";

export default function QuestionCard({
	_id,
	title,
	tags,
	upVotes,
	author,
	views,
	answers,
	createdAt,
}: Question) {
	return (
		<div className="card-wrapper p-9 sm:px-11 rounded-[10px]">
			<div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
				<div>
					<span className="subtle-regular text-dark400_light700 line-clamp-1">
						{getTimestamp(createdAt)}
					</span>
					<Link href={`/question/${_id}`}>
						<h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
							{title}
						</h3>
					</Link>
				</div>
			</div>
			<div className="mt-3.5 flex flex-wrap gap-2">
				{tags.map((tag) => (
					<RenderTags key={tag._id} id={tag._id} name={tag.name} />
				))}
			</div>
			<div className="flex-between mt-6 w-full flex-wrap gap-3">
				<Metric
					imgUrl={"/assets/icons/avatar.svg"}
					alt="user"
					value={author.name}
					title={` - asked ${getTimestamp(createdAt)}`}
					textStyles="small-medium text-dark400_light700"
					href={`/profile/${author._id}`}
					isAuthor
				/>
				<div className="flex gap-2 justify-center items-center">
					<Metric
						imgUrl="/assets/icons/like.svg"
						alt="upvotes"
						value={upVotes}
						title=" Votes"
						textStyles="small-medium text-dark400_light800"
					/>
					<Metric
						imgUrl="/assets/icons/message.svg"
						alt="message"
						value={formatNumber(answers.length)}
						title=" Answers"
						textStyles="small-medium text-dark400_light800"
					/>
					<Metric
						imgUrl="/assets/icons/eye.svg"
						alt="eye"
						value={formatNumber(views)}
						title=" views"
						textStyles="small-medium text-dark400_light800"
					/>
				</div>
			</div>
		</div>
	);
}
