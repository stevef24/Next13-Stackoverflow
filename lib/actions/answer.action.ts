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

export async function createAnswer(params: CreateAnswerParams) {
	try {
		connectToDatabase();

		const { content, author, question, path } = params;

		const newAnswer = await AnswerModel.create({ content, author, question });

		// Add the answer to the question's answers array
		const questionObject = await QuestionModel.findByIdAndUpdate(question, {
			$push: { answers: newAnswer._id },
		});

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getAllAnswers(params: GetAnswersParams) {
	try {
		connectToDatabase();
		const { questionId, sortBy } = params;

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
			.populate("author", "_id clerkId name picture")
			.sort(sortOptions);
		return { answers };
	} catch (error) {
		console.log(error);
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
