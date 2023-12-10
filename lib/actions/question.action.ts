"use server";

import QuestionModel from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import TagModel from "@/database/tag.model";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import UserModel from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
	try {
		connectToDatabase();

		const questions = await QuestionModel.find({})
			.populate({
				path: "tags",
				model: TagModel,
			})
			.populate({ path: "author", model: UserModel });

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
				{ $setOnInsert: { name: tag }, $push: { question: question._id } },
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
