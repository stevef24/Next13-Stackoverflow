import { getQuestionByID } from "@/lib/actions/question.action";
import Link from "next/link";
import Image from "next/image";

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
							className="rounded-full w-22 h-22"
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
			<div></div>
		</>
	);
};

export default Page;
