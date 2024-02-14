"use server";

import UserModel from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
	CreateUserParams,
	DeleteUserParams,
	GetAllUsersParams,
	GetSavedQuestionsParams,
	GetUserByIdParams,
	GetUserStatsParams,
	ToggleSaveQuestionParams,
	UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import QuestionModel from "@/database/question.model";
import TagModel from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Question from "@/components/Forms/Question";
import AnswerModel from "@/database/answer.model";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

export async function getAllUsers(params: GetAllUsersParams) {
	try {
		connectToDatabase();
		const { searchQuery, filter, page = 1, pageSize = 1 } = params;

		const skip = (page - 1) * pageSize;

		const query: FilterQuery<typeof UserModel> = {};
		if (searchQuery) {
			query.$or = [
				{ name: { $regex: new RegExp(searchQuery, "i") } },
				{ username: { $regex: new RegExp(searchQuery, "i") } },
			];
		}
		let sortOptions = {};

		switch (filter) {
			case "new_users":
				sortOptions = { joinedAt: -1 };
				break;
			case "old_users":
				sortOptions = { joinedAt: 1 };
				break;
			case "top_contributors":
				sortOptions = { questionsAsked: -1 };
				break;
			default:
				sortOptions = { joinedAt: -1 };
				break;
		}

		const users = await UserModel.find(query)
			.sort(sortOptions)
			.skip(skip)
			.limit(pageSize);

		const totalUsers = await UserModel.countDocuments(query);
		const isNextPage = totalUsers > skip + users.length;

		if (!users) throw new Error("No users found");

		return { users, isNextPage };
	} catch (error) {
		throw new Error("Error fetching users");
	}
}

export async function getUserById(params: GetUserByIdParams) {
	try {
		connectToDatabase();

		const { userId } = params;

		const user = await UserModel.findOne({ clerkId: userId });
		return user;
	} catch (error) {
		throw new Error("Error fetching user");
	}
}

export async function createUser(userParams: CreateUserParams) {
	try {
		connectToDatabase();

		const newUser = await UserModel.create(userParams);
		return newUser;
	} catch (error) {
		throw new Error("Error creating user");
	}
}

export async function updateUser(userParams: UpdateUserParams) {
	try {
		connectToDatabase();

		const { clerkId, updateData, path } = userParams;

		await UserModel.findOneAndUpdate({ clerkId }, updateData, { new: true });

		revalidatePath(path);
	} catch (error) {
		throw new Error("Error updating user");
	}
}

export async function deleteUser(params: DeleteUserParams) {
	try {
		connectToDatabase();

		const { clerkId } = params;

		const user = await UserModel.findOneAndDelete({ clerkId });

		if (!user) {
			throw new Error("User not found");
		}

		await QuestionModel.deleteMany({ author: user._id });

		const deletedUser = await UserModel.findByIdAndDelete(user._id);

		return deletedUser;
	} catch (error) {
		throw new Error("Error deleting user");
	}
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
	try {
		connectToDatabase();
		const { userId, questionId, path } = params;

		const user = await UserModel.findById({ _id: userId });

		if (!user) throw new Error("User not found");

		const isQuestionSaved = user.saved.includes(questionId);

		let updateQuery = {};
		if (isQuestionSaved) {
			updateQuery = {
				$pull: { saved: questionId },
			};
		} else {
			updateQuery = { $addToSet: { saved: questionId } };
		}

		await UserModel.findOneAndUpdate({ _id: userId }, updateQuery, {
			new: true,
		});

		revalidatePath(path);
	} catch (error) {
		throw new Error("Error toggling save question");
	}
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
	try {
		connectToDatabase();

		const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;

		const skip = (page - 1) * pageSize;

		const query: FilterQuery<typeof Question> = searchQuery
			? { title: { $regex: new RegExp(searchQuery, "i") } }
			: {};

		let sortOptions = {};

		switch (filter) {
			case "most_recent":
				sortOptions = { createdAt: -1 };
				break;
			case "oldest":
				sortOptions = { createdAt: 1 };
				break;
			case "most_voted":
				sortOptions = { upvotes: -1 };
				break;
			case "most_viewed":
				sortOptions = { views: -1 };
				break;
			case "most_answered":
				sortOptions = { answers: -1 };
				break;

			default:
				break;
		}

		const user = await UserModel.findOne({ clerkId }).populate({
			path: "saved",
			match: query,
			options: {
				sort: sortOptions,
				skip: skip,
				limit: pageSize + 1,
			},
			populate: [
				{ path: "tags", model: TagModel, select: "_id name" },
				{
					path: "author",
					model: UserModel,
					select: "_id clerkId name picture",
				},
			],
		});

		const isNext = user.saved.length > pageSize;

		if (!user) {
			throw new Error("User not found");
		}

		const savedQuestions = user.saved;

		return { questions: savedQuestions, isNext };
	} catch (error) {
		throw new Error("Error fetching saved questions");
	}
}

