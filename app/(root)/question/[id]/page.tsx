import { getQuestionByID } from "@/lib/actions/question.action";
import Link from "next/link";
import Image from "next/image";
import Metric from "@/components/shared/Metric";
import { formatNumber, getTimestamp } from "@/lib/utils";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTags from "@/components/shared/RenderTags";
import Answers from "@/components/Forms/Answers";

const Page = async ({ params, searchParams }: any) => {
	const result = await getQuestionByID({ questionId: params.id });
	return (
		<>
			<div className="flex-start w-full flex-col">
				<div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
					<Link
						href={`/profile/${result.author.clerkId}`}
						className="flex items-center justify-start gap-1"
					>
						<Image
							src={result.author.picture}
							alt={"profile"}
							className="rounded-full"
							width={22}
							height={22}
						/>
						<p className="paragraph-semibold text-dark300_light700">
							{result.author.name}
						</p>
					</Link>
					<div className="flex justify-end">VOTING</div>
				</div>
				<h2 className="h2-semibold text-dark200_light900 nt-3.5 w-full text-left">
					{result.title}
				</h2>
			</div>
			<div className="mb-8 mt-5 flex flex-wrap gap-4">
				<Metric
					imgUrl="/assets/icons/clock.svg"
					alt="upvotes"
					value={` asked${getTimestamp(result.createdAt)}`}
					title=" Asked"
					textStyles="small-medium text-dark400_light800"
				/>
				<Metric
					imgUrl="/assets/icons/message.svg"
					alt="message"
					value={formatNumber(result.answers.length)}
					title=" Answers"
					textStyles="small-medium text-dark400_light800"
				/>
				<Metric
					imgUrl="/assets/icons/eye.svg"
					alt="eye"
					value={formatNumber(result.views)}
					title=" views"
					textStyles="small-medium text-dark400_light800"
				/>
			</div>
			<div className="text-dark300_light700">
				<ParseHTML data={result.content} />
			</div>
			<div>
				{result.tags.map((tag) => (
					<RenderTags
						key={tag._id}
						id={tag._id}
						name={tag.name}
						showCount={false}
					/>
				))}
			</div>
			<Answers></Answers>
		</>
	);
};

export default Page;
