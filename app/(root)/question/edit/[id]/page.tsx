import Question from "@/components/Forms/Question";
import { getQuestionByID } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";

const Page = async ({ params }: ParamsProps) => {
	const { userId: clerkId } = auth();
	if (!clerkId) return null;

	const mongoUser = await getUserById({ userId: clerkId });
	const result = await getQuestionByID({ questionId: params.id });

	return (
		<>
			<h1 className="h1-bold text-dark100_light900">Edit Question</h1>
			<div className="mt-9">
				<Question
					type="Edit"
					mongoUserId={mongoUser._id}
					questionDetails={JSON.stringify(result)}
				/>
			</div>
		</>
	);
};

export default Page;
