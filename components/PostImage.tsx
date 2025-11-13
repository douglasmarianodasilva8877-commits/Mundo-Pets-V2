interface PostImageProps {
  post: {
    image?: string;
  };
}

export default function PostImage({ post }: PostImageProps) {
  if (!post?.image) return null;

  return (
    <div className="mt-3 flex justify-center">
      <img
        src={post.image}
        alt="Post Image"
        className="max-h-[500px] rounded-lg object-cover"
      />
    </div>
  );
}
