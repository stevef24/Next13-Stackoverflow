"use client";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { Sheet, SheetClose } from "../ui/sheet";
import Image from "next/image";
import Link from "next/link";

const NavContent = ({ hide = false }: { hide: Boolean }) => {
	const pathName = usePathname();
	return (
		<section className="flex h-full flex-col gap-6 pt-16 w-full">
			<Sheet>
				{sidebarLinks.map((item) => {
					const isActive =
						(pathName.includes(item.route) && item.route.length > 1) ||
						pathName === item.route;

					return (
						<SheetClose asChild key={item.route}>
							<Link
								href={item.route}
								className={`${
									isActive
										? "primary-gradient rounded-lg text-light-900"
										: "text-dark300_light900"
								} flex items-center justify-start gap-4 bg-transparent p-4`}
							>
								<Image
									src={item.imgURL}
									alt={item.label}
									width={20}
									height={20}
									className={`${isActive ? "" : "invert-colors"}`}
								/>
								<p className={hide ? "max-lg:hidden" : ""}>{item.label}</p>
							</Link>
						</SheetClose>
					);
				})}
			</Sheet>
		</section>
	);
};

export default NavContent;
