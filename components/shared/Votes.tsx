"use client";

import { downVoteAnswer, upVoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestions } from "@/lib/actions/interaction.action";
import {
	downVoteQuestion,
	upVoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "../ui/use-toast";

interface Props {
	type: string;
	itemId: string;
	userId: string;
	upVotes: number;
	hasupVoted: boolean;
	downVotes: number;
	hasdownVoted: boolean;
	hasSaved?: boolean;
}

const Votes = ({
	type,
	itemId,
	userId,
	upVotes,
	hasupVoted,
	downVotes,
	hasdownVoted,
	hasSaved,
}: Props) => {
	const path = usePathname();
	const router = useRouter();
	const handleSave = async () => {
		toggleSaveQuestion({
			userId: JSON.parse(userId),
			questionId: JSON.parse(itemId),
			path: path,
		});
	};

	const handleVote = async (action: string) => {
		if (!userId) {
			return toast({
				title: "please log in",
				description: "You need to be logged in to vote",
			});
		}

		if (action === "upvote") {
			if (type === "Question") {
				await upVoteQuestion({
					questionId: JSON.parse(itemId),
					userId: JSON.parse(userId),
					hasupVoted,
					hasdownVoted,
					path: path,
				});
			} else if (type === "Answer") {
				await upVoteAnswer({
					answerId: JSON.parse(itemId),
					userId: JSON.parse(userId),
					hasupVoted,
					hasdownVoted,
					path,
				});
			}
			return toast({
				title: `Upvote ${!hasupVoted ? "Successfull" : "removed"}`,
				variant: !hasupVoted ? "default" : "destructive",
			});
		}
		if (action === "downvote") {
			if (type === "Question") {
				await downVoteQuestion({
					questionId: JSON.parse(itemId),
					userId: JSON.parse(userId),
					hasupVoted,
					hasdownVoted,
					path,
				});
			} else if (type === "Answer") {
				await downVoteAnswer({
					answerId: JSON.parse(itemId),
					userId: JSON.parse(userId),
					hasupVoted,
					hasdownVoted,
					path,
				});
			}
			return toast({
				title: `DownVote ${!hasupVoted ? "Successfull" : "removed"}`,
				variant: !hasupVoted ? "default" : "destructive",
			});
		}
	};

	useEffect(() => {
		viewQuestions({
			questionId: JSON.parse(itemId),
			userId: userId ? JSON.parse(userId) : undefined,
		});
	}, [itemId, userId, path, router]);

	return (
		<div className="flex gap-5">
			<div className="flex-center gap-2.5">
				<div className="flex-center gap-1.5">
					<Image
						src={
							hasupVoted
								? "/assets/icons/upvoted.svg"
								: "/assets/icons/upvote.svg"
						}
						alt={"upvote"}
						width={18}
						height={18}
						className="cursor-pointer"
						onClick={() => handleVote("upvote")}
					/>
					<div className="flex-center background-light700_dark min-w-[18px]">
						<p className="subtle-medium text-dark400_light900">
							{formatNumber(upVotes)}
						</p>
					</div>
					<Image
						src={
							hasdownVoted
								? "/assets/icons/downvoted.svg"
								: "/assets/icons/downvote.svg"
						}
						alt={"downvote"}
						width={18}
						height={18}
						className="cursor-pointer"
						onClick={() => handleVote("downvote")}
					/>
					<div className="flex-center background-light700_dark min-w-[18px]">
						<p className="subtle-medium text-dark400_light900">
							{formatNumber(downVotes)}
						</p>
					</div>
				</div>
			</div>
			{type === "Question" && (
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
			)}
		</div>
	);
};

export default Votes;
