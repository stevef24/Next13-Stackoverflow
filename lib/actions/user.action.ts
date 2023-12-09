"use server";
import UserModel from "@/database/user.model";
import { connectToDatabase } from "../mongoose";

export async function getUserById(params: any) {
	try {
		connectToDatabase();

		const { userId } = params;

		const user = await UserModel.findOne({ clerkId: userId });
		return user;
	} catch (error) {
		console.log(error);
	}
}
