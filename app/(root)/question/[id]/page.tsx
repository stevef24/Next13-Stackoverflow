import { getQuestionByID } from "@/lib/actions/question.action";
import Link from "next/link";
import Image from "next/image";

const Page = async ({ params, searchParams }) => {
	console.log(searchParams);
	console.log(params);
	const result = await getQuestionByID({ questionId: params.id });

	return (
		<>
			<div className="flex-start w-full flex0-col">
				<div>
					<Link href={`/profile/${result.author.clerkId}`}>
						<Image
							src={result.author.picture}
							alt={"profile"}
							className="rounded-full w-22 h-22"
						/>
					</Link>
				</div>
			</div>
		</>
	);
};

export default Page;
