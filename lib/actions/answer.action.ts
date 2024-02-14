"use server";

import AnswerModel from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import {
	AnswerVoteParams,
	CreateAnswerParams,
	GetAnswersParams,
	DeleteAnswerParams,
} from "./shared.types";
import QuestionModel from "@/database/question.model";
import { revalidatePath } from "next/cache";
import InteractionModel from "@/database/interaction.model";
import UserModel from "@/database/user.model";

export async function createAnswer(params: CreateAnswerParams) {
	try {
		connectToDatabase();

		const { content, author, question, path } = params;

		const newAnswer = await AnswerModel.create({ content, author, question });

		const questionObject = await QuestionModel.findByIdAndUpdate(question, {
			$push: { answers: newAnswer._id },
		});

		await InteractionModel.create({
			user: author,
			question: question,
			action: "answer",
			answer: newAnswer._id,
			tags: questionObject.tags,
		});

		await UserModel.findByIdAndUpdate(author, {
			$inc: { reputation: 10 },
		});

		revalidatePath(path);
	} catch (error) {
		throw error;
	}
}

export async function getAllAnswers(params: GetAnswersParams) {
	try {
		connectToDatabase();
		const { questionId, sortBy, page = 1, pageSize = 10 } = params;

		const skip = (page - 1) * pageSize;

		let sortOptions = {};

		switch (sortBy) {
			case "highestupvotes":
				sortOptions = { upvotes: -1 };
				break;
			case "lowestupvotes":
				sortOptions = { upvotes: 1 };
				break;
			case "recent":
				sortOptions = { createdAt: -1 };
				break;
			case "oldest":
				sortOptions = { createdAt: 1 };
				break;
			default:
				sortOptions = { createdAt: -1 };
				break;
		}
		const answers = await AnswerModel.find({ question: questionId })
			.skip(skip)
			.limit(pageSize)
			.populate("author", "_id clerkId name picture")
			.sort(sortOptions);

		const totalAnswersCount = await AnswerModel.countDocuments({
			question: questionId,
		});
		const isNextPage = totalAnswersCount > skip + answers.length;
		return { answers, isNextPage };
	} catch (error) {
		throw error;
	}
}
export async function upVoteAnswer(params: AnswerVoteParams) {
	try {
		connectToDatabase();
		const { answerId, userId, hasdownVoted, hasupVoted, path } = params;

		let updateQuery = {};
		if (hasupVoted) {
			updateQuery = {
				$pull: { upvotes: userId },
			};
		} else if (hasdownVoted) {
			updateQuery = {
				$pull: { downvotes: userId },
				$push: { upvotes: userId },
			};
		} else {
			updateQuery = { $addToSet: { upvotes: userId } };
		}

		const Answer = await AnswerModel.findByIdAndUpdate(answerId, updateQuery, {
			new: true,
		});

		if (!Answer) {
			throw new Error("Could not find answer with that ID");
		}

		await UserModel.findByIdAndUpdate(userId, {
			$inc: { reputation: hasupVoted ? -2 : 2 },
		});

		await UserModel.findOneAndUpdate(
			{ _id: Answer.author },
			{
				$inc: { reputation: hasupVoted ? -2 : 2 },
			}
		);

		revalidatePath(path);
	} catch (error) {
		throw new Error("Could not find answer with that ID");
	}
}
export async function downVoteAnswer(params: AnswerVoteParams) {
	try {
		connectToDatabase();
		const { answerId, userId, hasdownVoted, hasupVoted, path } = params;

		let updateQuery = {};
		if (hasdownVoted) {
			updateQuery = {
				$pull: { downvotes: userId },
			};
		} else if (hasupVoted) {
			updateQuery = {
				$pull: { upvotes: userId },
				$push: { downvotes: userId },
			};
		} else {
			updateQuery = { $addToSet: { downvotes: userId } };
		}

		const Answer = await AnswerModel.findByIdAndUpdate(answerId, updateQuery, {
			new: true,
		});

		if (!Answer) {
			throw new Error("Could not find answer with that ID");
		}

		await UserModel.findByIdAndUpdate(userId, {
			$inc: { reputation: hasdownVoted ? -2 : 2 },
		});

		await UserModel.findOneAndUpdate(
			{ _id: Answer.author },
			{
				$inc: { reputation: hasdownVoted ? -2 : 2 },
			}
		);

		revalidatePath(path);
	} catch (error) {
		throw new Error("Could not find answer with that ID");
	}
}

export async function deleteAnswer(params: DeleteAnswerParams) {
	try {
		connectToDatabase();

		const { answerId, path } = params;
		const answer = await AnswerModel.findById(answerId);

		if (!answer) {
			throw new Error("Could not find answer with that ID");
		}

		await AnswerModel.deleteOne({ _id: answerId });
		await QuestionModel.updateMany(
			{ _id: answerId },
			{ $pull: { answers: answerId } }
		);

		revalidatePath(path);
	} catch (error) {
		throw new Error("Could not find answer with that ID");
	}
}
