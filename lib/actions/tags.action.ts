"use server";

import UserModel from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetTopInteractedTagsParams } from "./shared.types";
import TagModel from "@/database/tag.model";

export async function getAllTags() {
	try {
		connectToDatabase();

		const tags = await TagModel.find({});
		if (!tags) throw new Error("No tags found");

		return { tags };
	} catch (error) {
		console.log(error);
		throw new Error("No tags found");
	}
}

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
	try {
		connectToDatabase();

		const { userId } = params;

		const user = await UserModel.findById(userId);

		if (!user) throw new Error("User not found");

		// Find interactions for the user and group by tags...
		// Interaction...

		return [
			{ _id: "1", name: "tag" },
			{ _id: "2", name: "tag2" },
		];
	} catch (error) {
		console.log(error);
		throw error;
	}
}
