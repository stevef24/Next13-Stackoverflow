import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
	clerkId: string;
	name: string;
	username: string;
	email: string;
	password?: string;
	bio?: string;
	picture: string;
	Location?: string;
	portfolio?: string;
	reputation?: number;
	createdAt: Date;
	joined: Date;
	savedPosts: string[];
}

const UserSchema = new Schema({
	clerkId: { type: String, required: true },
	name: { type: String, required: true },
	bio: { type: String, required: false },
	picture: { type: String, required: true },
	Location: { type: String, required: false },
	username: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String },
	createdAt: { type: Date, default: Date.now },
	joined: { type: Date, default: Date.now },
	savedPosts: [{ type: Schema.Types.ObjectId, ref: "Question" }],
	portfolio: { type: String, required: false },
	reputation: { type: Number, default: 0 },
});

const UserModel = models.User || model<IUser>("User", UserSchema);

export default UserModel;
