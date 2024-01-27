import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
const Loading = () => {
	return (
		<section>
			<div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="h10bold text-dark100_light900">All Questions</h1>
				<Link href="/ask-questions" className="flex justify-end max-sm:w-full">
					<Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
						Ask a question
					</Button>
				</Link>
			</div>
			<div className="mb-12 mt-11 flex flex-wrap items-center justify-between gap-5">
				<Skeleton className="h-14 flex-1" />
				<Skeleton className="h-14 md:w-28 w-full" />
			</div>
			<div className="my-10 hidden gap-6 md:flex">
				<Skeleton className="h-9 w-full" />
			</div>
			<div className="flex flex-col gap-6">
				{Array(10)
					.fill(Math.random())
					.map((item) => (
						<Skeleton key={item} className="h-48 w-full rounded-xl" />
					))}
			</div>
		</section>
	);
};

export default Loading;
