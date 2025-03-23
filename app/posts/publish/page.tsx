import { publishPost, publishPostInputs } from "@/lib/api/posts";
import PublishForm from "./components/PublishForm";
import { cookies } from "next/headers";
export default function PublishPost() {
  async function handleSubmit(data: publishPostInputs) {
    "use server";
    try {
      const cookieStore = await cookies();
      const userId = cookieStore.get("userId")?.value;
      await publishPost({ ...data, user_id: userId });
    } catch (error: any) {
      throw new Error("Failed to publish post" + error?.message);
    }
  }

  return <PublishForm onSubmit={handleSubmit} />;
}
