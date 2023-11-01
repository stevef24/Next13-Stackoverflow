import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet";
import { SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const NavContent = () => {
	return <h1>Nav Content</h1>;
};

const MobileNav = () => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Image
					src="/assets/icons/hamburger.svg"
					alt={"Menu"}
					width={36}
					height={36}
					className="invert-colors sm:hidden"
				/>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="background-light900_dark200 border-none"
			>
				<Link href="/" className="flex items-center gap-1">
					<Image
						src="/assets/images/site-logo.png"
						alt="DevFlow logo"
						width={23}
						height={23}
					/>
					<p className="h2-bold text-dark-100_light900">
						Dev <span className="text-primary-500">Overflow</span>
					</p>
				</Link>
				<div>
					<SheetClose asChild>
						<NavContent />
					</SheetClose>
					<SignedOut>
						<div className="flex flex-col gap-3">
							<SheetClose asChild>
								<Link href="/sign-in">
									<Button>
										<span className="primary-text-gradient"></span>
									</Button>
								</Link>
							</SheetClose>
						</div>
					</SignedOut>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MobileNav;
