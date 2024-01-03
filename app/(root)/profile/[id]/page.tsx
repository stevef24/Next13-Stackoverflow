import { getUserInfo } from "@/lib/actions/user.action";
import { URLProps } from "@/types";

const Page = async ({ params, searchParams }: URLProps) => {
	const userId = params.id;

	const result = await getUserInfo({
		userId,
	});

	console.log(result);

	return <div>Page</div>;
};

export default Page;
