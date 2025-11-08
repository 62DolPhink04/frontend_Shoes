import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const BlogDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecure();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosSecure.get(`/blog/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    try {
      await axiosSecure.post(`/blog/posts/${id}/like`);
      // Refresh post data
      const response = await axiosSecure.get(`/blog/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.post(`/blog/posts/${id}/comment`, { content: comment });
      // Refresh post data
      const response = await axiosSecure.get(`/blog/posts/${id}`);
      setPost(response.data);
      setComment("");
    } catch (error) {
      console.error("Error commenting:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
        <div className="prose max-w-none mb-8">{post.content}</div>

        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
          >
            ❤️ {post.likes.length} Likes
          </button>
          <span>Share: 🔗</span>
        </div>

        {user && (
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Add a comment..."
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Post Comment
            </button>
          </form>
        )}

        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Comments</h3>
          {post.comments.map((comment, index) => (
            <div key={index} className="border-b pb-4">
              <p className="text-gray-600">{comment.content}</p>
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
