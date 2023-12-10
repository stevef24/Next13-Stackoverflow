import { Schema, models, model, Document } from "mongoose";

export interface ITag extends Document {
	name: string;
	description: string;
	createdAt: Date;
	followers: Schema.Types.ObjectId[];
	questions: Schema.Types.ObjectId[];
}

const tagSchema = new Schema<ITag>({
	name: { type: String, required: true, unique: true },
	description: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
	questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
});

const TagModel = models.Tag || model<ITag>("Tag", tagSchema);

export default TagModel;