export async function getUserInfo(params: GetUserByIdParams) {
	try {
		connectToDatabase();

		const { userId } = params;

		const user = await UserModel.findOne({ clerkId: userId });

		const questionsAsked = await QuestionModel.countDocuments({
			author: user._id,
		});
		const totalAnswers = await AnswerModel.countDocuments({
			author: user._id,
		});

		const [questionUpvotes] = await QuestionModel.aggregate([
			{ $match: { author: user._id } },
			{ $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
			{ $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
		]);
		const [answerUpvotes] = await AnswerModel.aggregate([
			{ $match: { author: user._id } },
			{ $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
			{ $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
		]);
		const [questionViews] = await AnswerModel.aggregate([
			{ $match: { author: user._id } },
			{ $group: { _id: null, totalViews: { $sum: "$views" } } },
		]);

		if (!user) throw new Error("User not found");
		const criteria = [
			{ type: "QUESTION_COUNT" as BadgeCriteriaType, count: questionsAsked },
			{ type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
			{
				type: "QUESTION_UPVOTES" as BadgeCriteriaType,
				count: questionUpvotes?.totalUpvotes || 0,
			},
			{
				type: "ANSWER_UPVOTES" as BadgeCriteriaType,
				count: answerUpvotes?.totalUpvotes || 0,
			},
			{
				type: "TOTAL_VIEWS" as BadgeCriteriaType,
				count: questionViews?.totalUpvotes || 0,
			},
		];

		const badgeCount = assignBadges({ criteria });

		return { user, questionsAsked, totalAnswers, badgeCount };
	} catch (error) {
		throw new Error("Error fetching user info");
	}
}

export async function getUserQuestions(params: GetUserStatsParams) {
	try {
		connectToDatabase();

		const { userId, page = 1, pageSize = 10 } = params;

		const skip = (page - 1) * pageSize;

		const totalQuestions = await QuestionModel.countDocuments({
			author: userId,
		});

		const userQuestions = await QuestionModel.find({ author: userId })
			.sort({
				createdAt: -1,
				views: -1,
				upvotes: -1,
			})
			.skip(skip)
			.limit(pageSize)
			.populate("tags", "_id name")
			.populate("author", "_id clerkId name picture");

		const totalUserQuestions = await QuestionModel.countDocuments({
			author: userId,
		});

		const isNextPage = totalUserQuestions > skip + userQuestions.length;

		return { totalQuestions, questions: userQuestions, isNextPage };
	} catch (error) {
		throw new Error("Error fetching user answers");
	}
}

export async function getUserAnswers(params: GetUserStatsParams) {
	try {
		connectToDatabase();

		const { userId, page = 1, pageSize = 1 } = params;

		const skip = (page - 1) * pageSize;

		const totalAnswers = await AnswerModel.countDocuments({
			author: userId,
		});

		const userAnswers = await AnswerModel.find({ author: userId })
			.sort({
				upvotes: -1,
			})
			.skip(skip)
			.limit(pageSize)
			.populate("question", "_id title")
			.populate("author", "_id clerkId name picture");

		const totalUserAnswers = await AnswerModel.countDocuments({
			author: userId,
		});

		const isNextPage = totalUserAnswers > skip + userAnswers.length;
		return { totalAnswers, answers: userAnswers, isNextPage };
	} catch (error) {
		throw new Error("Error fetching getUserQuestions");
	}
}
