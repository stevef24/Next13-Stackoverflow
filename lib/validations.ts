import * as z from "zod";
export const QuestionsSchema = z.object({
	title: z.string().min(5).max(130),
	content: z.string().min(100),
	tags: z.array(z.string().min(1).max(15).min(1).max(3)),
});

export const AnswersSchema = z.object({
	answer: z.string().min(20),
});

export const EditUserSchema = z.object({
	name: z.string().min(5).max(20),
	username: z.string().min(5).max(20),
	portfolioWebsite: z.string().url(),
	location: z.string().min(5).max(20),
	bio: z.string().min(5).max(20),
});
