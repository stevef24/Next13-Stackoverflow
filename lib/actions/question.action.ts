"use server";

import QuestionModel from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import TagModel from "@/database/tag.model";
import { set } from "mongoose";

export async function createQuestion(params: any) {
	try {
		connectToDatabase();

		const { title, content, tags, author, path } = params;
		const question = await QuestionModel.create({
			title,
			content,
			author,
		});

		const tagDocuments = [];
		//create tags or get the existing ones
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
	} catch (error) {}
}
