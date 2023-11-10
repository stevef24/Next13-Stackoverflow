import HomeFilters from "@/components/home/HomeFilters";
import QuestionCard from "@/components/home/QuestionCard";
import Filters from "@/components/shared/Filters";
import LocalSearchBar from "@/components/shared/LocalSearchBar";
import NoResult from "@/components/shared/NoResult";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { Question } from "@/types";
import Link from "next/link";

// const questions: Question[] = [
// 	{
// 		_id: "1",
// 		title: "How to use React Query?",
// 		tags: [
// 			{ name: "React", _id: "1" },
// 			{ name: "React Query", _id: "2" },
// 			{ name: "Javascript", _id: "3" },
// 		],
// 		upVotes: 10,
// 		author: "jhon Doe",
// 		views: 100,
// 		answers: 2,
// 		createdAt: new Date(),
// 	},
// 	{
// 		_id: "2",
// 		title: "How to center a div?",
// 		tags: [
// 			{ name: "css", _id: "1" },
// 			{ name: "React", _id: "2" },
// 			{ name: "html", _id: "3" },
// 		],
// 		author: "jhon Doe",
// 		upVotes: 12,
// 		views: 120,
// 		answers: 2,
// 		createdAt: new Date(),
// 	},
// ];

export default function Home() {
	return (
		<>
			<div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="h1-bold text-dark100_light900">All Questions </h1>
				<Link href="/ask-questions" className="flex justify-end max-sm:w-full">
					<Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
						Ask a question
					</Button>
				</Link>
			</div>
			<div className="mt-11 flex  justify-betweeen gap-5 flex-col sm:items-center">
				<LocalSearchBar
					route="/"
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search for questions"
					otherClasses="flex-1"
				/>
				<Filters
					filters={HomePageFilters}
					otherClasses="min-h-[56px] sm:min-w-[170px]"
					containerClasses="hidden max-md:flex"
				/>
				<div className="mt-10 flex w-full flex-col gap-6">
					{/* {questions.length > 0 ? (
						questions.map((question) => <QuestionCard key={question._id} />)
					) : ( */}
					<NoResult />
					{/* )} */}
				</div>
			</div>
		</>
	);
}
