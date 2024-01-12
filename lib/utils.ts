import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date) => {
	const now = new Date();
	const diff = now.getTime() - createdAt.getTime();
	const minute = 60 * 1000;
	const hour = minute * 60;
	const day = hour * 24;
	const week = day * 7;
	const month = day * 30;
	const year = day * 365;

	if (diff < minute) {
		const seconds = Math.floor(diff / 1000);
		return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
	} else if (diff < hour) {
		const minutes = Math.floor(diff / minute);
		return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
	} else if (diff < day) {
		const hours = Math.floor(diff / hour);
		return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
	} else if (diff < week) {
		const days = Math.floor(diff / day);
		return `${days} ${days === 1 ? "day" : "days"} ago`;
	} else if (diff < month) {
		const weeks = Math.floor(diff / week);
		return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
	} else if (diff < year) {
		const months = Math.floor(diff / month);
		return `${months} ${months === 1 ? "month" : "months"} ago`;
	} else {
		const years = Math.floor(diff / year);
		return `${years} ${years === 1 ? "year" : "years"} ago`;
	}
};

export const formatNumber = (count: number) => {
	if (count >= 1000000) {
		const formattedNum = (count / 1000000).toFixed(1);
		return `${formattedNum}M`;
	} else if (count >= 1000) {
		const formattedNum = (count / 1000).toFixed(1);
		return `${formattedNum}K`;
	} else {
		return count.toString();
	}
};

export function capitalizeFirstLetter(inputString: string): string {
	// Check if the inputString is not empty
	if (inputString) {
		// Capitalize the first letter and concatenate it with the rest in lowercase
		const resultString =
			inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
		return resultString;
	} else {
		return inputString; // Return empty string if input is empty
	}
}

export function getJoinedDate(date: Date): string {
	const month = date.toLocaleString("default", { month: "long" });
	const year = date.getFullYear();
	return `${month} ${year}`;
}

interface UrlQueryParams {
	params: string;
	key: string;
	value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
	const currentURL = qs.parse(params);

	currentURL[key] = value;
	return qs.stringifyUrl(
		{
			url: window.location.pathname,
			query: currentURL,
		},
		{
			skipNull: true,
		}
	);
};

interface RemoveUrlQueryParams {
	params: string;
	keysToRemove: string[];
}
export const removeUrlQueryParams = ({
	params,
	keysToRemove,
}: RemoveUrlQueryParams) => {
	const currentURL = qs.parse(params);
	keysToRemove.forEach((key) => {
		delete currentURL[key];
	});
	return qs.stringifyUrl(
		{
			url: window.location.pathname,
			query: currentURL,
		},
		{
			skipNull: true,
		}
	);
};
