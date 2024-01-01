"use server";

import UserModel from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
	GetQuestionsByTagIdParams,
	GetTopInteractedTagsParams,
} from "./shared.types";
import TagModel, { ITag } from "@/database/tag.model";
import { getQuestionByID } from "./question.action";
import { FilterQuery } from "mongoose";
import Question from "@/components/Forms/Question";
import QuestionModel from "@/database/question.model";
import { create } from "domain";

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

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
	try {
		connectToDatabase();
		const { tagId, page = 1, pageSize = 10, searchQuery } = params;

		const tagFilter: FilterQuery<ITag> = { _id: tagId };

		const tag = await TagModel.findOne(tagFilter).populate({
			path: "questions",
			model: QuestionModel,
			match: searchQuery
				? { title: { $regex: searchQuery, $options: "i" } }
				: {},
			options: {
				sort: { createdAt: -1 },
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
		console.log(tag);

		if (!tag) {
			throw new Error("tag not found");
		}

		const questions = tag.questions;

		return { tagTitle: tag.name, questions };
	} catch (error) {
		console.log(error);
		throw new Error("No tags found");
	}
}
