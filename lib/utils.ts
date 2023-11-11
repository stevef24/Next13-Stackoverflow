import { type ClassValue, clsx } from "clsx";
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
		return `${(count / 1000000).toFixed(1)}M`;
	} else if (count >= 1000) {
		return `${(count / 1000).toFixed(1)}k`;
	} else {
		return count.toString();
	}
};
