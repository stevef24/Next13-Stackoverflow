import Link from "next/link";
import Image from "next/image";
import RenderTags from "./RenderTags";

const RightSidebar = () => {
	const popularQuestions = [
		{
			id: "1",
			title:
				"Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
		},
		{
			id: "2",
			title: "what are the updates for the new version of Next.js?",
		},
		{
			id: "3",
			title: "how to use the new Next.js Image component?",
		},
		{
			id: "4",
			title: "Typescript type error in Next.js project",
		},
		{
			id: "5",
			title: "render a component on top of another component in Next.js",
		},
	];

	const popularTags = [
		{
			id: "1",
			name: "Next.js",
			questions: 37,
		},
		{
			id: "2",
			name: "React",
			questions: 34,
		},
		{
			id: "3",
			name: "Javascript",
			questions: 25,
		},
		{
			id: "4",
			name: "AI",
			questions: 24,
		},
		{
			id: "5",
			name: "Typescript",
			questions: 20,
		},
	];

	return (
		<section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
			<div>
				<h3 className="h3-bold text-dark200_light900">Popular Questions</h3>
				<div>
					{popularQuestions.map(({ id, title }) => (
						<Link
							key={id}
							href={""}
							className="mt-7 flex cursor-pointer items-center justify-between gap-7"
						>
							<p className="body-medium text-dark500_light700">{title}</p>
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
					{popularTags.map(({ id, name, questions }) => (
						<RenderTags
							key={id}
							id={id}
							name={name}
							questions={questions}
							showCount={true}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default RightSidebar;
