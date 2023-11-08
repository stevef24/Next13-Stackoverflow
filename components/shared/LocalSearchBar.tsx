"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";

type LocalSearchBarProps = {
	route: string;
	iconPosition: "left" | "right";
	imgSrc: string;
	placeholder: string;
	otherClasses?: string;
};

const LocalSearchBar = ({
	route,
	iconPosition,
	imgSrc,
	placeholder,
	otherClasses,
}: LocalSearchBarProps) => {
	return (
		<div className={`relative w-full flex ${otherClasses}`}>
			<div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center  gap-4 rounded-xl px-4">
				{iconPosition === "left" && (
					<Image
						src={imgSrc}
						alt="search icon"
						width={24}
						height={24}
						className="cursor-pointer"
					/>
				)}
				<Input
					type="text"
					placeholder={placeholder}
					value=""
					onChange={() => {}}
					className="paragraph-regular no-focus placeholder  shadow-none outline-none background-light800_darkgradient border-none"
				/>
				{iconPosition === "right" && (
					<Image
						src={imgSrc}
						alt="search icon"
						width={24}
						height={24}
						className="cursor-pointer"
					/>
				)}
			</div>
		</div>
	);
};

export default LocalSearchBar;
