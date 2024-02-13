import { JobFilterParams } from "./shared.types";

export async function getJobsList({ query, page, filter }: JobFilterParams) {
	try {
		const url = `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}&num_pages=1`;
		console.log(url);
		const options = {
			method: "GET",
			headers: {
				"X-RapidAPI-Key": "6b4f55fc0cmsh1fcf93fb6de6e0ep132b23jsn36ca8943529e",
				"X-RapidAPI-Host": "jsearch.p.rapidapi.com",
			},
		};

		const response = await fetch(url, options);
		const results = await response.json();
		return results;
	} catch (error) {
		throw new Error("No jobs found");
	}
}
