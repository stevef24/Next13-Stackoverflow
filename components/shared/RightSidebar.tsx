import Link from "next/link";
import Image from "next/image";
import RenderTags from "./RenderTags";
import { getTopQuestions } from "@/lib/actions/question.action";
import { Question } from "@/types";
import { getTopTags } from "@/lib/actions/tags.action";

const RightSidebar = async () => {
	const [questions, popularTags] = await Promise.all([
		getTopQuestions(),
		getTopTags(),
	]);

	return (
		<section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
			<div>
				<h3 className="h3-bold text-dark200_light900">Popular Questions</h3>
				<div>
					{questions?.map((question: Question) => (
						<Link
							key={question._id}
							href={`/question/${question._id}`}
							className="mt-7 flex cursor-pointer items-center justify-between gap-7"
						>
							<p className="body-medium text-dark500_light700">
								{question.title}
							</p>
							<Image
								src={"/assets/icons/chevron-right.svg"}
								alt={"arrow-right"}
								width={20}
								height={20}
								className="invert-colors"
							/>
						</Link>
					))}
				</div>
			</div>
			<div className="mt-16">
				<h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
				<div className="mt-7 flex flex-col gap-4">
					{popularTags.map(({ _id, name, questionCount }) => (
						<RenderTags
							key={_id}
							id={_id}
							name={name}
							questions={questionCount}
							showCount
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default RightSidebar;
