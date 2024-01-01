"use server";

import UserModel from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
	CreateUserParams,
	DeleteUserParams,
	GetAllUsersParams,
	GetSavedQuestionsParams,
	GetUserByIdParams,
	ToggleSaveQuestionParams,
	UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import QuestionModel from "@/database/question.model";
import TagModel from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import { TypeOf } from "zod";
import Question from "@/components/Forms/Question";

export async function getAllUsers(params: GetAllUsersParams) {
	try {
		connectToDatabase();

		const users = await UserModel.find({});
		if (!users) throw new Error("No users found");

		return { users };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getUserById(params: GetUserByIdParams) {
	try {
		connectToDatabase();

		const { userId } = params;

		const user = await UserModel.findOne({ clerkId: userId });
		return user;
	} catch (error) {
		console.log(error);
	}
}

export async function createUser(userParams: CreateUserParams) {
	try {
		connectToDatabase();

		const newUser = await UserModel.create(userParams);
		return newUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function updateUser(userParams: UpdateUserParams) {
	try {
		connectToDatabase();

		const { clerkId, updateData, path } = userParams;

		await UserModel.findOneAndUpdate({ clerkId }, updateData, { new: true });

		revalidatePath(path);
	} catch (error) {}
}

export async function deleteUser(userParams: DeleteUserParams) {
	const { clerkId } = userParams;

	const user = await UserModel.findOneAndDelete({ clerkId });

	if (!user) {
		throw new Error("User not found");
	}

	// const userQuestionIds = await QuestionModel.find({
	// 	author: user._id,
	// }).distinct("_id");

	await QuestionModel.deleteMany({ author: user._id });

	// TODO delete all user answers , comments and replies

	// const deletedUser = await UserModel.findByIdAndDelete(user._id);
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
	try {
		connectToDatabase();
		const { userId, questionId, path } = params;

		const user = await UserModel.findById({ _id: userId });
		console.log(user);

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
		console.log(error);
		throw error;
	}
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
	try {
		connectToDatabase();

		const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;

		const skipAmount = (page - 1) * pageSize;

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
		const query: FilterQuery<typeof Question> = searchQuery
			? { title: { $regex: new RegExp(searchQuery, "i") } }
			: {};

		const user = await UserModel.findOne({ clerkId }).populate({
			path: "saved",
			match: query,
			options: {
				sort: sortOptions,
				skip: skipAmount,
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
		console.log(error);
		throw error;
	}
}
