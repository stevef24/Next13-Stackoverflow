import { JobFilterParams } from "./shared.types";

export async function getJobsList({ query, page }: JobFilterParams) {
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
		const response = await fetch(url, options);
		const results = await response.json();

		const isNextPage = results.data.length + 1 > 10;

		return { results, isNextPage };
	} catch (error) {
		throw new Error("No jobs found");
	}
}
