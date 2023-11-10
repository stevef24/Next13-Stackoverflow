import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
const NoResult = () => {
	return (
		<div className="mt-10 flex w-full flex-col items-center justify-center">
			<Image
				src={"/assets/images/light-illustration.png"}
				alt={"No result illustration"}
				width={270}
				height={200}
				className="block object-contain dark:hidden"
			/>
			<Image
				src={"/assets/images/dark-illustration.png"}
				alt={"No result illustration"}
				width={270}
				height={200}
				className="hidden object-contain dark:flex"
			/>
			<h2 className="h2-bold text-dark200_light900 my-4">
				Opps! No results found
			</h2>
			<p className="body-regular text-dark500_light700 max-w-md text-center">
				Be the first to break the silence! 🚀 Ask a Question and kickstart the
				discussion. our query could be the next big thing others learn from. Get
				involved! 💡
			</p>

			<Link href={"/"}>
				<Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:light-900">
					Ask a question
				</Button>
			</Link>
		</div>
	);
};

export default NoResult;
