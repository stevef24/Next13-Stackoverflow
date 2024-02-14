import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
	mongoose.set("strictQuery", true);

	if (!process.env.MONGODB_URI) {
		throw new Error("missing mongodb uri");
	}

	if (isConnected) {
		return console.log("mongo already connected");
	}

	try {
		await mongoose.connect(process.env.MONGODB_URI, { dbName: "devoverflow" });
		isConnected = true;
	} catch (error) {
		console.error(error);
	}
};
