"use server";

import AnswerModel from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import QuestionModel from "@/database/question.model";
import { revalidatePath } from "next/cache";
import UserModel from "@/database/user.model";

export async function createAnswer(params: CreateAnswerParams) {
	try {
		connectToDatabase();

		const { content, author, question, path } = params;

		const newAnswer = await AnswerModel.create({ content, author, question });

		// Add the answer to the question's answers array
		const questionObject = await QuestionModel.findByIdAndUpdate(question, {
			$push: { answers: newAnswer._id },
		});

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getAllAnswers(params: GetAnswersParams) {
	try {
		connectToDatabase();
		const { questionId } = params;

		const answers = await AnswerModel.find({ question: questionId })
			.populate("author", "_id clerkId name picture")
			.sort({ createdAt: -1 });

		return { answers };
	} catch (error) {
		console.log(error);
		throw error;
	}
}
