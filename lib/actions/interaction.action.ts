"use server";

import QuestionModel from "@/database/question.model";
import { ViewQuestionParams } from "./shared.types";
import InteractionModel from "@/database/interaction.model";
import { connectToDatabase } from "../mongoose";

export async function viewQuestions(params: ViewQuestionParams) {
	try {
		connectToDatabase();
		const { questionId, userId } = params;

		await QuestionModel.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

		if (userId) {
			const existingInteraction = await InteractionModel.findOne({
				user: userId,
				action: "view",
				question: questionId,
			});
			if (existingInteraction) {
				console.log("user }has already viewed this question");
			}
		}

		await InteractionModel.create({
			user: userId,
			action: "view",
			question: questionId,
		});
	} catch (error) {
		console.log(error);
		throw error;
	}
}
