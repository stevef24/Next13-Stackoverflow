"use server";

import UserModel from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
	CreateUserParams,
	DeleteUserParams,
	GetAllUsersParams,
	GetUserByIdParams,
	UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import QuestionModel from "@/database/question.model";

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
