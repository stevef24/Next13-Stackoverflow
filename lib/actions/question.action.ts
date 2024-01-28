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
	RecommendedParams,
} from "./shared.types";
import UserModel from "@/database/user.model";
import { revalidatePath } from "next/cache";
import AnswerModel from "@/database/answer.model";
import InteractionModel from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

export async function getQuestions(params: GetQuestionsParams) {
	try {
		connectToDatabase();

		const { searchQuery, filter, page = 1, pageSize = 10 } = params;

		const skip = (page - 1) * pageSize;

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
			.skip(skip)
			.limit(pageSize)
			.sort(sortQuery);

		const totalQuestions = await QuestionModel.countDocuments(query);

		const isNextPage = totalQuestions > skip + questions.length;

		return { questions, isNextPage };
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

		await InteractionModel.create({
			user: author,
			question: question._id,
			tags: tagDocuments,
			action: "ask_question",
		});

		// increment author reputation by +5 points for creating a question
		await UserModel.findByIdAndUpdate(author, {
			$inc: { reputation: 5 },
		});

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
		await UserModel.findByIdAndUpdate(userId, {
			$inc: { reputation: hasupVoted ? -1 : 1 },
		});

		//increament user reputation for receiving an upvote or downvote

		await UserModel.findByIdAndUpdate(question.author, {
			$inc: { reputation: hasupVoted ? -10 : 10 },
		});

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

		await UserModel.findByIdAndUpdate(userId, {
			$inc: { reputation: hasdownVoted ? -1 : 1 },
		});

		//increament user reputation for receiving an upvote or downvote

		await UserModel.findByIdAndUpdate(question.author, {
			$inc: { reputation: hasdownVoted ? -10 : 10 },
		});

		revalidatePath(path);
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

export async function getRecommendedQuestions(params: RecommendedParams) {
	try {
		await connectToDatabase();

		const { userId, page = 1, pageSize = 20, searchQuery } = params;

		// find user
		const user = await UserModel.findOne({ clerkId: userId });

		if (!user) {
			throw new Error("user not found");
		}

		const skipAmount = (page - 1) * pageSize;

		// Find the user's interactions
		const userInteractions = await InteractionModel.find({ user: user._id })
			.populate("tags")
			.exec();

		// Extract tags from user's interactions
		const userTags = userInteractions.reduce((tags, interaction) => {
			if (interaction.tags) {
				tags = tags.concat(interaction.tags);
			}
			return tags;
		}, []);

		// Get distinct tag IDs from user's interactions
		const distinctUserTagIds = [
			// @ts-ignore
			...new Set(userTags.map((tag: any) => tag._id)),
		];

		const query: FilterQuery<typeof QuestionModel> = {
			$and: [
				{ tags: { $in: distinctUserTagIds } }, // Questions with user's tags
				{ author: { $ne: user._id } }, // Exclude user's own questions
			],
		};

		if (searchQuery) {
			query.$or = [
				{ title: { $regex: searchQuery, $options: "i" } },
				{ content: { $regex: searchQuery, $options: "i" } },
			];
		}

		const totalQuestions = await QuestionModel.countDocuments(query);

		const recommendedQuestions = await QuestionModel.find(query)
			.populate({
				path: "tags",
				model: TagModel,
			})
			.populate({
				path: "author",
				model: UserModel,
			})
			.skip(skipAmount)
			.limit(pageSize);

		const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

		return { questions: recommendedQuestions, isNext };
	} catch (error) {
		console.error("Error getting recommended questions:", error);
		throw error;
	}
}
