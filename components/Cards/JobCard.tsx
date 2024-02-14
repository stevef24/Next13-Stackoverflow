import { capitalizeFirstLetter } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const JobCard = ({ results }: any) => {
	return (
		<div className="card-wrapper rounded-[10px] p-8 sm:px-11 flex text-">
			<div className="w-1/8 ">
				<div className="w-16 background-light800_dark400 text-dark400_light500 h-16 rounded-md flex justify-center items-center ">
					<Image
						src={
							results.employer_logo
								? results.employer_logo
								: "/assets/images/default-logo.svg"
						}
						alt={"employer logo"}
						width={64}
						height={64}
						className="rounded-xl"
					/>
				</div>
			</div>
			<div className="pl-6 w-7/8 flex flex-col ">
				<div className="flex justify-between items-center mb-2">
					<div className="flex justify-center items-center text-dark200_light900">
						<div className="flex font-semibold">{results.job_title}</div>
						<div className="px-3">
							{results.job_is_remote && (
								<span className="px-3.5 py-2  text-[10px] uppercase rounded-md background-light800_dark400 light:bg-light-800  text-light-500 flex justify-center items-center">
									REMOTE
								</span>
							)}
						</div>
					</div>
					<div className="flex items-center">
						<div className="ml-10 text-dark500_light700">
							<span className="flex justify-center items-center gap-1 background-light800_dark400 rounded-full px-2 text-sm">
								<Image
									src={"/assets/icons/location.svg"}
									alt={"location icon"}
									height={16}
									width={16}
								/>
								{`${results.job_country}`}
							</span>
						</div>
					</div>
				</div>
				<div className="text-sm mb-5 text-dark500_light700">
					{`${results.job_description.slice(0, 220)} ...`}
				</div>
				<div className="flex justify-between items-center">
					<div className="text-light-400 flex text-sm gap-6">
						<div className="flex justify-center items-center gap-1 text-light-400">
							<Image
								src={"/assets/icons/suitcase.svg"}
								alt={"suitcase icon"}
								width={14}
								height={14}
								className="text-light-400"
							/>
							<span>{capitalizeFirstLetter(results.job_employment_type)}</span>
						</div>
						<div className="flex justify-center items-center gap-1">
							<Image
								src={"/assets/icons/currency-dollar-circle.svg"}
								alt={"curreny icon"}
								height={16}
								width={16}
							/>
							<span>
								{results.job_min_salary
									? `$${results.job_min_salary},000-$${results.job_max_salary},000`
									: "Not disclosed"}
							</span>
						</div>
					</div>

					<div className="primary-text-gradient  gap-1 text-sm">
						<Link
							href={results.job_apply_link}
							className="flex items-center justify-center"
							target="_blank"
						>
							<span>View job</span>
							<Image
								src={"/assets/icons/arrow-up-right.svg"}
								alt={"curreny icon"}
								height={18}
								width={18}
							/>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default JobCard;
