import { IUser } from "@/database/user.model";

export interface GetQuestionsParams {
	page?: number;
	pageSize?: number;
	searchQuery?: string;
	filter?: string;
}

export interface CreateQuestionParams {
	title: string;
	content: string;
	tags: string[];
	author: schema.type.objectId | IUser;
	path: string;
}
