import React from "react";
import Link from "next/link";
import { Badge } from "../ui/badge";

type RenderTagsProps = {
	id: string;
	name?: string;
	questions?: number;
	showCount?: boolean;
};

const RenderTags = ({ id, name, questions, showCount }: RenderTagsProps) => {
	return (
		<Link key={id} href={`/tags/${id}`} className="flex justify-between gap-2">
			<Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
				{name}
			</Badge>
			{showCount && (
				<p className="small-medium text-dark500_light700">{questions}</p>
			)}
		</Link>
	);
};

export default RenderTags;
