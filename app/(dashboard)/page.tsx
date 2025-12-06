import { CreatePostForm } from "@/components/CreatePostForm";
import { Feed } from "@/components/Feed";

export default function DashboardPage() {
  return (
    <div className="max-w-xl mx-auto py-6 flex flex-col gap-6">
      <CreatePostForm />
      <Feed />
    </div>
  );
}
