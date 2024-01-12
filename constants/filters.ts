export type AnswerFilter = {
	name: string;
	value: string;
};

export const AnswerFilters: AnswerFilter[] = [
	{ name: "Highest Upvotes", value: "highestupvotes" },
	{ name: "Lowest Upvotes", value: "lowestupvotes" },
	{ name: "Most Recent", value: "recent" },
	{ name: "Oldest", value: "oldest" },
];

export const UserFilters: AnswerFilter[] = [
	{ name: "New Users", value: "new_users" },
	{ name: "Old Users", value: "old_users" },
	{ name: "Top Contributors", value: "top_contributors" },
];

export const QuestionFilters: AnswerFilter[] = [
	{ name: "Most Recent", value: "most_recent" },
	{ name: "Oldest", value: "oldest" },
	{ name: "Most Voted", value: "most_voted" },
	{ name: "Most Viewed", value: "most_viewed" },
	{ name: "Most Answered", value: "most_answered" },
];

export const TagFilters: AnswerFilter[] = [
	{ name: "Popular", value: "popular" },
	{ name: "Most Recent", value: "recent" },
	{ name: "Name", value: "name" },
	{ name: "Oldest", value: "oldest" },
];

export const HomePageFilters: AnswerFilter[] = [
	{ name: "Newest", value: "newest" },
	{ name: "Recommended", value: "recommended" },
	{ name: "Frequent", value: "frequent" },
	{ name: "Unanswered", value: "unanswered" },
];

export const GlobalSearchFilters: AnswerFilter[] = [
	{ name: "Question", value: "question" },
	{ name: "Answer", value: "answer" },
	{ name: "User", value: "user" },
	{ name: "Tag", value: "tag" },
];
