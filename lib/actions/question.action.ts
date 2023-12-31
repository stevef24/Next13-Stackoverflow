"use server";

import QuestionModel from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import TagModel from "@/database/tag.model";
import {
	CreateQuestionParams,
	GetQuestionByIdParams,
	GetQuestionsParams,
	QuestionVoteParams,
} from "./shared.types";
import UserModel from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
	try {
		connectToDatabase();

		const questions = await QuestionModel.find({})
			.populate({
				path: "tags",
				model: TagModel,
			})
			.populate({ path: "author", model: UserModel });

		return { questions };
	} catch (error) {
		console.log(error);
	}
}

export async function createQuestion(params: CreateQuestionParams) {
	try {
		connectToDatabase();

		// getting all the data from the params object that was passed in
		const { title, content, tags, author, path } = params;

		// create the question from the model
		const question = await QuestionModel.create({
			title,
			content,
			author,
		});

		const tagDocuments = [];
		// create tags or get the existing ones
		for (const tag of tags) {
			const existingTag = await TagModel.findOneAndUpdate(
				{
					name: { $regex: new RegExp(`^${tag}$`, "i") },
				},
				{ $setOnInsert: { name: tag }, $push: { question: question._id } },
				{ upsert: true, new: true }
			);

			tagDocuments.push(existingTag._id);
		}

		await QuestionModel.findByIdAndUpdate(question._id, {
			$push: { tags: { $each: tagDocuments } },
		});

		// create an interaction record for the user ask question action

		// increment author reputation by +5 points for creating a question

		revalidatePath(path);
	} catch (error) {
		console.log(error);
	}
}

export async function getQuestionByID(params: GetQuestionByIdParams) {
	try {
		connectToDatabase();
		const { questionId } = params;

		const question = await QuestionModel.findById(questionId)
			.populate({
				path: "tags",
				model: TagModel,
				select: "_id name",
			})
			.populate({
				path: "author",
				model: UserModel,
				select: "_id clerkId name picture",
			});

		return question;
	} catch (error) {
		throw new Error("Could not find question with that ID");
	}
}

export async function upVoteQuestion(params: QuestionVoteParams) {
	try {
		connectToDatabase();

		const { questionId, userId, hasdownVoted, hasupVoted, path } = params;

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

		const question = await QuestionModel.findByIdAndUpdate(
			questionId,
			updateQuery,
			{ new: true }
		);

		if (!question) {
			throw new Error("Could not find question with that ID");
		}

		//increment author reputation
		revalidatePath(path);
	} catch {
		throw new Error("Could not find question with that ID");
	}
}
export async function downVoteQuestion(params: QuestionVoteParams) {
	try {
		connectToDatabase();

		const { questionId, userId, hasdownVoted, hasupVoted, path } = params;

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

		const question = await QuestionModel.findByIdAndUpdate(
			questionId,
			updateQuery,
			{ new: true }
		);

		if (!question) {
			throw new Error("Could not find question with that ID");
		}

		revalidatePath(path);
		//increment author reputation
	} catch {
		throw new Error("Could not find question with that ID");
	}
}
