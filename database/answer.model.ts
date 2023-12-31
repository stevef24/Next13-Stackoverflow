import { Schema, models, model, Document } from "mongoose";

export interface IAnswer extends Document {
	content: string;
	upvotes: Schema.Types.ObjectId[];
	downvotes: Schema.Types.ObjectId[];
	author: Schema.Types.ObjectId;
	question: Schema.Types.ObjectId;
	createdAt: Date;
}

const AnswerSchema = new Schema({
	content: { type: String, required: true },
	upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	downvotes: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
	author: { type: Schema.Types.ObjectId, ref: "User", required: true },
	question: { type: Schema.Types.ObjectId, ref: "Question" },
	createdAt: { type: Date, default: Date.now },
});

const AnswerModel = models.Answer || model<IAnswer>("Answer", AnswerSchema);

export default AnswerModel;
