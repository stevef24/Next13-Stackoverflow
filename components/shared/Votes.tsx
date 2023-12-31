"use client";

import { formatNumber } from "@/lib/utils";
import Image from "next/image";

interface Props {
	type: string;
	itemId: string;
	userId: string;
	upVotes: number;
	hasUpVoted: boolean;
	downVotes: number;
	hasDownVoted: boolean;
	hasSaved: boolean;
}

const Votes = ({
	type,
	itemId,
	userId,
	upVotes,
	hasUpVoted,
	downVotes,
	hasDownVoted,
	hasSaved,
}: Props) => {
	const handleSave = async () => {};
	const handleVote = async (action: string) => {};
	return (
		<div className="flex gap-5">
			<div className="flex-center gap-2.5">
				<div className="flex-center gap-1.5">
					<Image
						src={
							hasUpVoted
								? "/assets/icons/upvoted.svg"
								: "/assets/icons/upvote.svg"
						}
						alt={"upvote"}
						width={18}
						height={18}
						className="cursor-pointer"
						onClick={() => {}}
					/>
					<div className="flex-center background-light700_dark min-w-[18px]">
						<p className="subtle-medium text-dark400_light900">
							{formatNumber(upVotes)}
						</p>
					</div>
					<Image
						src={
							hasUpVoted
								? "/assets/icons/downvoted.svg"
								: "/assets/icons/downvote.svg"
						}
						alt={"downvote"}
						width={18}
						height={18}
						className="cursor-pointer"
						onClick={handleVote}
					/>
					<div className="flex-center background-light700_dark min-w-[18px]">
						<p className="subtle-medium text-dark400_light900">
							{formatNumber(downVotes)}
						</p>
					</div>
				</div>
			</div>
			<Image
				src={
					hasSaved
						? "/assets/icons/star-filled.svg"
						: "/assets/icons/star-red.svg"
				}
				alt={"alt"}
				width={18}
				height={18}
				className="cursor-pointer"
				onClick={handleSave}
			/>
		</div>
	);
};

export default Votes;
