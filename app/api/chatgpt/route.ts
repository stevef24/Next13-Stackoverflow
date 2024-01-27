import { response } from "express";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
	const { question } = await request.json();
	console.log(question);

	try {
		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages: [
					{ role: "system", content: "You are a helpfull developer assistant" },
					{ role: "user", content: `tell me about ${question}` },
				],
			}),
		});
		const responseData = await response.json();
		const reply = responseData.choices[0].message.content;
		return NextResponse.json({ reply });
	} catch (error: any) {
		return NextResponse.json({ error: error.message });
	}
};
