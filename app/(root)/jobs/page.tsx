import Filters from "@/components/shared/Filters";
import LocalSearchBar from "@/components/shared/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { CountyFilter } from "@/constants/filters";
import Link from "next/link";
import Image from "next/image";
import { CiImageOn } from "react-icons/ci";
import { BsSuitcaseLg } from "react-icons/bs";
import { CiMoneyBill } from "react-icons/ci";
import { FaExternalLinkAlt } from "react-icons/fa";

const Page = () => {
	const results = {
		image: "",
	};
	return (
		<>
			<div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="h1-bold text-dark100_light900">Jobs</h1>
				<Link href="/ask-questions" className="flex justify-end max-sm:w-full">
					<Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
						Find jobs
					</Button>
				</Link>
			</div>
			<div className="mt-11  justify-between gap-5 max-w-sm:flex-col  md:flex sm:items-center ">
				<LocalSearchBar
					route="/"
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search for Jobs"
					otherClasses="flex-1"
				/>
				<Filters
					filters={CountyFilter}
					otherClasses="mt-2 md:mt-0 min-h-[56px] sm:min-w-[170px]"
					containerClasses=" max-md:flex"
				/>
			</div>
			<div className="mt-10 flex w-full flex-col gap-6">
				{results ? (
					<div className="card-wrapper rounded-[10px] p-8 sm:px-11 flex text-white">
						<div className="w-1/8 ">
							<div className="w-16 bg-dark-400 text-light-500 h-16 rounded-md flex justify-center items-center ">
								{results.image ? (
									<Image src={""} alt={""} height={64} width={64} />
								) : (
									<CiImageOn size={24} />
								)}
							</div>
						</div>
						<div className="pl-6 w-7/8 flex flex-col ">
							<div className="flex justify-between items-center mb-2">
								<div className="flex justify-center items-center">
									<div className="flex font-semibold">
										Principal Salesforce Developer
									</div>
									<div className="px-3">
										<span className="px-3.5 py-2  text-[10px] uppercase rounded-md dark:bg-dark-400 light:bg-light-800  text-light-500 flex justify-center items-center">
											SOFTWARE
										</span>
									</div>
								</div>
								<div className="flex items-center">
									<div className="ml-10">hello</div>
								</div>
							</div>
							<div className="text-sm">
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
								nostrum aliquid cum, natus sapiente maxime nemo neque dolorem
								nisi mollitia!
							</div>
							<div className="flex justify-between items-center">
								<div className="text-light-400 flex text-sm gap-6">
									<div className="flex justify-center items-center gap-1">
										<BsSuitcaseLg />
										<span>Full-time</span>
									</div>
									<div className="flex justify-center items-center gap-1">
										<CiMoneyBill size={20} />
										<span> salary</span>
									</div>
								</div>
								<div className="primary-text-gradient flex items-center justify-center gap-1 text-sm">
									view Job
									<FaExternalLinkAlt />
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="flex justify-center items-center">
						<h2 className="h2-bold text-dark200_light900 my-4">
							Opps! No Jobs found, try another country
						</h2>
					</div>
				)}
			</div>
		</>
	);
};

export default Page;
