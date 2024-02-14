"use server";

import UserModel from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
	GetAllTagsParams,
	GetQuestionsByTagIdParams,
	GetTopInteractedTagsParams,
} from "./shared.types";
import TagModel, { ITag } from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import QuestionModel from "@/database/question.model";

export async function getAllTags(params: GetAllTagsParams) {
	try {
		connectToDatabase();
		const { searchQuery, filter, pageSize = 20, page = 1 } = params;

		const skip = (page - 1) * pageSize;

		const query: FilterQuery<typeof TagModel> = {};

		if (searchQuery) {
			query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
		}

		let sortOptions = {};

		switch (filter) {
			case "popular":
				sortOptions = { questions: -1 };
				break;
			case "recent":
				sortOptions = { createdAt: -1 };
				break;
			case "name":
				sortOptions = { name: -1 };
				break;
			case "oldest":
				sortOptions = { createdAt: 1 };
				break;
			default:
				sortOptions = { questionCount: -1 };
				break;
		}

		const tags = await TagModel.find(query)
			.skip(skip)
			.limit(pageSize)
			.sort(sortOptions);

		const totalTags = await TagModel.countDocuments(query);
		const isNextPage = totalTags > skip + tags.length;
		if (!tags) throw new Error("No tags found");

		return { tags, isNextPage };
	} catch (error) {
		throw new Error("No tags found");
	}
}

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
	try {
		connectToDatabase();

		const { userId } = params;

		const user = await UserModel.findById(userId);

		if (!user) throw new Error("User not found");

		return [
			{ _id: "1", name: "tag" },
			{ _id: "2", name: "tag2" },
		];
	} catch (error) {
		throw error;
	}
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
	try {
		connectToDatabase();
		const { tagId, page = 1, pageSize = 10, searchQuery } = params;

		const tagFilter: FilterQuery<ITag> = { _id: tagId };

		const skip = (page - 1) * pageSize;

		const tag = await TagModel.findOne(tagFilter).populate({
			path: "questions",
			model: QuestionModel,
			match: searchQuery
				? { title: { $regex: searchQuery, $options: "i" } }
				: {},
			options: {
				sort: { createdAt: -1 },
				skip,
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

		if (!tag) {
			throw new Error("tag not found");
		}

		const questions = tag.questions;

		const isNextPage = tag.questions.length > pageSize;

		return { tagTitle: tag.name, questions, isNextPage };
	} catch (error) {
		throw new Error("No tags found");
	}
}

export async function getTopTags() {
	try {
		connectToDatabase();

		const tags = await TagModel.aggregate([
			{
				$project: {
					name: true,
					questionCount: { $size: "$questions" },
				},
			},
			{ $sort: { questionCount: -1 } },
			{ $limit: 5 },
		]);

		if (!tags) throw new Error("No tags found");
		return tags;
	} catch (error) {
		throw new Error("No tags found");
	}
}
