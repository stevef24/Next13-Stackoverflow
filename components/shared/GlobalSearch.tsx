import Image from "next/image";
import { Input } from "@/components/ui/input";

const GlobalSearch = () => {
	return (
		<div className="relative w-full max-w-[600px] max-lg:hidden">
			<div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
				<Image
					src="/assets/icons/search.svg"
					alt="search"
					width={24}
					height={24}
				/>
				<Input
					type="text"
					placeholder="search globally"
					value=""
					className="paragraph-regular no-focus placeholder  shadow-none outline-none background-light800_darkgradient border-none"
				/>
			</div>
		</div>
	);
};

export default GlobalSearch;