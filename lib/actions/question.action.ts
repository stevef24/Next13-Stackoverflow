"use server";

import QuestionModel from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import TagModel from "@/database/tag.model";
import {
	CreateQuestionParams,
	GetQuestionByIdParams,
	GetQuestionsParams,
	QuestionVoteParams,
	DeleteQuestionParams,
	EditQuestionParams,
} from "./shared.types";
import UserModel from "@/database/user.model";
import { revalidatePath } from "next/cache";
import AnswerModel from "@/database/answer.model";
import InteractionModel from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

export async function getQuestions(params: GetQuestionsParams) {
	try {
		connectToDatabase();

		const { searchQuery, filter } = params;

		const query: FilterQuery<typeof QuestionModel> = {};

		if (searchQuery) {
			query.$or = [
				{ title: { $regex: new RegExp(searchQuery, "i") } },
				{ content: { $regex: new RegExp(searchQuery, "i") } },
			];
		}

		let sortQuery = {};
		switch (filter) {
			case "neweset":
				sortQuery = { createdAt: -1 };
				break;
			case "frequent":
				sortQuery = { views: -1 };
				break;
			case "unanswered":
				query.answers = { $size: 0 };
				break;
			default:
				sortQuery = { createdAt: -1 };
				break;
		}

		const questions = await QuestionModel.find(query)
			.populate({
				path: "tags",
				model: TagModel,
			})
			.populate({ path: "author", model: UserModel })
			.sort(filter);
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
				{ $setOnInsert: { name: tag }, $push: { questions: question._id } },
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

export async function deleteQuestion(params: DeleteQuestionParams) {
	try {
		connectToDatabase();

		const { questionId, path } = params;

		await QuestionModel.deleteOne({ _id: questionId });
		await AnswerModel.deleteMany({ question: questionId });
		await InteractionModel.deleteMany({ question: questionId });
		await TagModel.updateMany(
			{ questions: questionId },
			{ $pull: { questions: questionId } }
		);

		revalidatePath(path);
	} catch (error) {
		throw new Error("Could not find question with that ID");
	}
}
export async function editQuestion(params: EditQuestionParams) {
	try {
		connectToDatabase();

		const { questionId, title, content, path } = params;

		const question = await QuestionModel.findById(questionId).populate("tags");

		if (!question) {
			throw new Error("Question not found");
		}
		question.title = title;
		question.content = content;

		await question.save();
		revalidatePath(path);
	} catch (error) {
		throw new Error("Could not find question with that ID");
	}
}
export async function getTopQuestions() {
	try {
		connectToDatabase();

		const questions = await QuestionModel.find()
			.sort({ likes: -1, views: -1 })
			.limit(5);

		return questions;
	} catch (error) {
		console.log(error);
	}
}
