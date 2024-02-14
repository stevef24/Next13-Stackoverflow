import { JobFilterParams } from "./shared.types";

export async function getJobsList({ query, page, filter }: JobFilterParams) {
	const api_key: string = process.env.NEXT_PUBLIC_RAPID_API_KEY || "";
	try {
		const url = `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}&num_pages=1`;
		const options = {
			method: "GET",
			headers: {
				"X-RapidAPI-Key": api_key,
				"X-RapidAPI-Host": "jsearch.p.rapidapi.com",
			},
		};
		// "6b4f55fc0cmsh1fcf93fb6de6e0ep132b23jsn36ca8943529e"
		const response = await fetch(url, options);
		const results = await response.json();
		console.log(results);
		return results;
	} catch (error) {
		throw new Error("No jobs found");
	}
}
